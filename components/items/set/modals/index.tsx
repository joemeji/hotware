import React, { memo, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { ManageSetBy } from "../form-elements/ManageSetBy";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputFile from "@/components/ui/input-file";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";

const yupObject: any = {
  item_set_name: yup.string().required("This field is required."),
  with_serial: yup.string().required("This field is required"),
  item_set_image: yup.mixed(),
  item_set_hs_code: yup.string().required("This field is required"),
};

export const AddPredefinedSetsModal = (props: AddPredSets) => {
  const { open, onOpenChange } = props;
  const yupSchema = yup.object(yupObject);
  const [files, setFiles] = useState<any>(null);
  const { data: session }: any = useSession();

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

  const inputFileChange = (file: any) => {
    setValue("item_set_image", file);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      for (let [key, value] of Object.entries(data)) {
        formData.append(key, value as string);
      }
      const res = await fetch(`${baseUrl}/api/items/sets/create`, {
        method: "POST",
        body: formData,
        headers: authHeaders(session.user.access_token, true),
      });

      const json = await res.json();
      console.log(json);

      //   if (json && json.success) {
      //     mutate(`/api/item/set`);
      //     toast({
      //       title: "Successfully Added",
      //       variant: "success",
      //       duration: 4000,
      //     });
      //     setTimeout(() => {
      //       onOpenChange && onOpenChange(false);
      //     }, 300);
      //   }
      //   if (onOpenChange) {
      //     onOpenChange(false);
      //   }
    } catch {}
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>Add Predefined Sets</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form action="" method="post" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols p-3">
            <div className="flex flex-col gap-3">
              <label className="font-medium">Name</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.item_set_name ? true : false)}
                {...register("item_set_name")}
              />
              {errors.item_set_name && (
                <span className="text-red-500 text-sm">
                  <>{errors.item_set_name?.message}</>
                </span>
              )}
              <span className="text-red-500 text-sm"></span>
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium">Manage set by</label>
              <Controller
                name="with_serial"
                control={control}
                render={({ field }) => (
                  <ManageSetBy
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
              <span className="text-red-500 text-sm"></span>
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium">HS Code</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.item_set_hs_code ? true : false)}
                {...register("item_set_hs_code")}
              />
              {errors.item_set_hs_code && (
                <span className="text-red-500 text-sm">
                  <>{errors.item_set_hs_code?.message}</>
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium">Upload Image</label>
              <InputFile
                accept="image/*"
                onChange={(files: any) => inputFileChange(files[0])}
              />
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

type AddPredSets = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
};
