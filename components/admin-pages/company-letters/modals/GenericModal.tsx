import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { memo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";


function GenericModal(props: IGenericModal) {

  const { hideClose, open, onOpenChange, loadingId, title, children, className } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-[700px] p-0 overflow-auto gap-0 ${className}`}
      >
        <DialogHeader className='py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10'>
          {title && <DialogTitle>{title}</DialogTitle>}

          {!hideClose && (
            <DialogPrimitive.Close className='w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200'>
              <X />
            </DialogPrimitive.Close>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default memo(GenericModal)

type IGenericModal = {
  title?: string,
  children?: any,
  open?: boolean,
  hideClose?: boolean
  onOpenChange?: (open: boolean) => void,
  loadingId?: any,
  className?: string
}