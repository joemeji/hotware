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
import { useRouter } from "next/router";
import React from "react";
import useSWR, { mutate } from "swr";

export const AddToBothCategories = (props: AddToBothCategories) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange, cms } = props;

  const router = useRouter();
  const page = router.query?.page || 1;
  let paramsObj: any = { page: String(page) };
  let searchParams = new URLSearchParams(paramsObj);

  const handleCancel = () => {
    // Handle cancel event, e.g., close the modal
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/cms/add_both_categories/${cms.cms_id}`,
        {
          method: "POST",
          headers: authHeaders(session.user.access_token),
        }
      );

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/cms?${searchParams.toString()}`);
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add to Both Categories</AlertDialogTitle>
          <AlertDialogDescription>
            {
              "Are you sure you want to make this address available to all categories? You won't be able to revert this."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type AddToBothCategories = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  cms?: any;
};
