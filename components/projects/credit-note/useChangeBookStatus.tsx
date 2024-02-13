import React, { useState } from "react";
import { useSession } from "next-auth/react";
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
import { authHeaders, baseUrl } from "@/utils/api.config";
import { mutate } from "swr";

export const useChangeBookStatus = ({ onBook }: any) => {
  const { data: session }: any = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [booked, setBooked] = useState(false);

  const mutateBook = (value: any, isBooked: string) => {
    setItem(value);
    setOpen(true);
    setBooked(parseInt(isBooked) == 1);
  };

  const submit = async () => {
    if (!item) return;

    setLoading(true);
    const endpoint = booked
      ? `${baseUrl}/api/projects/credits/mark/${item}/unbook`
      : `${baseUrl}/api/projects/credits/mark/${item}/book`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: authHeaders(session?.user?.access_token),
    });
    const result = await response.json();
    if (result.success) {
      onBook(item, !booked);
      mutate(`/api/projects/credits`);
      setBooked(!booked);
    }

    setLoading(false);
    setOpen(false);
  };

  const buttonText = booked ? "Unbook in Accounting" : "Book in Accounting";

  const Dialog = () => {
    return (
      <AlertDialog open={open}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {booked
                ? "This will mark the credit note as unbooked in accounting."
                : "This will mark the credit note as booked in accounting."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={submit}>
              {buttonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return { mutateBook, Dialog };
};
