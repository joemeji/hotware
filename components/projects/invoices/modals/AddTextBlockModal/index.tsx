import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import TextBlockList from "@/components/app/text-block-list";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Combobox from "@/components/ui/combobox";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSWRConfig } from "swr";

function AddTextBlockModal(props: AddTextBlockModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, _invoice_id, onUpdated } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTextBlock, setSelectedTextBlock] = useState<any>(0);
  const { mutate } = useSWRConfig();

  const yupSchema = yup.object({
    itb_language: yup.string(),
    itb_title: yup.string(),
    itb_text: yup.string(),
    itb_extra_text: yup.string(),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      itb_language: "English",
      itb_title: "",
      itb_text: "",
      itb_extra_text: "",
    },
  });

  const onSubmitEditForm = async (data: any) => {
    if (!data?.itb_text) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${baseUrl}/api/projects/invoices/text_blocks/${_invoice_id}`,
        {
          headers: authHeaders(session?.user?.access_token),
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();

      if (json.success) {
        mutate([
          `/api/projects/invoices/text_blocks/${_invoice_id}`,
          session?.user?.access_token,
        ]);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  const onReset = () => {
    setSelectedTextBlock(0);
    reset();
  };

  const onChangeTextBlock = (textBlock: any) => {
    setSelectedTextBlock(textBlock);
    setValue("itb_title", textBlock.text_block_title);
    setValue("itb_text", textBlock.text_block_text);
    setValue("itb_extra_text", textBlock.text_block_extra_text);
  };

  const addAndClose = async (data: any) => {
    onSubmitEditForm(data);
    onOpenChange && onOpenChange(false);
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
        className="max-w-[910px] p-0 overflow-auto gap-0"
      >
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
          <DialogTitle>Text Blocks</DialogTitle>
          <DialogPrimitive.Close
            disabled={isSubmitting}
            className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
          >
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitEditForm)}>
          <div className="grid grid-cols-12 relative px-3">
            <div className="col-span-4 overflow-auto max-h-[435px]">
              <div
                onClick={onReset}
                className={`border border-[#ddd] py-2.5 px-4 cursor-pointer ${
                  selectedTextBlock === 0 ? "bg-[#33d3d3] text-white" : ""
                }`}
              >
                New text block...
              </div>
              <TextBlockList
                value={selectedTextBlock?.text_block_id}
                onChangeValue={onChangeTextBlock}
              />
            </div>
            <div className="col-span-8 flex flex-col gap-4 px-4">
              <div className="flex flex-col gap-2">
                <label>Text Block Language</label>
                <div>
                  <Combobox
                    modal={true}
                    contents={[
                      { value: "English", text: "English" },
                      { value: "German", text: "German" },
                    ]}
                    placeholder="Please select a language"
                    value="English"
                    onChangeValue={(value) => setValue("itb_language", value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Title</label>
                <div>
                  <Input
                    placeholder="Title"
                    className="bg-stone-100 border-0"
                    {...register("itb_title")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Text</label>
                <div>
                  <Textarea
                    placeholder="Text"
                    className="bg-stone-100 border-0"
                    {...register("itb_text")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Extra Text</label>
                <div>
                  <Textarea
                    placeholder="Extra Text"
                    className="bg-stone-100 border-0"
                    {...register("itb_extra_text")}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-3">
            <Button
              variant={"ghost"}
              type="submit"
              disabled={isSubmitting}
              className={cn(isSubmitting && "loading")}
            >
              Add
            </Button>
            <Button
              onClick={handleSubmit(addAndClose)}
              disabled={isSubmitting}
              className={cn(isSubmitting && "loading")}
            >
              Add & Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AddTextBlockModal);

type AddTextBlockModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  _invoice_id: any;
  onUpdated?: (id?: any, newVal?: any) => void;
};
