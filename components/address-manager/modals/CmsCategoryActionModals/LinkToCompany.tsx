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
import useSWR, { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import CmsTypeSelect from "../../CmsTypeSelect";
import { Checkbox } from "@/components/ui/checkbox";
import CountrySelect from "../../country-select";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { authHeaders, baseUrl, fetchApi, fetcher } from "@/utils/api.config";
import { useRouter } from "next/router";
import CompanySelect from "@/components/app/company-select";
// import CompanySelect from "../../CompanySelect";

dayjs.extend(timezone);

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  company_id: yup.string().required("This field is required."),
};

function LinkToComapany(props: LinkToComapany) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, cms } = props;
  const router = useRouter();
  const page = router.query?.page || 1;

  const { data, isLoading, error } = useSWR(
    open ? "/api/cms/" + cms.cms_id + "/company_link" : null,
    fetcher,
    swrOptions
  );
  console.log({ link: data });
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
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const handleFormSubmit = async (data: any) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/cms/link_cms_to_company/${cms.cms_id}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: authHeaders(session.user.access_token),
        }
      );

      const json = await res.json();
      if (json && json.success) {
        mutate("/api/cms/" + cms.cms_id + "/company_link");
        mutate(`/api/cms?${searchParams.toString()}`);
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
      } else {
        toast({
          title: json.message,
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>Change Category</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form
          className="p-5 border-t border-t-stone-200"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="gap-3">
            <div className="mb-4">
              <label className="mb-2 flex font-medium">Select Company</label>
              <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                  <CompanySelect
                    onChangeValue={(value: any) => field.onChange(value)}
                    value={field.value}
                  />
                )}
              />
            </div>
            <div className="flex gap-2 mb-4">
              <p>Link to:</p>
              <span className="font-medium">{data && data.company_name}</span>
            </div>
          </div>
          <div className="text-right">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(LinkToComapany);

type LinkToComapany = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  cms?: any;
};
