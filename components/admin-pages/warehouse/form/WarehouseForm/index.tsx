import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { WarehouseFormSchema } from "../../schema";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import CompanySelect from "@/components/app/company-select";
import WarehouseCountrySelect from "../../element/CountrySelect";

interface WarehouseForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const WarehouseForm = (props: WarehouseForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/admin/warehouse/info?id=${id}` : null,
    fetcher
  );

  const {
		control,
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(WarehouseFormSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id
        ? "/api/admin/warehouse/update"
        : "/api/admin/warehouse/create";

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
      setValue("warehouse_name", data?.warehouse_name);
			setValue("warehouse_location", data?.warehouse_location);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Enter name'
          disabled={isLoading}
          error={errors && (errors.warehouse_name ? true : false)}
          {...register("warehouse_name")}
        />
        {errors?.warehouse_name && (
          <small className='text-red-500'>
            {errors?.warehouse_name.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Location</label>
        <Textarea
          className='bg-stone-100 border-transparent'
          placeholder='Enter location'
          disabled={isLoading}
          error={errors && (errors.warehouse_location ? true : false)}
          {...register("warehouse_location")}
        />
        {errors?.warehouse_location && (
          <small className='text-red-500'>
            {errors?.warehouse_location.message}
          </small>
        )}
      </div>

			{!id && (
				<>
					<div className='flex flex-col gap-3'>
						<label className='font-medium'>Company</label>
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

					<div className='flex flex-col gap-3'>
						<label className='font-medium'>Country</label>
						<Controller
							name="warehouse_country"
							control={control}
							render={({ field }) => (
							<WarehouseCountrySelect
									onChangeValue={(value: any) => field.onChange(value)}
									value={field.value}
							/>
							)}
							/>
					</div>
				</>
			)}
    
      <Button className='block w-full' variant={"red"}>
        { id ? 'Update' : 'Save' }
      </Button>
    </form>
  );
};
