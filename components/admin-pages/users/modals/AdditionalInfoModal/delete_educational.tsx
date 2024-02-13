import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { mutate } from "swr";

export const DeleteUserEducational = (props: DeleteUserEducational) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange, education } = props;
  const router = useRouter();

  const handleCancel = () => {
    // Handle cancel event, e.g., close the modal
    if (onOpenChange) {
      onOpenChange(false);
    }
  };
  const handleContinue = async () => {
    try {
      const res = await fetch(baseUrl + '/api/users/additional_info/delete_education/' + education.user_education_id, {
        method: "PUT",
        headers: authHeaders(session.user.access_token)
      })

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Education Successfuly Deleted.",
          variant: 'success',
          duration: 2000
        });
        mutate('/api/user/' + education.user_id + '/additional_info/get_education');
      }
    } catch {
      toast({
        title: "Error uppon removing education.",
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
            This action cannot be undone. This will permanently delete your education.
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

type DeleteUserEducational = {
  open?: boolean,
  onOpenChange?: (open?: boolean) => void,
  education?: any
}