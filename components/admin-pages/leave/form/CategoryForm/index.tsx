import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { baseUrl } from "@/utils/api.config";
import { LeaveCategoryFormSchema } from "../../schema";

interface CategoryFormProps {
  selected?: any;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  onReset?: () => void;
}
export const CategoryForm = (props: CategoryFormProps) => {
  const { selected, onSuccess, onReset } = props;
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(LeaveCategoryFormSchema),
  });

  const submit = async (data: any) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `${baseUrl}/api/leaves/categories/${
          selected ? selected.excuse_category_id : ""
        }`,
        {
          method: selected ? "PUT" : "POST",
          body: JSON.stringify(data),
        }
      );

      const json = await res.json();
      if (json && json.success) {
        reset();
        onSuccess?.();
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    onReset?.();
    reset();
  };

  useEffect(() => {
    if (selected) {
      setValue("excuse_category_name", selected?.excuse_category_name);
      setValue("excuse_category_color", selected?.excuse_category_color);
    }
  }, [selected, setValue]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mt-7 flex gap-6 items-center"
    >
      <div className="flex-1 flex flex-col gap-3">
        <label className="font-medium">Category Name</label>
        <Input
          className="bg-stone-100 border-transparent"
          placeholder="Enter name"
          error={errors && (errors.excuse_category_name ? true : false)}
          {...register("excuse_category_name")}
        />
        {errors?.excuse_category_name && (
          <small className="text-red-500">
            {errors?.excuse_category_name.message}
          </small>
        )}
      </div>
      <div className="flex-1 flex items-end gap-6">
        <div className="flex-1 flex flex-col gap-3">
          <label className="font-medium">Color</label>
          <Input
            type="color"
            className="bg-stone-100 border-transparent"
            placeholder="Enter color"
            error={errors && (errors.excuse_category_color ? true : false)}
            {...register("excuse_category_color")}
          />
          {errors?.excuse_category_color && (
            <small className="text-red-500">
              {errors?.excuse_category_color.message}
            </small>
          )}
        </div>

        <div className="flex gap-1">
          {selected ? (
            <Button
              onClick={handleReset}
              type="button"
              className="block my-[2px]"
              variant="outline"
            >
              Cancel
            </Button>
          ) : null}
          <Button type="submit" className="block my-[2px]" variant={"red"}>
            {isLoading ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};
