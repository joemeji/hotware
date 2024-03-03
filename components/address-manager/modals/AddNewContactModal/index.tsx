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
import React, { memo, useEffect, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import CmsTypeSelect from "../../CmsTypeSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import CountrySelect from "@/components/app/country-select";

dayjs.extend(timezone);

const yupObject: any = {
  cms_category_id: yup.number().required("This field is required."),
  cms_name: yup.string().required("This field is required."),
  cms_email: yup.string().required("This field is required"),
  cms_phone_number: yup.number().required("This field is required"),
  cms_fax: yup.string(),
  cms_website: yup.string(),
  cms_address_building: yup.string().required("This field is required."),
  cms_address_street: yup.string().required("This field is required."),
  cms_address_zip: yup.string().required("This field is required."),
  cms_address_province: yup.string().required("This field is required."),
  cms_address_city: yup.string().required("This field is required."),
  country_id: yup.string().required("This field is required."),
};

function AddNewContactModal(props: AddNewContactModal) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, onSuccess } = props;
  const [isAllCategory, setIsAllCategory] = useState(false);
  const router = useRouter();
  const page = router.query?.page || 1;
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  let paramsObj: any = { page: String(page) };
  let searchParams = new URLSearchParams(paramsObj);

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
    setLoadingSubmit(true);
    try {
      data.timezone = dayjs.tz.guess();
      data.all_category = isAllCategory;

      const res = await fetch(`${baseUrl}/api/cms/add_contact`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(session.user.access_token),
      });

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/cms?${searchParams.toString()}`);
        toast({
          title: "Successfully Added",
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onSuccess && onSuccess(true);
          onOpenChange && onOpenChange(false);
        }, 300);
      } else {
        toast({
          title: json.message,
          variant: "destructive",
          duration: 4000,
        });
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form
          className="p-5 border-t border-t-stone-200"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="mb-4">
              <label className="mb-2 flex justify-between font-medium">
                Select Category
                <div className="flex items-center gap-1">
                  <Checkbox
                    id="all_category"
                    onCheckedChange={(e: any) => setIsAllCategory(e)}
                  />
                  <label
                    htmlFor="all_category"
                    className="text-sm text-stone-500 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Check this if it exists in all categories
                  </label>
                </div>
              </label>
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
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Name</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_name ? true : false)}
                {...register("cms_name")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Email</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_email ? true : false)}
                {...register("cms_email")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Phone Number</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_phone_number ? true : false)}
                {...register("cms_phone_number")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Fax</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_fax ? true : false)}
                {...register("cms_fax")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Website</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_website ? true : false)}
                {...register("cms_website")}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Address Building</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_address_building ? true : false)}
                {...register("cms_address_building")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Address Street</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_address_street ? true : false)}
                {...register("cms_address_street")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Address Zip</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_address_zip ? true : false)}
                {...register("cms_address_zip")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Address Province</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_address_province ? true : false)}
                {...register("cms_address_province")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Address City</label>
              <Input
                className="bg-stone-100 border-transparent"
                error={errors && (errors.cms_address_city ? true : false)}
                {...register("cms_address_city")}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Country</label>
              <Controller
                name="country_id"
                control={control}
                render={({ field }) => (
                  <CountrySelect
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <div className="text-right">
            <Button
              type="submit"
              className={cn(loadingSubmit && "loading")}
              disabled={loadingSubmit}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AddNewContactModal);

type AddNewContactModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccess?: (success: boolean) => void;
};
