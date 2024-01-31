import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { memo, useContext, useState } from "react";
import InputFile from "@/components/ui/input-file";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const yupSchema = yup.object({
  cms_file_title: yup.string().required("Title is required"),
  cms_upload_files: yup.mixed().required("Document File is required"),
});

function UploadModal(props: UploadModal) {
  const { open, onOpenChange, onSuccess } = props;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const cms: any = useContext(CmsDetailsContext);
  const access_token: any = useContext(AccessTokenContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = async (data: any) => {
    setLoadingSubmit(true);
    try {
      const formData = new FormData();

      for (let [key, value] of Object.entries(data)) {
        formData.append(key, value as string);
      }

      const res = await fetch(
        `${baseUrl}/api/cms/file/${cms?._cms_id}/upload`,
        {
          method: "POST",
          headers: authHeaders(access_token, true),
          body: formData,
        }
      );

      const json = await res.json();

      if (json.success) {
        toast({
          title: "Successfully updated.",
          variant: "success",
          duration: 1000,
        });
        onSuccess && onSuccess();
        setTimeout(() => onOpenChange && onOpenChange(false), 300);
      }
    } catch (err: any) {
      setLoadingSubmit(false);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>Upload File</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-2 w-full">
              <label>Title</label>
              <div>
                <Input
                  placeholder="Title"
                  className="bg-stone-100 border-0"
                  error={errors && (errors.cms_file_title ? true : false)}
                  {...register("cms_file_title")}
                />
                {errors.cms_file_title && (
                  <span className="text-red-500 text-sm">
                    <>{errors.cms_file_title?.message}</>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label>Upload Document</label>
              <div>
                <InputFile
                  required
                  onChange={(files: any) => {
                    setValue("cms_upload_files", files[0]);
                  }}
                />
                {errors.cms_upload_files && (
                  <span className="text-red-500 text-sm">
                    <>{errors.cms_upload_files?.message}</>
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-3">
            <Button variant={"ghost"} type="button" disabled={loadingSubmit}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loadingSubmit}
              className={cn(loadingSubmit && "loading")}
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(UploadModal);

type UploadModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccess?: () => void;
};
