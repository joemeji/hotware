import React, { memo, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingList from "./LoadingList";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useSWR, { useSWRConfig } from "swr";

type AddLoadingListItemModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
};

const AddLoadingListItemModal = ({
  open,
  onOpenChange,
}: AddLoadingListItemModal) => {
  const [loadingId, setLoadingId] = useState(null);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const onAddLoadingList = async () => {
    try {
      setSubmitting(true);
      const options = {
        method: 'POST',
        body: JSON.stringify({ loading_id: loadingId }),
      };
      const res = await fetch(`/api/shipping/${shippingDetails?._shipping_id}/addFromLoadingList`, options);
      const json = await res.json();

      if (json.success) {
        setSubmitting(false);
        toast({
          title: "Loading items added successfully.",
          variant: 'success',
          duration: 1000
        });
        onOpenChange && onOpenChange(false);
        mutate(`/api/shipping/${shippingDetails?._shipping_id}/items`);
      }
    } catch (err) {
      setSubmitting(false);
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange && onOpenChange(open);
        }}
      >
        <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0 ">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle>Select Loading List</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>

          <LoadingList
            onValueChange={(value) => setLoadingId(value)}
            value={loadingId}
          />

          <DialogFooter className="p-3">
            <Button
              variant={"ghost"}
              type="button"
              onClick={() => onOpenChange && onOpenChange(false)}
              disabled={submitting}
            >
              Close
            </Button>
            <Button
              type="submit"
              onClick={onAddLoadingList}
              disabled={submitting}
              className={cn(submitting && "loading")}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default memo(AddLoadingListItemModal);
