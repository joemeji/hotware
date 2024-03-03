import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Input as InputLabel } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { reqLevelSchema } from "../../schema";
import { useEffect } from "react";

interface RequirementLevelForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const RequirementLevelForm = (props: RequirementLevelForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/cms/requirement-level/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(reqLevelSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id
        ? "/api/cms/requirement-level/update"
        : "/api/cms/requirement-level/create";

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
      setValue("document_level_name", data?.document_level_name);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Name'
          disabled={isLoading}
          error={errors && (errors.document_level_name ? true : false)}
          {...register("document_level_name")}
        />
        {errors?.document_level_name && (
          <small className='text-red-500'>
            {errors?.document_level_name.message}
          </small>
        )}
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
