import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { RichTextEditor } from "@/components/RichTextEditor";

function EditOfferItemModal(props: EditOfferItemModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, offer, _offer_id, onUpdated } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  const onSubmitEditForm = async (e: any) => {
    e.preventDefault();
    const newValue = (editorRef?.current as any)?.getContent();
    if (!newValue) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${baseUrl}/api/projects/offers/items/update/${offer.offer_item_id}`,
        {
          headers: authHeaders(session?.user?.access_token),
          method: "POST",
          body: JSON.stringify({ data: { offer_item_name: newValue } }),
        }
      );
      const json = await response.json();

      if (json.success) {
        setIsSubmitting(false);
        if (onUpdated) onUpdated(offer.offer_item_id, newValue);
        onOpenChange && onOpenChange(false);
      }
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) =>
        !isSubmitting && onOpenChange && onOpenChange(open)
      }
    >
      <DialogContent
        forceMount
        className="max-w-[720px] p-0 overflow-auto gap-0"
      >
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
          <DialogTitle>Update Item</DialogTitle>
          <DialogPrimitive.Close
            disabled={isSubmitting}
            className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
          >
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={onSubmitEditForm}>
          <div className="flex flex-col gap-3 p-4 relative min-h-[560px]">
            <div className="w-full h-[460px]">
              <RichTextEditor ref={editorRef} value={offer?.offer_item_name} />
            </div>
          </div>

          <DialogFooter className="p-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(isSubmitting && "loading")}
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(EditOfferItemModal);

type EditOfferItemModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  offer: any;
  _offer_id: any;
  onUpdated?: (id?: any, newVal?: any) => void;
};
