import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Input as InputLabel } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { paymentTermsSchema } from "../../schema";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

interface IAddCategoryForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const PaymentTermsForm = (props: IAddCategoryForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/payment-terms/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset,
    control
  } = useForm({
    resolver: yupResolver(paymentTermsSchema),
    defaultValues: {
      payment_terms_is_month_end: false
    }
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id ? "/api/payment-terms/update" : "/api/payment-terms/create";

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: `${id ? "Successfully updated!" : "Successfully added!"}`,
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

  useEffect(() => {

    if (!id) {
      reset();
    } else {
      if (data) {
        setValue("payment_terms_name", data?.payment_terms_name);
        setValue("payment_terms_days", data?.payment_terms_days);
        setValue(
          "payment_terms_is_month_end",
          data?.payment_terms_is_month_end == "1" ? true : false
        );
      }
    }
  });

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Name'
          disabled={isLoading}
          error={errors && (errors.payment_terms_name ? true : false)}
          {...register("payment_terms_name")}
        />
        {errors?.payment_terms_name && (
          <small className='text-red-500'>
            {errors?.payment_terms_name.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Number of Days</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Number of Days'
          disabled={isLoading}
          type='number'
          error={errors && (errors.payment_terms_days ? true : false)}
          {...register("payment_terms_days")}
        />
        {errors?.payment_terms_days && (
          <small className='text-red-500'>
            {errors?.payment_terms_days.message}
          </small>
        )}
      </div>
      <div className='flex gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
        <Controller
          control={control}
          name='payment_terms_is_month_end'
          defaultValue={true}
          render={({ field }) => (
            <Switch
              {...field}
              value={field.value as any}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
          )}
        />
        <label className='font-medium'>End of Month</label>
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
