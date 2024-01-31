import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useSWR, { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import CmsTypeSelect from "../../CmsTypeSelect";
import { Checkbox } from "@/components/ui/checkbox";
import CountrySelect from "../../country-select";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useRouter } from "next/router";

dayjs.extend(timezone);


const yupObject: any = {
  cms_category_id: yup.string().required('This field is required.')
};

function ChangeCategory(props: ChangeCategory) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, cms } = props;
  const router = useRouter();
  const page = router.query?.page || 1;

  let paramsObj: any = { page: String(page) };
  let searchParams = new URLSearchParams(paramsObj);

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

      const res = await fetch(`${baseUrl}/api/cms/change_category/${cms.cms_id}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: authHeaders(session.user.access_token)
      });

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/cms?${searchParams.toString()}`);
        toast({
          title: "Successfully change category",
          variant: 'success',
          duration: 4000
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);
      } else {
        toast({
          title: json.message,
          variant: 'destructive',
          duration: 4000
        });
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
      <DialogContent className="max-w-[300px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>
            Change Category
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form className="p-5 border-t border-t-stone-200" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="gap-3">
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Select Category</label>
              <Controller
                name="cms_category_id"
                control={control}
                render={({ field }) => (
                  <CmsTypeSelect
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div className="text-right">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default memo(ChangeCategory);

type ChangeCategory = {
  open?: boolean,
  onOpenChange?: (open?: boolean) => void,
  cms?: any
}