import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Input as InputLabel } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { projectSecondRoleSchema } from "../../schema";
import { useEffect } from "react";

interface IProjectSecondRoleForm {
  id?: string;
  onOpenChange?: (open: boolean) => void;
  listUrl?: any
}
export const ProjectSecondRoleForm = (props: IProjectSecondRoleForm) => {
  const { id, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/project/project-second-role/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(projectSecondRoleSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id
        ? "/api/project/project-second-role/update"
        : "/api/project/project-second-role/create";

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

        // mutate(listUrl);

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
      setValue("project_second_role_name", data?.project_second_role_name);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Project Second Role</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Project Second Role Name'
          disabled={isLoading}
          error={errors && (errors.project_second_role_name ? true : false)}
          {...register("project_second_role_name")}
        />
        {errors?.project_second_role_name && (
          <small className='text-red-500'>
            {errors?.project_second_role_name.message}
          </small>
        )}
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
