import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Input as InputLabel } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { vatSchema } from "../../schema";
import { useEffect } from "react";

interface IAddCategoryForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const VatForm = (props: IAddCategoryForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/vat/info?id=${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(vatSchema),
    defaultValues: {
      vat_percentage: 0.00
    }
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id ? "/api/vat/update" : "/api/vat/create";

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully Added",
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
    setValue("vat_code", data?.vat_code);
    setValue("vat_percentage", data?.vat_percentage);
    setValue("vat_description", data?.vat_description);
    setValue("vat_country", data?.vat_country);
    setValue("vat_account", data?.vat_account);
  }, [data, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Code</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Code'
          disabled={isLoading}
          error={errors && (errors.vat_code ? true : false)}
          {...register("vat_code")}
        />
        {errors?.vat_code && (
          <small className='text-red-500'>{errors?.vat_code.message}</small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Description</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Description'
          disabled={isLoading}
          error={errors && (errors.vat_description ? true : false)}
          {...register("vat_description")}
        />
        {errors?.vat_description && (
          <small className='text-red-500'>
            {errors?.vat_description.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Percentage</label>
        <InputLabel
          className='bg-stone-100 border-transparent'
          placeholder='Percentage'
          disabled={isLoading}
          label='%'
          step={0.01}
          type='number'
          error={errors && (errors.vat_percentage ? true : false)}
          {...register("vat_percentage")}
        />
        {errors?.vat_percentage && (
          <small className='text-red-500'>
            {errors?.vat_percentage.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Country</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Country'
          disabled={isLoading}
          error={errors && (errors.vat_country ? true : false)}
          {...register("vat_country")}
        />
        {errors?.vat_country && (
          <small className='text-red-500'>{errors?.vat_country.message}</small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Tax Account</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Tax Account'
          disabled={isLoading}
          error={errors && (errors.vat_account ? true : false)}
          {...register("vat_account")}
        />
        {errors?.vat_account && (
          <small className='text-red-500'>{errors?.vat_account.message}</small>
        )}
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
