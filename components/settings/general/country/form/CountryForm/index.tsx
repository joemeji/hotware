import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { useEffect } from "react";
import { countrySchema } from "../../schema";
import { Switch } from "@/components/ui/switch";

interface ICountryForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const CountryForm = (props: ICountryForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/country/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(countrySchema(id ? true : false)),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id ? "/api/country/update" : "/api/country/create";

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: id ? "Successfully Updated." : "Successfully Added.",
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

  console.log("data", data);
  useEffect(() => {
    if (!id) {
      reset();
    } else {
      setValue("country_name", data?.country_name);
      // setValue(
      //   "country_details_maximum_working_hrs_per_day",
      //   data?.country_details_maximum_working_hrs_per_day ?? null
      // );
      // setValue(
      //   "country_details_maximum_working_hrs_per_week",
      //   data?.country_details_maximum_working_hrs_per_week ?? null
      // );
      // setValue(
      //   "country_details_installation_on_sunday",
      //   data?.country_details_installation_on_sunday == "1" ? true : false
      // );
      // setValue(
      //   "country_details_sunday_work_allowed",
      //   data?.country_details_sunday_work_allowed == "1" ? true : false
      // );
    }
  }, [data, id, reset, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-7 flex flex-col gap-6">
      {id && <Input type="hidden" {...register("id")} value={id} />}
      <div className="flex flex-col gap-3">
        <label className="font-medium">Name</label>
        <Input
          className="bg-stone-100 border-transparent"
          placeholder="Name"
          disabled={isLoading}
          error={errors && (errors.country_name ? true : false)}
          {...register("country_name")}
        />
        {errors?.country_name && (
          <small className="text-red-500">{errors?.country_name.message}</small>
        )}
      </div>
      {id && (
        <>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Maximum Working Hrs/Day</label>
            <Input
              className="bg-stone-100 border-transparent"
              type="number"
              placeholder="Maximum Working Hrs/Day"
              disabled={isLoading}
              error={
                errors &&
                (errors.country_details_maximum_working_hrs_per_day
                  ? true
                  : false)
              }
              {...register("country_details_maximum_working_hrs_per_day")}
            />
            {errors?.country_details_maximum_working_hrs_per_day && (
              <small className="text-red-500">
                {errors?.country_details_maximum_working_hrs_per_day.message}
              </small>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Maximum Working Hrs/Week</label>
            <Input
              className="bg-stone-100 border-transparent"
              type="number"
              placeholder="Maximum Working Hrs/Week"
              disabled={isLoading}
              error={
                errors &&
                (errors.country_details_maximum_working_hrs_per_week
                  ? true
                  : false)
              }
              {...register("country_details_maximum_working_hrs_per_week")}
            />
            {errors?.country_details_maximum_working_hrs_per_week && (
              <small className="text-red-500">
                {errors?.country_details_maximum_working_hrs_per_week.message}
              </small>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Sunday Work Allowed</label>
            <Controller
              control={control}
              name="country_details_sunday_work_allowed"
              render={({ field }) => (
                <Switch
                  {...field}
                  value={field.value as any}
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Installation on Sunday</label>
            <Controller
              control={control}
              name="country_details_installation_on_sunday"
              render={({ field }) => (
                <Switch
                  {...field}
                  value={field.value as any}
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              )}
            />
          </div>
        </>
      )}
      <Button className="block w-full" variant={"red"}>
        Save
      </Button>
    </form>
  );
};
