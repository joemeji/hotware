import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { mutate } from "swr";

export const DeleteChild = (props: DeleteChild) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange, child } = props;
  const router = useRouter();

  const handleCancel = () => {
    // Handle cancel event, e.g., close the modal
    if (onOpenChange) {
      onOpenChange(false);
    }
  };
  const handleContinue = async () => {
    try {
      const res = await fetch(baseUrl + '/api/users/family/delete_child/' + child.user_child_id, {
        method: "PUT",
        headers: authHeaders(session.user.access_token)
      })

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Children Successfuly Deleted.",
          variant: 'success',
          duration: 2000
        });
        mutate('/api/user/' + child.user_id + '/family/get_child');
      }
    } catch {
      toast({
        title: "Error uppon deleting children.",
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
            This action cannot be undone. This will permanently delete {child && child.user_child_first_name} {child && child.user_child_last_name}.
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

type DeleteChild = {
  open?: boolean,
  onOpenChange?: (open?: boolean) => void,
  child?: any
}