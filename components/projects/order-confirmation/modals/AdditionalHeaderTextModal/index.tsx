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
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { RichTextEditor } from "@/components/RichTextEditor";
import useSWR, { useSWRConfig } from "swr";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

function AdditionalHeaderTextModal(props: AdditionalHeaderTextModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, _order_confirmation_id, onUpdated } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? [
          `/api/projects/orders/details/${_order_confirmation_id}`,
          session?.user?.access_token,
        ]
      : null,
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onSubmitEditForm = async (e: any) => {
    e.preventDefault();
    const newValue = (editorRef?.current as any)?.getContent();
    if (!newValue) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${baseUrl}/api/projects/orders/update_header_text/${_order_confirmation_id}`,
        {
          headers: authHeaders(session?.user?.access_token),
          method: "POST",
          body: JSON.stringify({
            additional_header_text: newValue,
            timezone: dayjs.tz.guess(),
          }),
        }
      );
      const json = await response.json();

      if (json.success) {
        setIsSubmitting(false);
        onOpenChange && onOpenChange(false);
        mutate([
          `/api/projects/orders/details/${_order_confirmation_id}`,
          session?.user?.access_token,
        ]);
      }
    } catch (err: any) {
      console.log(err);
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
          <DialogTitle>Additional Header Text</DialogTitle>
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
              <RichTextEditor
                ref={editorRef}
                value={data?.order_confirmation_additional_header_text || ""}
              />
            </div>
          </div>

          <DialogFooter className="p-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(isSubmitting && "loading")}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AdditionalHeaderTextModal);

type AdditionalHeaderTextModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  _order_confirmation_id: any;
  onUpdated?: (id?: any, newVal?: any) => void;
};
