import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useContext, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputFile from "@/components/ui/input-file";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { AccessTokenContext } from "@/context/access-token-context";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const yupObject: any = {
  itemImage: yup.mixed().required("This field is required."),
};

const AddImage = (props: AddImageProps) => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const _item_id = router?.query.item_id;
  const { open, onOpenChange, onSuccess } = props;
  const yupSchema = yup.object(yupObject);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  async function onSave(data: any) {
    setLoading(true);
    try {
      const _data = { ...data };

      const formData = new FormData();
      for (let [key, value] of Object.entries(_data)) {
        formData.append(key, value as string);
      }

      const res = await fetch(`${baseUrl}/api/items/image/add/${_item_id}`, {
        method: "POST",
        body: formData,
        headers: authHeaders(access_token, true),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
          onSuccess && onSuccess(true);
        }, 300);
      } else {
        toast({
          title: json.message,
          variant: "destructive",
          duration: 4000,
        });
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {}

    setLoading(false);
    reset();
  }

  const onFileChange = (files: any) => {
    setValue("itemImage", files[0]);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[500px] p-0 overflow-auto gap-0"
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle>Upload Image</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form action="" method="post" onSubmit={handleSubmit(onSave)}>
            <div className="flex flex-col gap-1 p-3">
              {/* <label>Upload</label> */}
              <InputFile required onChange={onFileChange} />
            </div>
            <DialogFooter className="sticky bottom-0 backdrop-blur z-10">
              <div className="p-3 w-full flex justify-end">
                <Button className={cn(loading && "loading")} type="submit">
                  Upload
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(AddImage);

type AddImageProps = {
  open?: any;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (success: boolean) => void;
};
