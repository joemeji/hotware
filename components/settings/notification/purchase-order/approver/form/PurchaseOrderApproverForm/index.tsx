import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { mutate } from "swr";
import { purchaseOrderApproverSchema } from "../../schema";
import { TechnicianSelect } from "@/components/app/technician-select";
import { Checkbox } from "@/components/ui/checkbox";

interface PurchaseOrderApproverForm {
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const PurchaseOrderApproverForm = (props: PurchaseOrderApproverForm) => {
  const { listUrl, onOpenChange } = props;

  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(purchaseOrderApproverSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/notification/purchase-order/approver/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully added!",
          variant: "success",
          duration: 4000,
        });

        mutate(listUrl);

        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);

        if (onOpenChange) {
          onOpenChange(false);
        }
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      <div className="flex flex-col gap-3">
        <label className='font-medium'>Select employee</label>
        <Controller
          name='user_id'
          control={control}
          render={({ field }) => (
            <TechnicianSelect
              onChangeValue={(value: any) => {
                field.onChange(value);
              }}
              value={field.value}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor="is_default" className="cursor-pointer">
          Set as Default
        </label>
        <div className="flex items-center h-full">
          <Checkbox
            id="is_default"
            className="w-5 h-5 border-2 rounded-full group-hover/item:visible"
            onCheckedChange={(value: boolean) =>
              setValue("is_default", value)
            }
          />
        </div>
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
