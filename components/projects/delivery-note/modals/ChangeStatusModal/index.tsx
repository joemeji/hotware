import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useContext, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { status } from "@/lib/order";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DeliveryNoteDetailsContext } from "@/context/delivery-note-details-content";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useSWRConfig } from "swr";

const ChangeStatusModal = ({ onOpenChange, open }: ChangeStatusModal) => {
  const deliveryNoteStatus = Object.keys(status);
  const deliveryNoteDetails: any = useContext(DeliveryNoteDetailsContext);
  const [onStatusChange, setOnStatusChange] = useState<any>(null);
  const _delivery_note_id = deliveryNoteDetails
    ? deliveryNoteDetails._delivery_note_id
    : null;
  const [loading, setLoading] = useState(false);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [error, setError] = useState<any>(null);
  const { mutate } = useSWRConfig();

  const onClickSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/projects/deliveries/${_delivery_note_id}/change_status`,
        {
          method: "POST",
          body: JSON.stringify({ status: onStatusChange }),
        }
      );
      const json = await res.json();
      if (!json.success && json.error) {
        setError(json.error);
        setOpenAlertMessage(true);
      }
      if (json.success) {
        toast({
          title: "Status successfully updated.",
          variant: "success",
          duration: 1500,
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
          mutate(`/api/projects/deliveries/${_delivery_note_id}/details`);
        }, 300);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deliveryNoteDetails) {
      setOnStatusChange(deliveryNoteDetails.delivery_note_status);
    }
  }, [deliveryNoteDetails]);

  return (
    <>
      <AlertDialog open={openAlertMessage} onOpenChange={setOpenAlertMessage}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{error && error.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {error && (
                <span dangerouslySetInnerHTML={{ __html: error.description }} />
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="max-w-[450px] p-0 overflow-auto gap-0 ">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle>Change Status</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="px-3 py-3">
            <RadioGroup
              className="gap-0"
              value={onStatusChange}
              onValueChange={(value) => setOnStatusChange(value)}
            >
              {deliveryNoteStatus &&
                deliveryNoteStatus.map((statusKey: any, key: any) => (
                  <label
                    htmlFor={statusKey}
                    key={key}
                    tabIndex={0}
                    className={cn(
                      "flex py-4 px-3 items-center gap-4 rounded-xl cursor-pointer hover:bg-[var(--bg-hover)]",
                      onStatusChange === statusKey && "bg-[var(--bg-hover)]"
                    )}
                    ref={(el) => {
                      el?.style.setProperty(
                        "--bg-hover",
                        `rgb(${status[statusKey].color}, 0.1)`
                      );
                    }}
                    style={{
                      color: `rgb(${status[statusKey].color})`,
                    }}
                  >
                    <RadioGroupItem id={statusKey} value={statusKey} />
                    <span className="font-medium uppercase text-base">
                      {status[statusKey].name}
                    </span>
                  </label>
                ))}
            </RadioGroup>
          </div>
          <DialogFooter className="p-3">
            <Button
              variant={"ghost"}
              type="button"
              onClick={() => onOpenChange && onOpenChange(false)}
              disabled={loading}
            >
              Close
            </Button>
            <Button
              type="submit"
              onClick={onClickSubmit}
              disabled={loading}
              className={cn(loading && "loading")}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

type ChangeStatusModal = {
  onOpenChange?: (open?: boolean) => void;
  open?: boolean;
};

export default memo(ChangeStatusModal);
