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
import { AccessTokenContext } from "@/context/access-token-context";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import React, { useContext } from "react";
import useSWR, { mutate } from "swr";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

export const SetDefaultImageModal = (props: SetDefaultImageModal) => {
  const access_token = useContext(AccessTokenContext);
  const { data: session }: any = useSession();
  const { open, onOpenChange, image, onSuccess } = props;

  const handleCancel = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/items/image/make_default/${image.item_image_id}/${image.item_id}`,
        {
          method: "POST",
          headers: authHeaders(access_token),
        }
      );

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
            Selected image will be set to default.
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

type SetDefaultImageModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  image?: any;
  onSuccess?: (success: boolean) => void;
};
