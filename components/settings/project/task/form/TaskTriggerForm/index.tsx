import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { useEffect } from "react";
import { TriggerSelect } from "../../elements/TriggerSelect";
import { taskTriggerSchema } from "../../schema";
import { TechnicianSelect } from "@/components/app/technician-select";

interface ITaskTriggerForm {
  data: any;
  onOpenChange?: (open: boolean) => void;
}
export const TaskTriggerForm = (props: ITaskTriggerForm) => {
  const { data: task, onOpenChange } = props;

  const id: string = task?.task_id;

  const { data, isLoading } = useSWR(
    id ? `/api/project/task-trigger/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
  } = useForm({
    resolver: yupResolver(taskTriggerSchema),
    defaultValues: {
      user_id: [],
      trigger_id: [],
    },
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
        id: task?.task_id,
      };

      const url = "/api/project/task-trigger/update";

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully updated!",
          variant: "success",
          duration: 4000,
        });

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

  const trigger_id =
    data && data.length > 0 && data.map((d: any) => d?.trigger_id);

  useEffect(() => {
    if (!id) {
      reset();
    } else {
      const user_id =
        (data && data.length > 0 && data.map((d: any) => d?.user_id)) ?? [];
      setValue("user_id", user_id);

      const trigger_id =
        (data && data.length > 0 && data.map((d: any) => d?.trigger_id)) ?? [];

      setValue("trigger_id", trigger_id);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-col gap-6 py-4'>
      <Input defaultValue={task?.task_name} disabled />
      <div className='flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
        <label className='font-medium'>Select Employee</label>
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
      <div className='flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
        <label className='font-medium'>Send email after:</label>
        <Controller
          name='trigger_id'
          control={control}
          render={({ field }) => (
            <TriggerSelect
              onChangeValue={(value: any) => {
                field.onChange(value);
              }}
              value={field.value}
            />
          )}
        />
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
