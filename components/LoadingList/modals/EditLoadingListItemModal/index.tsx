import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

export const EditLoadingItemModal = (props: EditLoadingModalProps) => {
  const {open, onOpenChange} = props;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0 bg-stone-200">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>
            Edit Loading Item
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
};

type EditLoadingModalProps = {
  open?: any,
  onOpenChange?: (open: boolean) => void
};