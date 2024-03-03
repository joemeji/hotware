import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { mutate } from "swr";
import { purchaseOrderNotifierSchema } from "../../schema";
import { TechnicianSelect } from "@/components/app/technician-select";

interface PurchaseOrderNotifierForm {
  onOpenChange?: (open: boolean) => void;
  listUrl?: any
}

export const PurchaseOrderNotifierForm = (props: PurchaseOrderNotifierForm) => {
  const { listUrl, onOpenChange } = props;

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(purchaseOrderNotifierSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/notification/purchase-order/notifier/create", {
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
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
