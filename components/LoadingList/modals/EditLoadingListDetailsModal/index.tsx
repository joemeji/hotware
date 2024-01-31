import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { TypeUnitSelect } from "../../FormElements/TypeUnitSelect";
import { WorkSelect } from "../../FormElements/WorkSelect";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingListDetailsContext } from "@/pages/projects/loading-list";
import { toast } from "@/components/ui/use-toast";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  loading_description: yup.string().required('This field is required.'),
  loading_furnace: yup.string().required('This field is required.'),
  loading_type_id: yup.mixed().nullable(),
  loading_work_id: yup.mixed().nullable(),
  loading_additional_notes: yup.string().required('This field is required.')
};

function EditLoadingListDetail(props: EditLoadingListDetailProps) {
  const { open, onOpenChange, loadingId } = props;
  const { data, isLoading, error } = useSWR(open ? '/api/loading-list/' + loadingId + '/details' : null, fetcher, swrOptions);

  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      loading_type_id: data && data.loading_type_id,
      loading_work_id: data && data.loading_work_id
    }
  });

  useEffect(() => {
    if (data) {
      setValue('loading_type_id', data.loading_type_id);
      setValue('loading_work_id', data.loading_work_id);
      setValue('loading_description', data.loading_description);
      setValue('loading_furnace', data.loading_furnace);
      setValue('loading_additional_notes', data.loading_additional_notes);
    }
  }, [data, setValue])

  const handleEditSubmitForm = async (value: any) => {
    try {
      const payload = {
        ...value
      };

      const res = await fetch('/api/loading-list/' + loadingId + '/update', {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/loading-list/${loadingId}/details`);
        mutate(`/api/loading-list/lists`);
        toast({
          title: "Successfully Updated",
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
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-w-[700px] p-0 overflow-auto gap-0 ">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle>
              Edit Loading List Details
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form action="" method="post" onSubmit={handleSubmit(handleEditSubmitForm)}>
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
                      value={field.value}
                      onChangeValue={(value: any) => field.onChange(value)}
                    />
                  )}
                />

              </div>
              <div className="flex flex-col gap-3">
                <label className="font-medium">Work</label>
                <Controller
                  name="loading_work_id"
                  control={control}
                  render={({ field, fieldState }) => (
                    <WorkSelect
                      value={field.value}
                      onChangeValue={(value: any) => field.onChange(value)}
                    // disabled={fieldState?.isDisabled}
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
              <Button
                type="submit"
                className="w-[10%] bg-stone-600"
              >Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(EditLoadingListDetail);

type EditLoadingListDetailProps = {
  open?: boolean,
  onOpenChange?: (open: boolean) => void,
  loadingId?: any
}