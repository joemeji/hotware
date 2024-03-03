import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { mutate } from "swr";
import { roleModuleSchema } from "../../schema";
import { useEffect, useState } from "react";
import { ModuleSelect } from "../../elements/ModuleSelect";
import { Plus } from "lucide-react";

interface AddRoleModuleForm {
  id?: string;
  listUrl: string;
  data?: any;
  onOpenChange?: (open: boolean) => void;
}
export const AddRoleModuleForm = (props: AddRoleModuleForm) => {
  const { id, listUrl, onOpenChange, data } = props;

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(roleModuleSchema)
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id
        ? "/api/roles/updateModule"
        : "/api/roles/createModule";

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

        mutate(`/api/roles/getModules?id=${data?.role_id}`);
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
    }
  }, [data, setValue, id, reset]);

  const [typeId, setTypeId] = useState("");

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      <Input
        type='hidden'
        {...register("role_id")}
        value={data?.role_id}
      />
      <div className="flex gap-5">
        <div className='flex flex-1 flex-col gap-3'>
          <Controller
            control={control}
            name='module_id'
            render={({ field }) => (
              <ModuleSelect
                id={data?.role_id}
                onChangeValue={(value: any) => {
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />
          {errors?.module_id && (
            <small className='text-red-500'>
              {errors?.module_id.message}
            </small>
          )}
        </div>
        <Button className='' variant={"red"}>
          <Plus />
          Add
        </Button>
      </div>
    </form>
  );
};
