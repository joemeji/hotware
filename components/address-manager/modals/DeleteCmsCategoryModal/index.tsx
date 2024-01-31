import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR, { mutate } from "swr";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

export const DeleteCmsCategoryModal = (props: DeleteCmsCategoryModal) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange, cms } = props;

  const handleCancel = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/cms/delete_category/${cms.cms_category_id}`,
        {
          method: "PUT",
          headers: authHeaders(session.user.access_token),
        }
      );

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/cms/get_categories`);
        toast({
          title: "Successfully Deleted",
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);
      } else {
        toast({
          title: json.message,
          variant: "destructive",
          duration: 4000,
        });
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?sd</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {cms && cms.cms_category_name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type DeleteCmsCategoryModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  cms?: any;
};
