import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { fetcher } from "@/utils/api.config";
import React from "react";
import useSWR, { mutate } from "swr";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

export const DeleteLoadingListModal = (props: deleteLoadingList) => {
  const { open, onOpenChange, loadingID } = props;

  const { data, isLoading, error } = useSWR(open ? '/api/loading-list/' + loadingID + '/details' : null, fetcher, swrOptions);

  const handleCancel = () => {
    // Handle cancel event, e.g., close the modal
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async () => {
    try {
      const res = await fetch('/api/loading-list/' + loadingID + '/delete', {
        method: "PUT"
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/loading-list/${loadingID}/details`);
        mutate(`/api/loading-list/lists`);
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
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {data && data.loading_description}.
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

export const DeleteLoadingListItemModal = (props: deleteLoadingListItem) => {
  const { open, onOpenChange, id, isItem, loadingID } = props;
  const urlDelete = isItem ? '/api/loading-list/' + loadingID + '/loading-items/item/' + id + '/delete' : '/api/loading-list/' + loadingID + '/loading-items/category/' + id + '/delete';
  const urlGet = isItem ? '/api/loading-list/' + loadingID + '/loading-items/item/' + id + '/get_item' : '/api/loading-list/' + loadingID + '/loading-items/category/' + id + '/get_category';
  const { data, isLoading, error } = useSWR(open ? urlGet : null, fetcher, swrOptions);
  console.log(data && data)
  const handleCancel = () => {
    // Handle cancel event, e.g., close the modal
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async () => {
    try {
      const res = await fetch(urlDelete, {
        method: "PUT"
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/loading-list/${loadingID}/loading-items/lists`);
        toast({
          title: "Successfully Deleted",
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
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {data && (isItem ? data.loading_item_name : data.loading_category_name)}.
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

type deleteLoadingListItem = {
  open?: boolean,
  onOpenChange?: (open?: boolean) => void,
  id?: any,
  isItem?: boolean,
  loadingID: any
}

type deleteLoadingList = {
  open?: boolean
  onOpenChange?: (open?: boolean) => void,
  loadingID?: any
}