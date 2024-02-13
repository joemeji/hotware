import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Input as InputLabel } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { textBlockSchema } from "../../schema";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ITextBlockForm {
  id?: string;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
}
export const TextBlockForm = (props: ITextBlockForm) => {
  const { id, listUrl, onOpenChange } = props;

  const { data, isLoading } = useSWR(
    id ? `/api/document/text-block/info?id=${id}` : null,
    fetcher
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(textBlockSchema),
  });

  const submit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const url = id
        ? "/api/document/text-block/update"
        : "/api/document/text-block/create";

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
      setValue("text_block_title", data?.text_block_title);
      setValue("text_block_text", data?.text_block_text);
      setValue("text_block_extra_text", data?.text_block_extra_text);
    }
  }, [data, setValue, reset, id]);

  return (
    <form onSubmit={handleSubmit(submit)} className='mt-7 flex flex-col gap-6'>
      {id && <Input type='hidden' {...register("id")} value={id} />}
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Title</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Title'
          disabled={isLoading}
          error={errors && (errors.text_block_title ? true : false)}
          {...register("text_block_title")}
        />
        {errors?.text_block_title && (
          <small className='text-red-500'>
            {errors?.text_block_title.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Text</label>
        <Textarea
          placeholder='Enter Text'
          className='bg-stone-100 border-transparent'
          {...register("text_block_text")}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Extra Text</label>
        <Textarea
          placeholder='Enter extra text'
          className='bg-stone-100 border-transparent'
          {...register("text_block_extra_text")}
        />
      </div>
      <Button className='block w-full' variant={"red"}>
        Save
      </Button>
    </form>
  );
};
