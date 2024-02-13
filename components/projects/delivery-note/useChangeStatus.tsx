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
import DeliveryNoteStatusSelect from "@/components/app/delivery-note-status-select";

const Content = ({ defaultValue, submit, loading, setOpen }: any) => {
  const [status, setStatus] = useState(defaultValue);

  return (
    <AlertDialogContent className="max-w-[360px]">
      <AlertDialogHeader>
        <AlertDialogTitle>Change Status</AlertDialogTitle>
        <AlertDialogDescription>
          <label>Select Status</label>
          <DeliveryNoteStatusSelect
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
      `${baseUrl}/api/projects/deliveries/change_status/${item}`,
      {
        method: "POST",
        headers: authHeaders(session?.user?.access_token),
        body: JSON.stringify({ status }),
      }
    );
    const result = await response.json();
    if (result.success) {
      onChange(result.delivery_note_id);
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
