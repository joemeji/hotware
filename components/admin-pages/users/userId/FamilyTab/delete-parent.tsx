import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { mutate } from "swr";

export const DeleteParent = (props: DeleteParent) => {
	const { data: session }: any = useSession();
	const { open, onOpenChange, parent, relation } = props;
	const router = useRouter();
	console.log({ parent: parent, relation: relation })
	const handleCancel = () => {
		// Handle cancel event, e.g., close the modal
		if (onOpenChange) {
			onOpenChange(false);
		}
	};
	const handleContinue = async () => {
		try {
			const _relation = {
				relation: relation
			}
			const res = await fetch(baseUrl + '/api/users/family/delete_parent/' + parent.user_family_id, {
				method: "PUT",
				body: JSON.stringify(_relation),
				headers: authHeaders(session.user.access_token)
			})

			const json = await res.json();
			if (json && json.success) {
				toast({
					title: "Parent Successfuly Deleted.",
					variant: 'success',
					duration: 2000
				});
				mutate('/api/user/' + parent.user_id + '/family/get_parent');
			}
		} catch {
			toast({
				title: "Error uppon deleting parent.",
				variant: 'destructive',
				duration: 2000
			});
		}
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete {relation == 'Mother' ? parent && parent.user_family_f_fname : parent && parent.user_family_m_fname}.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleContinue}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

type DeleteParent = {
	open?: boolean,
	onOpenChange?: (open?: boolean) => void,
	parent?: any,
	relation?: any
}