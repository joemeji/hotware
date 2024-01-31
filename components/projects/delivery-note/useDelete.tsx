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

export const useDelete = ({ onDelete }: any) => {
  const { data: session }: any = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);

  const mutateDelete = (value: any) => {
    setItem(value);
    setOpen(true);
  };

  const submit = async () => {
    if (!item) return;

    setLoading(true);
    const response = await fetch(`${baseUrl}/api/projects/deliveries/${item}`, {
      method: "DELETE",
      headers: authHeaders(session?.user?.access_token),
    });
    const result = await response.json();
    if (result.success) {
      onDelete(item);
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
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={submit}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return { mutateDelete, Dialog };
};
