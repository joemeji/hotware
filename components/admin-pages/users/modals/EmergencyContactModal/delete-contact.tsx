import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import React from "react";
import { mutate } from "swr";

export const DeleteContact = (props: DeleteContact) => {
  const { open, onOpenChange, contact } = props;
  const router = useRouter();

  const handleCancel = () => {
    // Handle cancel event, e.g., close the modal
    if (onOpenChange) {
      onOpenChange(false);
    }
  };
  const handleContinue = async () => {
    try {
      const res = await fetch('/api/user/' + contact.user_id + '/emergency_contact/' + contact.uec_id + '/delete', {
        method: "PUT"
      })

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Contact Successfuly Deleted.",
          variant: 'success',
          duration: 2000
        });
        mutate('/api/user/' + contact.user_id + '/emergency_contact/get');
      }
    } catch {
      toast({
        title: "Error uppon deleting contact.",
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
            This action cannot be undone. This will permanently delete {contact && contact.uec_firstname} {contact && contact.uec_lastname} as your emergency contact.
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

type DeleteContact = {
  open?: boolean,
  onOpenChange?: (open?: boolean) => void,
  contact?: any
}