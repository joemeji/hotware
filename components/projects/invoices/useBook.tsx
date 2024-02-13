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
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

export const useBook = ({ onSuccess }: any) => {
  const { data: session }: any = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [toBook, setToBook] = useState(false);

  const mutateChange = (value: any, book: boolean) => {
    setItem(value);
    setToBook(book);
    setOpen(true);
  };

  const submit = async () => {
    if (!item) return;

    setLoading(true);
    const response = await fetch(
      `${baseUrl}/api/projects/invoices/${item}/${toBook ? "book" : "unbook"}`,
      {
        method: "PUT",
        headers: authHeaders(session?.user?.access_token),
        body: JSON.stringify({ timezone: dayjs.tz.guess() }),
      }
    );
    const result = await response.json();
    if (result.success) {
      onSuccess(item, toBook, result?.time);
    }

    setLoading(false);
    setOpen(false);
  };

  const Dialog = () => {
    return (
      <AlertDialog open={open}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {toBook
                ? "Are you sure this invoice is booked in accounting?"
                : "Are you sure you want to unbook this invoice?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={submit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return { mutateChange, Dialog };
};
