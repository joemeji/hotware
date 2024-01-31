import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authHeaders, baseUrl } from "@/utils/api.config";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { memo, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useSWRConfig } from "swr";
import * as yup from "yup";
import CountrySelect from "@/components/address-manager/country-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { AccessTokenContext } from "@/context/access-token-context";

const yupSchema = yup.object({
  cms_address_building: yup.string(),
  cms_address_street: yup.string(),
  cms_address_zip: yup.string(),
  cms_address_province: yup.string(),
  cms_address_city: yup.string(),
  country_id: yup.string().required("Country is required."),
});

function AddNewLocationModal(props: AddNewLocationModal) {
  const { open, onOpenChange, onSuccess, selectedAddress } = props;
  const [loadingBtn, setLoadingBtn] = useState(false);
  const cms: any = useContext(CmsDetailsContext);
  const access_token = useContext(AccessTokenContext);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmitForm = async (data: any) => {
    try {
      setLoadingBtn(true);

      const _data = { ...data };

      const url = selectedAddress
        ? `${baseUrl}/api/cms/address/${cms?._cms_id}/update`
        : `${baseUrl}/api/cms/address/${cms?._cms_id}/create`;

      if (selectedAddress) {
        _data.cms_address_id = selectedAddress.cms_address_id;
      }

      const res = await fetch(url, {
        headers: authHeaders(access_token),
        method: "post",
        body: JSON.stringify(_data),
      });
      const json = await res.json();
      if (json.success) {
        onSuccess && onSuccess();
        onOpenChange && onOpenChange(false);
      }
    } catch (err: any) {
      setLoadingBtn(false);
    } finally {
      setLoadingBtn(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setValue("cms_address_building", "");
      setValue("cms_address_street", "");
      setValue("cms_address_zip", "");
      setValue("cms_address_province", "");
      setValue("cms_address_city", "");
      setValue("country_id", "");
    }
  }, [open, setValue]);

  useEffect(() => {
    if (selectedAddress) {
      setValue("cms_address_building", selectedAddress?.cms_address_building);
      setValue("cms_address_street", selectedAddress?.cms_address_street);
      setValue("cms_address_zip", selectedAddress?.cms_address_zip);
      setValue("cms_address_province", selectedAddress?.cms_address_province);
      setValue("cms_address_city", selectedAddress?.cms_address_city);
      setValue("country_id", selectedAddress?.country_id);
    }
  }, [selectedAddress, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>
            {selectedAddress ? "Update" : "Add New"} Location
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-2">
              <label>Building #</label>
              <div>
                <Input
                  placeholder="Apartment, Building, Floor No."
                  className="bg-stone-100 border-0"
                  error={errors && (errors.cms_address_building ? true : false)}
                  {...register("cms_address_building")}
                />
                {errors.cms_address_building && (
                  <span className="text-red-500 text-sm">
                    <>{errors.cms_address_building?.message}</>
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 w-full">
                <label>Street</label>
                <div>
                  <Input
                    placeholder="Street"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.cms_address_street ? true : false)}
                    {...register("cms_address_street")}
                  />
                  {errors.cms_address_street && (
                    <span className="text-red-500 text-sm">
                      <>{errors.cms_address_street?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Zip Code</label>
                <div>
                  <Input
                    placeholder="Zip Code"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.cms_address_zip ? true : false)}
                    {...register("cms_address_zip")}
                  />
                  {errors.cms_address_zip && (
                    <span className="text-red-500 text-sm">
                      <>{errors.cms_address_zip?.message}</>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 w-full">
                <label>State/Province</label>
                <div>
                  <Input
                    placeholder="State/Province"
                    className="bg-stone-100 border-0"
                    error={
                      errors && (errors.cms_address_province ? true : false)
                    }
                    {...register("cms_address_province")}
                  />
                  {errors.cms_address_province && (
                    <span className="text-red-500 text-sm">
                      <>{errors.cms_address_province?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Town/City</label>
                <div>
                  <Input
                    placeholder="Town/City"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.cms_address_city ? true : false)}
                    {...register("cms_address_city")}
                  />
                  {errors.cms_address_city && (
                    <span className="text-red-500 text-sm">
                      <>{errors.cms_address_city?.message}</>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>
                Country <span className="text-red-500">*</span>
              </label>
              <div>
                <Controller
                  name="country_id"
                  control={control}
                  render={({ field }) => (
                    <CountrySelect
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      error={errors.country_id}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-3">
            <Button variant={"ghost"} type="button" disabled={loadingBtn}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loadingBtn}
              className={cn(loadingBtn && "loading")}
            >
              {selectedAddress ? "Update" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AddNewLocationModal);

type AddNewLocationModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccess?: () => void;
  selectedAddress?: any;
};
