import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SupplierSelect } from "../../FormElements/SupplierSelect";
import InputFile from "@/components/ui/input-file";
import { TH } from "@/components/items";
import { supplier_base } from "@/lib/azureUrls";

const yupObject: any = {
  cms_id: yup.number().required('This field is required.'),
  project_supplier_text: yup.string().required('This field is required.'),
  project_supplier_additionals: yup.string().required('This field is required.'),
  project_supplier_attachment: yup.mixed().required('This field is required.'),
};

function EditSupplierModal(props: EditSupplierModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, supplier, onSuccess } = props;
  const router = useRouter();
  const parentID = router.query?.parent_id;
  const yupSchema = yup.object(yupObject);
  console.log({ supplier: supplier })
  const [supplierId, setSupplierId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      cms_id: supplier.cms_id,
      project_supplier_text: supplier.project_supplier_text,
      project_supplier_additionals: supplier.project_supplier_additionals,
      project_supplier_attachment: supplier.project_supplier_attachment
    }
  });

  async function onSave(data: any) {
    const _data = { ...data };

    const formData = new FormData();

    for (let [key, value] of Object.entries(_data)) {
      formData.append(key, value as string);
    }

    const res = await fetch(`${baseUrl}/api/projects/supplier/edit/${supplier.project_supplier_id}`, {
      method: 'POST',
      body: formData,
      headers: authHeaders(session.user.access_token, true)
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
        onSuccess && onSuccess(true)
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
  }

  const onFileChange = (files: any) => {
    setValue("project_supplier_attachment", files[0]);
  };

  function viewAttachment() {
    if (supplier.project_supplier_attachment != null) {
      const a = document.createElement("a");
      a.target = "_blank";
      a.href = `${supplier_base}/${supplier.project_supplier_attachment}`;
      a.click();
    } else {
      toast({
        title: "File doesn't exist.",
        variant: "destructive",
        duration: 4000,
      });
    }
  }

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
            <DialogTitle>
              Add Address or Supplier
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="p-2">
            <div className="flex flex-col gap-2 py-1 rounded-app bg-white">
              <div className=" py-1 px-2">
                <p className="font-medium text-base">Edit Supplier Details</p>
              </div>
              <form action="" method="post" onSubmit={handleSubmit(onSave)}>
                <div className="flex flex-col gap-2 px-2">
                  <div className="flex flex-col gap-3">
                    <label>Supplier</label>
                    <Controller
                      name="cms_id"
                      control={control}
                      render={({ field }) => (
                        <SupplierSelect
                          onChangeValue={(value: any) => {
                            field.onChange(value);
                            setSupplierId(value);
                            console.log({ value: value })
                          }}
                          value={field.value}
                        />
                      )}
                    />

                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Text Label</label>
                    <Input
                      className="bg-stone-100 border-transparent"
                      error={errors && (errors.project_supplier_text ? true : false)}
                      {...register("project_supplier_text")}
                    />
                    {errors.project_supplier_text && (
                      <span className="text-red-500 text-sm">
                        <>{errors.project_supplier_text?.message}</>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Add Attachment</label>
                    <InputFile required={false} onChange={onFileChange} />
                    <a href="" className="text-cyan-600 hover:underline hover:underline-offset-1" onClick={() => viewAttachment()}>Click Here to view attachment added.</a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label>Additional Texts</label>
                    <Textarea
                      className="bg-stone-100 border-transparent"
                      error={errors && (errors.project_supplier_additionals ? true : false)}
                      {...register("project_supplier_additionals")}
                    />
                  </div>
                  <Button className="mt-2" type="submit">Submit</Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(EditSupplierModal);

type EditSupplierModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  supplier?: any,
  onSuccess?: (success: boolean) => void
};
