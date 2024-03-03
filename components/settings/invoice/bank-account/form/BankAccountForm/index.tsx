import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { bankAccountSchema } from "../../schema";
import { useEffect } from "react";

interface BankAccountForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const BankAccountForm = (props: BankAccountForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/invoice/bank-account/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(bankAccountSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = "/api/invoice/bank-account" + (id
        ? "/update"
        : "/create");

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
      setValue("ba_bank_name", data?.ba_bank_name);
      setValue("ba_account_name", data?.ba_account_name);
      setValue("ba_account_number", data?.ba_account_number);
      setValue("ba_bank_code", data?.ba_bank_code);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Bank Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Bank Name'
          disabled={isLoading}
          error={errors && (errors.ba_bank_name ? true : false)}
          {...register("ba_bank_name")}
        />
        {errors?.ba_bank_name && (
          <small className='text-red-500'>
            {errors?.ba_bank_name.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Account Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Account Name'
          disabled={isLoading}
          error={errors && (errors.ba_account_name ? true : false)}
          {...register("ba_account_name")}
        />
        {errors?.ba_account_name && (
          <small className='text-red-500'>
            {errors?.ba_account_name.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Account Number</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Account Number'
          disabled={isLoading}
          error={errors && (errors.ba_account_number ? true : false)}
          {...register("ba_account_number")}
        />
        {errors?.ba_account_number && (
          <small className='text-red-500'>
            {errors?.ba_account_number.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Account Code</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Account Code'
          disabled={isLoading}
          error={errors && (errors.ba_bank_code ? true : false)}
          {...register("ba_bank_code")}
        />
        {errors?.ba_bank_code && (
          <small className='text-red-500'>
            {errors?.ba_bank_code.message}
          </small>
        )}
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
