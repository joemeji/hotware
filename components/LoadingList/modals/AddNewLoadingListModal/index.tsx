import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { TypeUnitSelect } from "../../FormElements/TypeUnitSelect";
import { Textarea } from "@/components/ui/textarea";
import { WorkSelect } from "../../FormElements/WorkSelect";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";

const yupObject: any = {
  loading_description: yup.string().required("This field is required."),
  loading_furnace: yup.string().required("This field is required."),
  loading_type_id: yup.number().required("This field is required"),
  loading_work_id: yup.number().required("This field is required"),
  loading_additional_notes: yup.string().required("This field is required."),
};

export const AddNewLoadingListModal = (props: AddLoadingList) => {
  const { open, onOpenChange, onSuccess } = props;

  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/loading-list/create", {
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
        setTimeout(() => {
          onSuccess && onSuccess(true);
          onOpenChange && onOpenChange(false);
        }, 300);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>Add New Loading List</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form action="" method="post" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-2 gap-5 p-3">
            <div className="flex flex-col gap-3">
              <label className="font-medium">Description</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.loading_description ? true : false)}
                {...register("loading_description")}
              />
              {errors.loading_description && (
                <span className="text-red-500 text-sm">
                  <>{errors.loading_description?.message}</>
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium">Furnace</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.loading_furnace ? true : false)}
                {...register("loading_furnace")}
              />
              {errors.loading_furnace && (
                <span className="text-red-500 text-sm">
                  <>{errors.loading_furnace?.message}</>
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium">Type of Unit</label>
              <Controller
                name="loading_type_id"
                control={control}
                render={({ field }) => (
                  <TypeUnitSelect
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium">Work</label>
              <Controller
                name="loading_work_id"
                control={control}
                render={({ field }) => (
                  <WorkSelect
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div className="p-3">
            <div className="flex flex-col gap-3">
              <label className="font-medium">Additional Notes</label>
              <Textarea
                className="bg-stone-100 border-transparent"
                error={errors && (errors.loading_furnace ? true : false)}
                {...register("loading_additional_notes")}
              />
              {errors.loading_additional_notes && (
                <span className="text-red-500 text-sm">
                  <>{errors.loading_additional_notes?.message}</>
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-end p-3">
            <Button type="submit" className="w-[10%] bg-stone-600">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type AddLoadingList = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccess?: (success: boolean) => void;
};
