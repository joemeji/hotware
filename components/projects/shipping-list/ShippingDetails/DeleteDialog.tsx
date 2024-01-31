import { memo, useState } from "react";
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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

type DeleteDialog = {
  open?: boolean;
  shipping_number?: any;
  _shipping_id?: any;
  onOpenChange?: (open?: boolean) => void;
};

const DeleteDialog = ({
  open,
  shipping_number,
  onOpenChange,
  _shipping_id,
}: DeleteDialog) => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shipping/delete", {
        method: "POST",
        body: JSON.stringify({ _shipping_id }),
      });
      const json = await res.json();

      if (json.success) {
        toast({
          title: "Successfully deleted.",
          variant: "success",
          duration: 2000,
        });
        onOpenChange && onOpenChange(false);
        window.location.href = "/projects/shipping-list";
      }
    } catch (err: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-[360px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel {shipping_number}?
            <br />
            {"You won't be able to revert this."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Close
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={loading}
            className={cn(loading && "loading")}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(DeleteDialog);
