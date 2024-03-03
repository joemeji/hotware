import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { memo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { sub } from "date-fns";
import { cn } from "@/lib/utils";

function GenericModal(props: IGenericModal) {
  const {
    hideClose,
    open,
    onOpenChange,
    loadingId,
    title,
    children,
    className,
    subTitle,
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-[700px] p-0 overflow-auto gap-0 ${className}`}
      >
        <DialogHeader className={`py-2 px-3 flex justify-between flex-row content-start sticky top-0 bg-white z-10 ${title ? 'border-b' : ''}`}>
          <div
            className={cn(`flex flex-col gap-4 p-2`, {
              "mb-10": subTitle,
            })}
          >
            {title && <DialogTitle>{title}</DialogTitle>}
            {subTitle && <DialogDescription>{subTitle}</DialogDescription>}
          </div>

          {!hideClose && (
            <DialogPrimitive.Close className='w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200'>
              <X />
            </DialogPrimitive.Close>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default memo(GenericModal);

type IGenericModal = {
  title?: string;
  subTitle?: string;
  children?: any;
  open?: boolean;
  hideClose?: boolean;
  onOpenChange?: (open: boolean) => void;
  loadingId?: any;
  className?: string;
};
