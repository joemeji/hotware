import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { mutate } from "swr";
import { AbacusConnectionSchema } from "../../schema";
import CompanySelect from "@/components/app/company-select";
import CurrencySelect from "@/components/app/currency-select";

interface AbacusConnectionForm {
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const AbacusConnectionForm = (props: AbacusConnectionForm) => {
  const { listUrl, onOpenChange } = props;
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(AbacusConnectionSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/invoice/abacus-connection/create", {
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
        reset();

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
    <form onSubmit={handleSubmit(submit)} className="mt-7 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="mb-2 flex font-medium">Select company</label>
        <Controller
          name="company_id"
          control={control}
          render={({ field }) => (
            <CompanySelect
              onChangeValue={(value: any) => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="mb-2 flex font-medium">Select currency</label>
        <Controller
          name="company_base_currency"
          control={control}
          render={({ field }) => (
            <CurrencySelect
              onChangeValue={(value: any) => field.onChange(value)}
              value={field.value}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="mb-2 flex font-medium">Abacus number</label>
        <Input
          className="bg-stone-100 border-transparent"
          placeholder="Enter abacus number"
          error={errors && (errors.is_abacus_number ? true : false)}
          {...register("is_abacus_number")}
        />
        {errors?.is_abacus_number && (
          <small className="text-red-500">
            {errors?.is_abacus_number.message}
          </small>
        )}
      </div>
      <Button className="block w-full" variant={"red"}>
        Save
      </Button>
    </form>
  );
};
