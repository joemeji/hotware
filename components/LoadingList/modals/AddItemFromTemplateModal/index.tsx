import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React, { memo } from "react";
import { LoadingTemplateSelect } from "../../FormElements/LoadingTemplate";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";

const yupObject: any = {
  loading_template_id: yup.number().required('This field is required.'),
};

function AddItemFromTemplate(props: AddItemFromTemplateProps) {
  const {
    open,
    onOpenChange,
    loadingWorkID,
    loadingID
  } = props;

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

      const res = await fetch('/api/loading-list/' + loadingID + '/loading-items/add_template_item', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/loading-list/${loadingID}/loading-items/lists`);
        toast({
          title: "Items from Template is Added",
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
            Add Items From Template
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form action="" method="post" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-3">
            <div className="flex flex-col">
              <label className="font-medium mb-3">Templates</label>
              <Controller
                name="loading_template_id"
                control={control}
                render={({ field }) => (
                  <LoadingTemplateSelect
                    value={field.value}
                    onChangeValue={(value: any) => field.onChange(value)}
                  />
                )}
              />
            </div>
            <div className="w-full flex items-center justify-end p-3">
              <Button
                type="submit"
                className="w-[10%] bg-stone-600"
              >Save</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default memo(AddItemFromTemplate);

type AddItemFromTemplateProps = {
  open?: any
  onOpenChange?: (open: any) => void
  loadingWorkID?: any
  loadingID?: any
}