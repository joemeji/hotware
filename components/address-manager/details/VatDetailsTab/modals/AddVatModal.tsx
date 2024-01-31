import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authHeaders, baseUrl } from "@/utils/api.config";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { memo, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { AccessTokenContext } from "@/context/access-token-context";

const yupSchema = yup.object({
  cms_vat_code: yup.string().required("Code is required"),
  cms_vat_description: yup.string().required("Description is required"),
});

function AddVatModal(props: AddVatModal) {
  const { open, onOpenChange, onSuccess, selectedVat } = props;
  const cms: any = useContext(CmsDetailsContext);
  const access_token = useContext(AccessTokenContext);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

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
    try {
      setLoadingSubmit(true);

      const _data = { ...data };

      const url = selectedVat
        ? `${baseUrl}/api/cms/vat/${cms?._cms_id}/update`
        : `${baseUrl}/api/cms/vat/${cms?._cms_id}/create`;

      if (selectedVat) _data["cms_vat_id"] = selectedVat.cms_vat_id;

      const res = await fetch(url, {
        method: "post",
        headers: authHeaders(access_token),
        body: JSON.stringify(_data),
      });

      const json = await res.json();

      if (json.success) {
        onOpenChange && onOpenChange(false);
        onSuccess && onSuccess();
      }
    } catch (err: any) {
      console.log(err);
      setLoadingSubmit(false);
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    if (selectedVat) {
      setValue("cms_vat_code", selectedVat.cms_vat_code);
      setValue("cms_vat_description", selectedVat.cms_vat_description);
    } else {
      setValue("cms_vat_code", "");
      setValue("cms_vat_description", "");
    }
  }, [selectedVat, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>
            {selectedVat ? "Edit" : "Add"} Value Added Tax
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-2">
              <label>Code</label>
              <div>
                <Input
                  placeholder="Code"
                  className="bg-stone-100 border-0"
                  error={errors && (errors.cms_vat_code ? true : false)}
                  {...register("cms_vat_code")}
                />
                {errors.cms_vat_code && (
                  <span className="text-red-500 text-sm">
                    <>{errors.cms_vat_code?.message}</>
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label>Description</label>
              <div>
                <Input
                  placeholder="Description"
                  className="bg-stone-100 border-0"
                  error={errors && (errors.cms_vat_description ? true : false)}
                  {...register("cms_vat_description")}
                />
                {errors.cms_vat_description && (
                  <span className="text-red-500 text-sm">
                    <>{errors.cms_vat_description?.message}</>
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-3">
            <Button
              variant={"ghost"}
              type="button"
              disabled={loadingSubmit}
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(loadingSubmit && "loading")}
              disabled={loadingSubmit}
            >
              {selectedVat ? "Update" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AddVatModal);

type AddVatModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccess?: () => void;
  selectedVat?: any;
};
