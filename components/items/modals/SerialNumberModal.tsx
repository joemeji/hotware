import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { memo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import SerialNumbers from "../SerialNumbers";

type SerialNumberModalType = { 
  onOpenChange: (open: boolean) => void, 
  open: boolean,
  _item_id?: string, 
  selectedItem?: any,
};

const SerialNumberModal = (props: SerialNumberModalType) => {
  const { open, onOpenChange, _item_id, selectedItem } = props;

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange && onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-[900px] p-0 overflow-auto gap-0 ">
        <AlertDialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white">
          <DialogTitle>
            {selectedItem && selectedItem.item_name}
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </AlertDialogHeader>
        <div className="min-h-[650px] flex flex-col">
          <SerialNumbers 
            _item_id={_item_id} 
            selectedItem={selectedItem}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(SerialNumberModal);