import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Input as InputLabel } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { taskSchema } from "../../schema";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { TaskCategorySelect } from "../../elements/TaskCategorySelect";
import { TaskPriorityLevelSelect } from "../../elements/TaskPriorityLevelSelect";
import { DatePicker } from "@/components/ui/datepicker";
import { format } from "date-fns";

interface ITaskForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const TaskForm = (props: ITaskForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/project/task/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(taskSchema),
  });

  const submit = async (data: any) => {
    if (data?.due_date) {
      data.due_date = format(new Date(data?.due_date), "dd-MM-yyyy");
    }

    try {
      const payload = {
        ...data,
      };

      const url = id ? "/api/project/task/update" : "/api/project/task/create";

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
    if (!id) {
      reset();
    } else {
      setValue("task_name", data?.task_name);
      setValue("task_category", data?.task_category);
      setValue("task_description", data?.task_description);
      setValue("task_priority_level", data?.task_priority_level);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
        <label className='font-medium'>Select Category</label>
        <Controller
          name='task_category'
          control={control}
          render={({ field }) => (
            <TaskCategorySelect
              onChangeValue={(value: any) => {
                field.onChange(value);
              }}
              value={field.value}
            />
          )}
        />
        {errors?.task_category && (
          <small className='text-red-500'>
            {errors?.task_category.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Task Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Task Name'
          disabled={isLoading}
          error={errors && (errors.task_name ? true : false)}
          {...register("task_name")}
        />
        {errors?.task_name && (
          <small className='text-red-500'>{errors?.task_name.message}</small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Task Description</label>
        <Textarea
          className='bg-stone-100 border-transparent'
          placeholder='Enter task description'
          disabled={isLoading}
          error={errors && (errors.task_description ? true : false)}
          {...register("task_description")}
        />
        {errors?.task_description && (
          <small className='text-red-500'>
            {errors?.task_description?.message}
          </small>
        )}
      </div>
      <div className='grid grid-cols-2 gap-5'>
        <div>
          <label className='font-medium'>Priority Level</label>
          <Controller
            name='task_priority_level'
            control={control}
            render={({ field }) => (
              <TaskPriorityLevelSelect
                onChangeValue={(value: any) => {
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />
        </div>
        <div>
          <label>Due Date</label>
          <Controller
            name='due_date'
            control={control}
            render={({ field }) => (
              <DatePicker
                triggerClassName='bg-stone-100 w-full py-2 px-3 rounded-md items-center'
                date={field.value ? new Date(field.value) : undefined}
                onChangeDate={(date) => field.onChange(date)}
                format='dd-MM-yyyy'
                error={errors && errors.due_date}
              />
            )}
          />
        </div>
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
