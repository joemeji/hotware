import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { mainCategorySchema } from "../schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserRoleSelect } from "../elements/UserRoleSelect";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";

interface IAddMainCategoryForm {
  listUrl: string;
}

export const AddMainCategoryForm = (props: IAddMainCategoryForm) => {
  const { listUrl } = props;

  const {
    formState: { errors },
    register,
    control,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(mainCategorySchema),
  });

  const createItemMainCategory = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/item/main-category/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        mutate(listUrl);
        toast({
          title: "Successfully Added",
          variant: "success",
          duration: 4000,
        });
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  return (
    <form
      onSubmit={handleSubmit(createItemMainCategory)}
      className="mt-7 flex flex-col gap-6"
    >
      <div className="flex flex-col gap-3">
        <label className="font-medium">Main Category Name</label>
        <Input
          className="bg-stone-100 border-transparent"
          placeholder="Enter main category name"
          error={errors && (errors.category_name ? true : false)}
          {...register("category_name")}
        />
        {errors?.category_name && (
          <small className="text-red-500">
            {errors?.category_name.message}
          </small>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-medium">Main Category Description</label>
        <Textarea
          placeholder="Enter main category description"
          className="bg-stone-100 border-transparent"
          {...register("category_desc")}
        />
      </div>
      <div className="flex flex-col gap-3 col-span-5 xl:col-span-3 md:col-span-4">
        <label className="font-medium">Select roles who can view</label>
        <Controller
          name="category_roles"
          control={control}
          render={({ field }) => (
            <UserRoleSelect
              onChangeValue={(value: any) => {
                field.onChange(value);
              }}
              value={field.value}
              multiple
              setValues={setValue}
            />
          )}
        />
      </div>
      <div className="flex gap-3 col-span-5 xl:col-span-3 md:col-span-4">
        <label className="font-medium">With Prefix</label>
        <Controller
          control={control}
          name="category_with_prefix"
          defaultValue={true}
          render={({ field }) => (
            <Switch
              {...field}
              value={field.value as any}
              defaultChecked
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
          )}
        />
      </div>
      <Button variant={"red"}>Add Category</Button>
    </form>
  );
};
