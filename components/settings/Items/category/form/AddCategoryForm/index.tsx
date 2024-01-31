import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { categorySchema } from "../../schema";
import { MainCategorySelect } from "../../elements/MainCategoriesSelect";
import { useRouter } from "next/router";
import { mutate } from "swr";

interface IAddCategoryForm {
  listUrl : string
}
export const AddCategoryForm = (props : IAddCategoryForm) => {

  const {listUrl} = props

  const {
    formState: { errors },
    register,
    control,
    handleSubmit,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(categorySchema)
  });


  const createItemMainCategory = async (data: any) => {

    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/item/category/create', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {


        toast({
          title: "Successfully Added",
          variant: 'success',
          duration: 4000
        });

        mutate(listUrl)
        setValue('category_name', '')
        setValue('category_description', '')

      } else {
        toast({
          title: json?.error,
          variant: 'error',
          duration: 4000
        });
      }


    } catch { }
  }


  return (
    <form
      onSubmit={handleSubmit(createItemMainCategory)}
      className='mt-7 flex flex-col gap-6'
    >
      <div className='flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
        <label className='font-medium'>Main Categories</label>
        <Controller
          name='category_main_category'
          control={control}
          render={({ field }) => (
            <MainCategorySelect
              onChangeValue={(value: any) => {
                field.onChange(value);
              }}
              value={field.value}
            />
          )}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Category Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Enter main category name'
          error={errors && (errors.category_name ? true : false)}
          {...register("category_name")}
        />
        {errors?.category_name && (
          <small className='text-red-500'>
            {errors?.category_name.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Category Description</label>
        <Textarea
          placeholder='Enter main category description'
          className='bg-stone-100 border-transparent'
          {...register("category_description")}
        />
      </div>
      <Button variant={"red"}>Add Category</Button>
    </form>
  );
}

