import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { leaveReminderSchema } from "../../schema";
import { useEffect } from "react";
import { TechnicianSelect } from "@/components/app/technician-select";

interface LeaveReminderForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const LeaveReminderForm = (props: LeaveReminderForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/notification/leave-reminder/info?id=${id}` : null,
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
    resolver: yupResolver(leaveReminderSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = "/api/notification/leave-reminder" + (id
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
      
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
