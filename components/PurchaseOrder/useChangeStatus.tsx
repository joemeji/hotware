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
import PoStatusSelect from "@/components/app/po-status-select";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

const Content = ({ defaultValue, submit, loading, setOpen }: any) => {
  const [status, setStatus] = useState(defaultValue);

  return (
    <AlertDialogContent className="max-w-[360px]">
      <AlertDialogHeader>
        <AlertDialogTitle>Change Status</AlertDialogTitle>
        <AlertDialogDescription>
          <label>Select Status</label>
          <PoStatusSelect
            value={status}
            placeholder={"Select status"}
            onChangeValue={(val) => setStatus(val)}
          />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => setOpen(false)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction disabled={loading} onClick={() => submit(status)}>
          Submit
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export const useChangeStatus = ({ defaultValue, onChange }: any) => {
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [open, setOpen] = useState(false);

  const mutateChange = (value: any) => {
    setItem(value);
    setOpen(true);
  };

  const submit = async (status: string) => {
    if (!item) return;

    setLoading(true);
    const response = await fetch(
      `${baseUrl}/api/purchases/change_status/${item}`,
      {
        method: "POST",
        headers: authHeaders(session?.user?.access_token),
        body: JSON.stringify({ status, timezone: dayjs.tz.guess() }),
      }
    );
    const result = await response.json();
    if (result.success) {
      onChange(result.po_id);
    }

    setLoading(false);
    setOpen(false);
  };

  const Dialog = () => {
    return (
      <AlertDialog open={open}>
        <Content
          defaultValue={defaultValue}
          submit={submit}
          loading={loading}
          setOpen={setOpen}
        />
      </AlertDialog>
    );
  };

  return { mutateChange, Dialog };
};
