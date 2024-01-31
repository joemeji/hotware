import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";

const yupObject: any = {
  loading_category_name: yup.string().required('This field is required.'),
};

export const AddNewHeadingListModal = (props: AddNewHeadingListModalProps) => {
  const { open, onOpenChange, loadingID } = props;
  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control
  } = useForm({
    resolver: yupResolver(yupSchema)
  });

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data
      };

      const res = await fetch('/api/loading-list/' + loadingID + '/add_category', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/loading-list/${loadingID}/loading-items/lists`);
        toast({
          title: "Heading Successfully Added",
          variant: 'success',
          duration: 4000
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {

    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-[450px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>
            Add Heading
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form action="" method="POST" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-3">
            <div className="flex flex-col gap-3">
              <label className="font-medium">Name</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.loading_category_name ? true : false)}
                {...register("loading_category_name")}
              />
              {errors.loading_category_name && (
                <span className="text-red-500 text-sm">
                  <>{errors.loading_category_name?.message}</>
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-end p-3">
            <Button
              type="submit"
              className="w-[20%] bg-stone-600"
            >Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type AddNewHeadingListModalProps = {
  open?: boolean
  onOpenChange?: (open?: boolean) => void,
  loadingID?: any
}