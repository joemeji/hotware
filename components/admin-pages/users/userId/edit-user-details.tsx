import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { GenderSelect } from "../form-elements/GenderSelect";
import { Textarea } from "@/components/ui/textarea";
import ErrorFormMessage from "@/components/app/error-form-message";
import { CompanySelect } from "../form-elements/CompanySelect";
import InputFile from "@/components/ui/input-file";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { toast } from "@/components/ui/use-toast";
import UserRoleSelect from "@/components/app/user-role-select";
import UserServiceSelect from "@/components/app/user-service-select";

dayjs.extend(timezone);

export const userSchema = yup.object({
  // Details
  user_firstname: yup.string().required("Firstname is required."),
  user_middlename: yup.string().required("Middlename is required."),
  user_lastname: yup.string().required("Lastname is required."),
  user_nickname: yup.string(),
  user_gender: yup.string(),
  user_birthdate: yup.date().nullable(),
  user_blood_type: yup.string(),
  user_religion: yup.string(),
  user_nationality: yup.string(),
  user_zip_code: yup.string(),
  user_birthplace: yup.string(),
  user_current_address: yup.string(),
  user_permanent_address: yup.string(),
  user_job_title: yup.string(),
  user_email_address: yup.string(),
  user_contact_number: yup.string().required("Contact Number is required."),
  user_sss_number: yup.string(),
  user_function: yup.string(),
  company_id: yup.string(),
  role_id: yup.string(),
  user_start_date: yup.date().nullable(),
  user_service_id: yup.string(),
  user_photo: yup.mixed(),
  user_signature: yup.mixed(),
  user_shirt_size: yup.string(),
  user_jacket_size: yup.string(),
  user_trouser_size: yup.string(),
  user_shoes_size: yup.string(),
});

function EditUserDetails({ id, user }: any) {
  const { data: session }: any = useSession();
  const router = useRouter();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [picture, setPicture] = useState<any>(null);
  const [signature, setSignature] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      user_firstname: user.user_firstname,
      user_middlename: user.user_middlename,
      user_lastname: user.user_lastname,
      user_nickname: user.user_nickname,
      user_gender: user.user_gender,
      user_birthdate: user.user_birthdate,
      user_blood_type: user.user_blood_type,
      user_religion: user.user_religion,
      user_nationality: user.user_nationality,
      user_zip_code: user.user_zip_code,
      user_birthplace: user.user_birthplace,
      user_current_address: user.user_current_address,
      user_permanent_address: user.user_permanent_address,
      user_job_title: user.user_job_title,
      user_email_address: user.user_email_address,
      user_contact_number: user.user_contact_number,
      user_sss_number: user.user_sss_number,
      user_function: user.user_function,
      company_id: user.company_id,
      role_id: user.role_id,
      user_start_date: user.user_start_date,
      user_service_id: user.user_service_id,
      user_shirt_size: user.user_shirt_size,
      user_jacket_size: user.user_jacket_size,
      user_trouser_size: user.user_trouser_size,
      user_shoes_size: user.user_shoes_size,
    },
  });

  const onSubmitForm = async (data: any) => {
    setLoadingSubmit(true);
    data.timezone = dayjs.tz.guess();

    const formData = new FormData();
    formData.append("signature", signature[0]);
    formData.append("picture", picture[0]);
    formData.append("data", JSON.stringify(data));

    const res = await fetch(`${baseUrl}/api/users/edit/${id}`, {
      method: "POST",
      body: formData,
      headers: authHeaders(session.user.access_token, true),
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "User Successfuly Updated.",
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => {
        setLoadingSubmit(false);
        router.push("/admin/users");
      }, 300);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex flex-col p-5 gap-3 w-full mx-auto max-w-[1600px]">
        <div className="flex justify-between bg-background p-3 rounded-app items-center shadow-sm">
          <h1 className="text-lg font-medium">Edit User</h1>
          <div className="flex items-center gap-1">
            <Button
              variant={"secondary"}
              type="button"
              disabled={loadingSubmit}
              onClick={() => {
                router.back();
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loadingSubmit}
              className={cn(loadingSubmit && "loading")}
            >
              Submit
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/2 bg-background p-5 rounded-app shadow-sm">
            <h1 className="text-lg font-medium">User Details</h1>
            <div className="gap-2 grid grid-cols-2">
              <div className="flex flex-col gap-2 mt-5">
                <label>First Name</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="First Name"
                  {...register("user_firstname")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Middle Name</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Middle Name"
                  {...register("user_middlename")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Last Name</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Last Name"
                  {...register("user_lastname")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Used Name</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Used Name"
                  {...register("user_nickname")}
                />
              </div>
            </div>
            <div className="gap-2 grid grid-cols-3">
              <div className="flex flex-col gap-2 mt-5">
                <label>Gender</label>
                <Controller
                  name="user_gender"
                  control={control}
                  render={({ field }) => (
                    <GenderSelect
                      value={field.value}
                      onChangeValue={(value: any) => field.onChange(value)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Birthdate</label>
                <Controller
                  name="user_birthdate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                      date={field.value ? new Date(field.value) : undefined}
                      onChangeDate={(date) => field.onChange(date)}
                      format="dd-MM-yyyy"
                      error={errors && errors.user_birthdate}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Blood Type</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Blood Type"
                  {...register("user_blood_type")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Religion</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Religion"
                  {...register("user_religion")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Nationality</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Nationality"
                  {...register("user_nationality")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Zip Code</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Zip Code"
                  {...register("user_zip_code")}
                />
              </div>
            </div>
            <div className="gap-2 grid grid-cols-1">
              <div className="flex flex-col gap-2 mt-5 grow">
                <label>Birthplace</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Birthplace"
                  {...register("user_birthplace")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Current Address</label>
                <Textarea
                  className="bg-stone-100 border-0"
                  {...register("user_current_address")}
                  error={errors && errors.user_current_address ? true : false}
                />
                {errors.user_current_address && (
                  <ErrorFormMessage
                    message={errors.user_current_address?.message}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Permanent Address</label>
                <Textarea
                  className="bg-stone-100 border-0"
                  {...register("user_permanent_address")}
                />
              </div>
            </div>
          </div>
          <div className="w-1/2 bg-background p-5 rounded-app shadow-sm">
            <h1 className="text-lg font-medium">Company Details</h1>
            <div className="gap-2 grid grid-cols-1">
              <div className="flex flex-col gap-2 mt-5">
                <label>Job Title (English)</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Job Title"
                  {...register("user_job_title")}
                />
              </div>
            </div>
            <div className="gap-2 grid grid-cols-2">
              <div className="flex flex-col gap-2 mt-5">
                <label>Email Address</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="sample@gmail.com"
                  {...register("user_email_address")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Contact Number</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Contact Number"
                  {...register("user_contact_number")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>SSS Number</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="SSS Number"
                  {...register("user_sss_number")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Function</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Function"
                  {...register("user_function")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Employed By</label>
                <Controller
                  name="company_id"
                  control={control}
                  render={({ field }) => (
                    <CompanySelect
                      value={field.value}
                      onChangeValue={(value: any) => field.onChange(value)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Employed Type</label>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => (
                    <UserRoleSelect
                      value={field.value}
                      onChangeValue={(value: any) => field.onChange(value)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>
                  Date of Entry{" "}
                  <span className="text-stone-400">(Work Start Date)</span>
                </label>
                <Controller
                  name="user_start_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                      date={field.value ? new Date(field.value) : undefined}
                      onChangeDate={(date) => field.onChange(date)}
                      format="dd-MM-yyyy"
                      error={errors && errors.user_start_date}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Category</label>
                <Controller
                  name="user_service_id"
                  control={control}
                  render={({ field }) => (
                    <UserServiceSelect
                      value={field.value}
                      onChangeValue={(value: any) => field.onChange(value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="gap-2 grid grid-cols-4">
              <div className="flex flex-col gap-2 mt-5">
                <label>Shirt Size</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Shirt Size"
                  {...register("user_shirt_size")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Jacket Size</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Jacket Size"
                  {...register("user_jacket_size")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Trouser Size</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Trouse Size"
                  {...register("user_trouser_size")}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Shoe Size</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Shoe Size"
                  {...register("user_shoes_size")}
                />
              </div>
            </div>
            <div className="gap-2 grid grid-cols-2">
              <div className="flex flex-col gap-2 mt-5">
                <label>Upload Picture</label>
                <Controller
                  name="user_photo"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      accept="image/*"
                      onChange={(picture) => setPicture(picture)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label>Upload Signature</label>
                <Controller
                  name="user_signature"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      accept="image/*"
                      onChange={(signature) => setSignature(signature)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default memo(EditUserDetails);
