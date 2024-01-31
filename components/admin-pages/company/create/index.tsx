import ErrorFormMessage from "@/components/app/error-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Company } from "../schema";

const CreateCompanyForm = () => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [submitLoading, setSubmitLoading] = useState(false);

  const onSubmit: SubmitHandler<Company> = async (data) => {
    setSubmitLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/admin/companies/create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(session?.user?.access_token),
      });

      const json = await response.json();

      if (json.success) {
        toast({
          title: "Company has been added successfully.",
          variant: "success",
          duration: 2000,
        });
        setTimeout(() => {
          setSubmitLoading(false);
          router.push("/admin/company/");
        }, 300);
      }
    } catch (err: unknown) {
      toast({
        title: "Something went wrong adding the company. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
      setSubmitLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Company>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 mx-auto p-4 w-full max-w-[800px]">
        <div className="flex justify-between items-center bg-background p-3 rounded-app">
          <span className="font-medium text-lg">Create Company</span>
          <Button
            type="submit"
            disabled={submitLoading}
            className={cn(submitLoading && "loading")}
          >
            Save
          </Button>
        </div>
        <div className="flex flex-col gap-3 bg-background p-3 rounded-app">
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-medium">Company Name</label>
            <Input
              className="h-10"
              {...register("company_name", {
                required: {
                  value: true,
                  message: "Company name is required.",
                },
              })}
            />
            {errors.company_name && (
              <ErrorFormMessage message={errors.company_name.message} />
            )}
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-medium">Company Address</label>
            <Input className="h-10" {...register("company_address")} />
            {errors.company_address && (
              <ErrorFormMessage message={errors.company_address.message} />
            )}
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-medium">Email Address</label>
            <Input
              type="email"
              className="h-10"
              {...register("company_email")}
            />
            {errors.company_email && (
              <ErrorFormMessage message={errors.company_email.message} />
            )}
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-medium">Contact Person</label>
            <Input className="h-10" {...register("company_contact_person")} />
            {errors.company_contact_person && (
              <ErrorFormMessage
                message={errors.company_contact_person.message}
              />
            )}
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-medium">Contact Number</label>
            <Input className="h-10" {...register("company_contact_number")} />
            {errors.company_contact_number && (
              <ErrorFormMessage
                message={errors.company_contact_number.message}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default memo(CreateCompanyForm);
