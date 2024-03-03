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

export const DeleteData = (props: DeleteData) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange, dir, onSuccess } = props;

  const handleCancel = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async () => {
    try {
      let url: any;
      if (dir.is_dir === "1") {
        url = `${baseUrl}/api/users/service/delete_category/${dir.usc_id}`;
      } else {
        url = `${baseUrl}/api/users/service/delete_skill/${dir.usc_id}`;
      }

      const res = await fetch(url, {
        method: "PUT",
        headers: authHeaders(session.user.access_token),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
          onSuccess && onSuccess(true);
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {dir.category_name}.
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

type DeleteData = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  dir?: any;
  onSuccess?: (success: boolean) => void;
};
