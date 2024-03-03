import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { currencySchema } from "../../schema";
import { useEffect } from "react";

interface CurrencyForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const CurrencyForm = (props: CurrencyForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/currency/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(currencySchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id ? "/api/currency/update" : "/api/currency/create";

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
    setValue("currency", data?.currency);
    setValue("currency_name", data?.currency_name);
    setValue("currency_sign", data?.currency_sign);
    setValue("chf_value", data?.CHF_value);
  }, [data, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-7 flex flex-col gap-5 pb-5">
      {id && <Input type="hidden" {...register("id")} value={id} />}
      <div className="flex flex-col gap-3">
        <label className="font-medium">Code</label>
        <Input
          className="bg-stone-100 border-transparent"
          placeholder="Code"
          disabled={isLoading}
          error={errors && (errors.currency ? true : false)}
          {...register("currency")}
        />
        {errors?.currency && (
          <small className="text-red-500">{errors?.currency.message}</small>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-medium">Name</label>
        <Input
          className="bg-stone-100 border-transparent"
          placeholder="Name"
          disabled={isLoading}
          error={errors && (errors.currency_name ? true : false)}
          {...register("currency_name")}
        />
        {errors?.currency_name && (
          <small className="text-red-500">
            {errors?.currency_name.message}
          </small>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-medium">Sign</label>
        <Input
          className="bg-stone-100 border-transparent"
          placeholder="Sign"
          disabled={isLoading}
          error={errors && (errors.currency_sign ? true : false)}
          {...register("currency_sign")}
        />
        {errors?.currency_sign && (
          <small className="text-red-500">
            {errors?.currency_sign.message}
          </small>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-medium">CHF Value</label>
        <Input
          className="bg-stone-100 border-transparent"
          placeholder="CHF Value"
          disabled={isLoading}
          error={errors && (errors.chf_value ? true : false)}
          {...register("chf_value")}
        />
        {errors?.chf_value && (
          <small className="text-red-500">{errors?.chf_value.message}</small>
        )}
      </div>
      <Button className="block w-full" variant={"red"}>
        Save
      </Button>
    </form>
  );
};
