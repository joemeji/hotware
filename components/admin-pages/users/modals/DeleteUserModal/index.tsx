import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import React from "react";

export const DeleteUser = (props: DeleteUser) => {
  const { open, onOpenChange, user } = props;
  const router = useRouter();

  const handleCancel = () => {
    // Handle cancel event, e.g., close the modal
    if (onOpenChange) {
      onOpenChange(false);
    }
  };
  const handleContinue = async () => {
    try {
      const res = await fetch('/api/user/' + user.user_id + '/delete', {
        method: "PUT"
      })

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "User Successfuly Deleted.",
          variant: 'success',
          duration: 2000
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
          router.push('/admin/users');
        }, 300);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {
      toast({
        title: "Error uppon deleting user.",
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
            This action cannot be undone. This will permanently delete {user && user.user_firstname} {user && user.user_lastname}.
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

type DeleteUser = {
  open?: boolean,
  onOpenChange?: (open?: boolean) => void,
  user?: any
}