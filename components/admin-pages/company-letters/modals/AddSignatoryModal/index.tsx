import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { memo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import useSWR, { mutate } from "swr";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignatoryNameSelect } from "@/components/admin-pages/company-letters/form-elements/SignatoryNameSelect";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import GenericModal from "../GenericModal";

const yupObject: any = {
  user_id: yup.string().required('This field is required.'),
};

function AddSignatoryModal(props: IAddSignatoryModal) {

  const { open, onOpenChange, loadingId } = props;

  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(yupSchema)
  });


  const createSignatory = async (data: any) => {
    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/signatory/create', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/signatory/lists`);
        toast({
          title: "Successfully Added",
          variant: 'success',
          duration: 4000
        });

        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);


        if (onOpenChange) {
          onOpenChange(false);
        }

      } else {
        toast({
          title: json?.error,
          variant: 'error',
          duration: 4000
        });
      }


    } catch { }
  }



  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Signatory"
    >
      <form action="" method="post" onSubmit={handleSubmit(createSignatory)}>
        <div className="p-3">
          <div className="flex flex-col gap-3">
            <label className="font-medium">Name <span className="text-red-500 text-sm">*</span></label>
            <Controller
              name="user_id"
              control={control}
              render={({ field }) => (
                <SignatoryNameSelect
                  onChangeValue={(value: any) => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
            {errors.user_id && (
              <span className="text-red-500 text-sm">
                <>{errors.user_id?.message}</>
              </span>
            )}
            <input type="hidden" {...register('company_id')} defaultValue='1234' />
          </div>
        </div>
        <div className="w-full flex items-center justify-end p-3">
          <Button
            type="submit"
            className="w-[10%] bg-stone-600"
          >Submit</Button>
        </div>
      </form>
    </GenericModal>
  )
}

export default memo(AddSignatoryModal)

type IAddSignatoryModal = {
  open?: boolean
  onOpenChange?: (open: boolean) => void,
  loadingId?: any,
}