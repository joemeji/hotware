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
import SupplierRecords from "./SupplierRecords";

const yupObject: any = {
  cms_id: yup.number().required('This field is required.'),
  project_supplier_text: yup.string().required('This field is required.'),
  project_supplier_additionals: yup.string().required('This field is required.'),
  project_supplier_attachment: yup.mixed().required('This field is required.'),
};

function AddNewSupplierModal(props: AddNewSupplierModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, project, onSuccess } = props;
  const router = useRouter();
  const parentID = router.query?.parent_id;
  const yupSchema = yup.object(yupObject);

  const [supplierId, setSupplierId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control
  } = useForm({
    resolver: yupResolver(yupSchema)
  });

  async function onSave(data: any) {
    const _data = { ...data };

    const formData = new FormData();

    for (let [key, value] of Object.entries(_data)) {
      formData.append(key, value as string);
    }

    const res = await fetch(`${baseUrl}/api/projects/supplier/add/${project.project_id}`, {
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

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[1200px] p-0 overflow-auto gap-0"
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle>
              Add Address or Supplier
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="flex gap-2 p-2 bg-stone-200">
            <div className="flex flex-col gap-2 w-1/3 py-1 rounded-app bg-white">
              <div className=" py-1 px-2">
                <p className="font-medium text-base">Supplier Details</p>
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
                    <InputFile required onChange={onFileChange} />
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
            <div className="w-2/3 px-2 py-1 rounded-app bg-white flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-base">Related Supplier Records</p>
                <div className="bg-stone-100 flex items-center w-[300px] rounded-xl overflow-hidden px-2 h-9 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-visible:ring-offset-2">
                  <Search className="text-stone-400 w-5 h-5" />
                  <input
                    placeholder="Search"
                    className="border-0 rounded-none outline-none text-sm w-full px-2 bg-stone-100 h-full max-w-[300px]"
                    name="search"
                  />
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <TH className="font-medium ">Project</TH>
                    <TH className="font-medium">Supplier</TH>
                    <TH className="font-medium">Text Label</TH>
                    <TH className="font-medium"></TH>
                  </tr>
                </thead>
                <tbody>
                  {
                    supplierId && (
                      <SupplierRecords
                        supplierID={supplierId}
                        projectId={project.project_id}
                        onOpenChange={(status: any) => onOpenChange && onOpenChange(status)}
                        onSuccess={(status: any) => onSuccess && onSuccess(status)}
                      />
                    )}
                </tbody>
              </table>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(AddNewSupplierModal);

type AddNewSupplierModalProps = {
  open?: boolean;
  project?: any,
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (success: boolean) => void
};
