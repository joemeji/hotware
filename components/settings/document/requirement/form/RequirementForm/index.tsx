import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { RequirementSchema } from "../../schema";
import { useEffect } from "react";
import { DocumentTypeSelect } from "@/components/settings/cms/requirement-level/elements/DocumentTypeSelect";

interface RequirementForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const RequirementForm = (props: RequirementForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/document/requirement/info?id=${id}` : null,
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
    resolver: yupResolver(RequirementSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = "/api/document/requirement" + (id
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
      setValue("document_category_name", data?.document_category_name);
    }
  }, [data, setValue, id, reset]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      {!id && (
        <div className='flex flex-col gap-3'>
          <label>Document Type</label>
          <Controller
            control={control}
            name='document_type_id'
            render={({ field }) => (
              <DocumentTypeSelect
                onChangeValue={(value: any) => {
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />

          {errors?.document_type_id && (
            <small className='text-red-500'>
              {errors?.document_type_id.message}
            </small>
          )}
        </div>
      )}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Name'
          disabled={isLoading}
          error={errors && (errors.document_category_name ? true : false)}
          {...register("document_category_name")}
        />
        {errors?.document_category_name && (
          <small className='text-red-500'>
            {errors?.document_category_name.message}
          </small>
        )}
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
