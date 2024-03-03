import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Input as InputLabel } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { shippingMethodSchema } from "../../schema";
import { useEffect } from "react";

interface IShippingMethodForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const ShippingMethodForm = (props: IShippingMethodForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/shipping-method/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(shippingMethodSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id ? "/api/shipping-method/update" : "/api/shipping-method/create";

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
      setValue("shipping_method_name", data?.shipping_method_name);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Code'
          disabled={isLoading}
          error={errors && (errors.shipping_method_name ? true : false)}
          {...register("shipping_method_name")}
        />
        {errors?.shipping_method_name && (
          <small className='text-red-500'>{errors?.shipping_method_name.message}</small>
        )}
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
