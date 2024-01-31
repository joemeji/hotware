import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { memo, useContext, useEffect, useState } from "react";
import AddressSelect from "@/components/address-manager/address-select";
import PositionSelect from "@/components/address-manager/position-select";
import DepartmentSelect from "@/components/address-manager/department-select";
import ChristmasSelect from "@/components/address-manager/christmas-select";
import ExhibitionSelect from "@/components/address-manager/exhibition-select";
import DecisionSelect from "@/components/address-manager/decision-select";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yupSchema } from "./formSchema";
import { cn } from "@/lib/utils";
import { AccessTokenContext } from "@/context/access-token-context";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { toast } from "@/components/ui/use-toast";

function NewContactPersonModal(props: NewContactPersonModal) {
  const { open, onOpenChange, onSuccess, contact } = props;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const access_token: any = useContext(AccessTokenContext);
  const cms: any = useContext(CmsDetailsContext);

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

  const onSubmit = async (data: any) => {
    setLoadingSubmit(true);
    try {
      let url = `${baseUrl}/api/cms/employee/create/${cms?._cms_id}`;
      let successMsg = "New contact added successfully.";

      if (contact) {
        url = `${baseUrl}/api/cms/employee/update/${cms?._cms_id}/${contact.cms_employee_id}`;
        successMsg = "Contact updated successfully";
      }

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(access_token),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: successMsg,
          variant: "success",
          duration: 1000,
        });
        onSuccess && onSuccess();
        setTimeout(() => onOpenChange && onOpenChange(false), 300);
      }
    } catch (err: any) {
      setLoadingSubmit(false);
      console.log(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    if (contact) {
      setValue("cms_address_id", contact.cms_address_id);
      setValue("cms_employee_firstname", contact.cms_employee_firstname);
      setValue("cms_employee_lastname", contact.cms_employee_lastname);
      setValue("cms_employee_email", contact.cms_employee_email);
      setValue("cms_employee_phone_number", contact.cms_employee_phone_number);
      setValue(
        "cms_employee_mobile_number",
        contact.cms_employee_mobile_number
      );
      setValue("cms_position_id", contact.cms_position_id || 0);
      setValue("cms_department_id", contact.cms_department_id || 0);
      setValue("cms_employee_christmas", contact.cms_employee_christmas || 0);
      setValue("cms_employee_exhibition", contact.cms_employee_exhibition || 0);
      setValue("cms_employee_decision", contact.cms_employee_decision || 0);
    }
  }, [contact, setValue]);

  useEffect(() => {
    if (!open) {
      setValue("cms_address_id", "");
      setValue("cms_employee_firstname", "");
      setValue("cms_employee_lastname", "");
      setValue("cms_employee_email", "");
      setValue("cms_employee_phone_number", "");
      setValue("cms_employee_mobile_number", "");
      setValue("cms_position_id", "");
      setValue("cms_department_id", "");
      setValue("cms_employee_christmas", "");
      setValue("cms_employee_exhibition", "");
      setValue("cms_employee_decision", "");
    }
  }, [open, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>{contact ? "Update" : "New"} Contact Person</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-2">
              <label>Location</label>
              <div>
                <Controller
                  name="cms_address_id"
                  control={control}
                  render={({ field }) => (
                    <AddressSelect
                      placeholder="Location"
                      value={field.value}
                      onChangeValue={(value) => field.onChange(value)}
                      error={errors?.cms_address_id}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 w-full">
                <label>First Name</label>
                <div>
                  <Input
                    placeholder="First Name"
                    className="bg-stone-100 border-0"
                    error={
                      errors && (errors.cms_employee_firstname ? true : false)
                    }
                    {...register("cms_employee_firstname")}
                  />
                  {errors.cms_employee_lastname && (
                    <span className="text-red-500 text-sm">
                      <>{errors.cms_employee_lastname?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Last Name</label>
                <div>
                  <Input
                    placeholder="Last Name"
                    className="bg-stone-100 border-0"
                    error={
                      errors && (errors.cms_employee_lastname ? true : false)
                    }
                    {...register("cms_employee_lastname")}
                  />
                  {errors.cms_employee_lastname && (
                    <span className="text-red-500 text-sm">
                      <>{errors.cms_employee_lastname?.message}</>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label>Email Address</label>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="bg-stone-100 border-0"
                  error={errors && (errors.cms_employee_email ? true : false)}
                  {...register("cms_employee_email")}
                />
                {errors.cms_employee_email && (
                  <span className="text-red-500 text-sm">
                    <>{errors.cms_employee_email?.message}</>
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 w-full">
                <label>Phone Number</label>
                <div>
                  <Input
                    placeholder="Phone Number"
                    className="bg-stone-100 border-0"
                    error={
                      errors &&
                      (errors.cms_employee_phone_number ? true : false)
                    }
                    {...register("cms_employee_phone_number")}
                  />
                  {errors.cms_employee_phone_number && (
                    <span className="text-red-500 text-sm">
                      <>{errors.cms_employee_phone_number?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Mobile Number</label>
                <div>
                  <Input
                    placeholder="Mobile Number"
                    className="bg-stone-100 border-0"
                    error={
                      errors &&
                      (errors.cms_employee_mobile_number ? true : false)
                    }
                    {...register("cms_employee_mobile_number")}
                  />
                  {errors.cms_employee_mobile_number && (
                    <span className="text-red-500 text-sm">
                      <>{errors.cms_employee_mobile_number?.message}</>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>Position</label>
              <div>
                <Controller
                  name="cms_position_id"
                  control={control}
                  render={({ field }) => (
                    <PositionSelect
                      placeholder="Position"
                      value={field.value}
                      onChangeValue={(value) => field.onChange(value)}
                      error={errors?.cms_position_id}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>Department</label>
              <div>
                <Controller
                  name="cms_department_id"
                  control={control}
                  render={({ field }) => (
                    <DepartmentSelect
                      placeholder="Department"
                      value={field.value}
                      onChangeValue={(value) => field.onChange(value)}
                      error={errors?.cms_department_id}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-2 w-full">
                <label>Christmas</label>
                <div>
                  <Controller
                    name="cms_employee_christmas"
                    control={control}
                    render={({ field }) => (
                      <ChristmasSelect
                        placeholder="Christmas"
                        value={field.value}
                        onChangeValue={(value) => field.onChange(value)}
                        error={errors?.cms_employee_christmas}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label>Exhibition</label>
                <div>
                  <Controller
                    name="cms_employee_exhibition"
                    control={control}
                    render={({ field }) => (
                      <ExhibitionSelect
                        placeholder="Exhibition"
                        value={field.value}
                        onChangeValue={(value) => field.onChange(value)}
                        error={errors?.cms_employee_exhibition}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label>Decision</label>
                <div>
                  <Controller
                    name="cms_employee_decision"
                    control={control}
                    render={({ field }) => (
                      <DecisionSelect
                        placeholder="Decision"
                        value={field.value}
                        onChangeValue={(value) => field.onChange(value)}
                        error={errors?.cms_employee_decision}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-3">
            <Button variant={"ghost"} type="button" disabled={loadingSubmit}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loadingSubmit}
              className={cn(loadingSubmit && "loading")}
            >
              {contact ? "Update" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(NewContactPersonModal);

type NewContactPersonModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccess?: () => void;
  contact?: any;
};
