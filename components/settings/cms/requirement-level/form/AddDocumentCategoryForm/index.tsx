import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Input as InputLabel } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { addDocumentSchema, reqLevelSchema } from "../../schema";
import { useEffect, useState } from "react";
import { DocumentTypeSelect } from "../../elements/DocumentTypeSelect";
import { DocumentCategorySelect } from "../../elements/DocumentCategorySelect";
import { Plus } from "lucide-react";

interface IAddDocumentLevelForm {
  id?: string;
  listUrl: string;
  data?: any;
  onOpenChange?: (open: boolean) => void;
}
export const AddDocumentCategoryForm = (props: IAddDocumentLevelForm) => {
  const { id, listUrl, onOpenChange, data } = props;

  console.log("data", data);
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(addDocumentSchema),
    defaultValues: {
      document_level_category_id: [],
    },
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id
        ? "/api/document/level-categories/update"
        : "/api/document/level-categories/create";

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
    }
  }, [data, setValue, id, reset]);

  const [typeId, setTypeId] = useState("");
  console.log("data", errors);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      <Input
        type='hidden'
        {...register("document_level_id")}
        value={data?.document_level_id}
      />
      <div className='flex flex-col gap-3'>
        <label>Document Type</label>
        <Controller
          control={control}
          name='document_type'
          render={({ field }) => (
            <DocumentTypeSelect
              onChangeValue={(value: any) => {
                field.onChange(value);
                setTypeId(value);
                setValue("document_level_category_id", []);
              }}
              value={field.value}
            />
          )}
        />

        {errors?.document_type && (
          <small className='text-red-500'>
            {errors?.document_type.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label>Document Category</label>
        <div className='flex gap-3'>
          <div className='w-full'>
            <Controller
              control={control}
              name='document_level_category_id'
              render={({ field }) => (
                <DocumentCategorySelect
                  typeId={typeId}
                  onChangeValue={(value: any) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                />
              )}
            />
            {errors?.document_level_category_id && (
              <small className='text-red-500'>
                {errors?.document_level_category_id.message}
              </small>
            )}
          </div>
          <Button className='' variant={"red"}>
            <Plus />
            Add
          </Button>
        </div>
      </div>
    </form>
  );
};
