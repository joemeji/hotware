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

const Content = ({ submit, loading, setOpen }: any) => {
  const [paidDate, setPaidDate] = useState(dayjs().format("YYYY-MM-DD"));

  return (
    <AlertDialogContent className="max-w-[360px]">
      <AlertDialogHeader>
        <AlertDialogTitle>Mark as Paid?</AlertDialogTitle>
        <AlertDialogDescription>
          <label className="block mb-2">Enter date paid:</label>
          <input
            className="w-full blockflex h-10 rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            type="date"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
          />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => setOpen(false)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction disabled={loading} onClick={() => submit(paidDate)}>
          Submit
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export const useMarkAsPaid = ({ onSuccess }: any) => {
  const { data: session }: any = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);

  const mutateChange = (value: any) => {
    setItem(value);
    setOpen(true);
  };

  const submit = async (paidDate: string) => {
    if (!item) return;

    setLoading(true);
    const response = await fetch(
      `${baseUrl}/api/projects/invoices/${item}/mark_as_paid`,
      {
        method: "PUT",
        headers: authHeaders(session?.user?.access_token),
        body: JSON.stringify({ date_paid: paidDate }),
      }
    );
    const result = await response.json();
    if (result.success) {
      onSuccess(item, paidDate);
    }

    setLoading(false);
    setOpen(false);
  };

  const Dialog = () => {
    return (
      <AlertDialog open={open}>
        <Content submit={submit} loading={loading} setOpen={setOpen} />
      </AlertDialog>
    );
  };

  return { mutateChange, Dialog };
};
