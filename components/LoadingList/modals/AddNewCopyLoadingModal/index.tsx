import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { fetcher } from "@/utils/api.config";
import React from "react";
import useSWR, { mutate } from "swr";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

export const AddNewCopyLoadingList = (props: AddNewCopyLoadingList) => {
  const { open, onOpenChange, loadingID } = props;

  const { data, isLoading, error } = useSWR(open ? '/api/loading-list/' + loadingID + '/details' : null, fetcher, swrOptions);

  const handleCancel = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async () => {
    try {
      const res = await fetch('/api/loading-list/' + loadingID + '/create_copy', {
        method: "POST"
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/loading-list/lists`);
        toast({
          title: "Loading List Successfully Copied",
          variant: 'success',
          duration: 4000
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {

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
            New Copy?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to create a new copy of {data && data.loading_description}.
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

type AddNewCopyLoadingList = {
  open?: boolean
  onOpenChange?: (open?: boolean) => void,
  loadingID?: any
}