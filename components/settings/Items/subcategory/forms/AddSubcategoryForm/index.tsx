
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { subcategorySchema } from "../../schema";
import { ItemCategoriesSelect } from "../../elements/ItemCategoriesSelect";

interface IAddSubcategoryForm {
  listUrl: string
}

export const AddSubcategoryForm = (props: IAddSubcategoryForm) => {

  const {listUrl} = props
  const router = useRouter();
  const page = router.query['page'] ?? 1

  const {
    formState: { errors },
    register,
    control,
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(subcategorySchema)
  });


  const createItemSubcategory = async (data: any) => {

    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/item/subcategory/create', {
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
        setValue('subcategory_name', '')
        setValue('subcategory_description', '')

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
      onSubmit={handleSubmit(createItemSubcategory)}
      className='mt-7 flex flex-col gap-6'
    >
      <div className='flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
        <label className='font-medium'>Main Categories</label>
        <Controller
          name='category_id'
          control={control}
          render={({ field }) => (
            <ItemCategoriesSelect
              onChangeValue={(value: any) => {
                field.onChange(value);
              }}
              value={field.value}
            />
          )}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Sub Category Name</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Category name'
          error={errors && (errors.subcategory_name ? true : false)}
          {...register("subcategory_name")}
        />
        {errors?.subcategory_name && (
          <small className='text-red-500'>
            {errors?.subcategory_name.message}
          </small>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Sub Category Description</label>
        <Textarea
          placeholder='Category Description'
          className='bg-stone-100 border-transparent'
          {...register("subcategory_description")}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <label className='font-medium'>Sub Category Prefix</label>
        <Input
          className='bg-stone-100 border-transparent'
          placeholder='Sub Category Prefix (Optional for those items which are not under equipments)'
          error={errors && (errors.subcategory_name_prefix ? true : false)}
          {...register("subcategory_name_prefix")}
        />
        {errors?.subcategory_name && (
          <small className='text-red-500'>
            {errors?.subcategory_name_prefix?.message}
          </small>
        )}
      </div>
      <Button variant={"red"}>Add Sub Category</Button>
    </form>
  );
}