import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { administrativeReminderSchema } from "../../schema";
import { useEffect } from "react";
import { TechnicianSelect } from "@/components/app/technician-select";

interface AdministrativeReminderForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const AdministrativeReminderForm = (props: AdministrativeReminderForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/notification/administrative-reminder/info?id=${id}` : null,
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
    resolver: yupResolver(administrativeReminderSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = "/api/notification/administrative-reminder" + (id
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
      setValue("user_id", data?.user_id);
      setValue("administrative_reminder_initial", data?.administrative_reminder_initial);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      {!id && 
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
      }
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Initial</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Enter administrative initial'
          error={errors && (errors.administrative_reminder_initial ? true : false)}
          {...register("administrative_reminder_initial")}
        />
        {errors?.administrative_reminder_initial && (
          <small className='text-red-500'>
            {errors?.administrative_reminder_initial.message}
          </small>
        )}
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
