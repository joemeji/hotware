import { Button } from "@/components/ui/button";
import React, { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "@/components/ui/textarea";
import CurrencySelect from "@/components/app/currency-select";
import ProjectTypeSelect from "@/components/app/project-type-select";
import CmsIndustrySelect from "@/components/app/cms-industry-select";
import PaymentTermSelect from "@/components/app/payment-term-select";
import DocumentLanguageSelect from "@/components/app/document-language-select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import DeliverTo, { AddressForm, EmployeeForm } from "../DeliverTo";
import InvoiceTo, {
  InvoiceAddressForm,
  InvoiceEmployeeForm,
} from "../InvoiceTo";
import CopyTo, { CopyAddressForm, CopyEmployeeForm } from "../CopyTo";
import ErrorFormMessage from "@/components/app/error-form-message";
import ShippingMethodSelect from "@/components/app/shipping-method-select";
import { baseUrl, authHeaders } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { deliverySchema } from "../schema";

dayjs.extend(timezone);

function CreateDeliveryDetails() {
  const { data: session }: any = useSession();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(deliverySchema),
  });

  const onSubmitForm = async (data: any) => {
    setLoadingSubmit(true);
    try {
      data.timezone = dayjs.tz.guess();

      const res = await fetch(`${baseUrl}/api/projects/deliveries/create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(session.user.access_token),
      });

      const json = await res.json();

      if (json.success) {
        toast({
          title: "New delivery note added successfully.",
          variant: "success",
          duration: 2000,
        });
        setTimeout(() => {
          setLoadingSubmit(false);
          router.push("/projects/delivery-note/" + json._delivery_note_id);
        }, 300);
      }
    } catch (err: any) {
      setLoadingSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex flex-col p-5 gap-3 w-full mx-auto max-w-[1600px]">
        <div className="flex justify-between bg-background p-3 rounded-app items-center shadow-sm">
          <h1 className="text-lg font-medium">Create Delivery Note</h1>
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
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller
              name="delivery_note_delivery_id"
              control={control}
              render={({ field }) => (
                <DeliverTo
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  error={errors && errors.delivery_note_delivery_id}
                  renderAddress={
                    <Controller
                      name="delivery_note_delivery_address_id"
                      control={control}
                      render={({ field }) => (
                        <AddressForm
                          deliver_to_id={getValues("delivery_note_delivery_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                          error={
                            errors && errors.delivery_note_delivery_address_id
                          }
                        />
                      )}
                    />
                  }
                  renderEmployee={
                    <Controller
                      name="delivery_note_delivery_contact_id"
                      control={control}
                      render={({ field }) => (
                        <EmployeeForm
                          deliver_to_id={getValues("delivery_note_delivery_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  }
                />
              )}
            />
          </div>

          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller
              name="delivery_note_supplier_id"
              control={control}
              render={({ field }) => (
                <InvoiceTo
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  error={errors && errors.delivery_note_supplier_id}
                  renderAddress={
                    <Controller
                      name="delivery_note_supplier_address_id"
                      control={control}
                      render={({ field }) => (
                        <InvoiceAddressForm
                          invoice_to_id={getValues("delivery_note_supplier_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                          error={
                            errors && errors.delivery_note_supplier_address_id
                          }
                        />
                      )}
                    />
                  }
                  renderEmployee={
                    <Controller
                      name="delivery_note_supplier_contact_id"
                      control={control}
                      render={({ field }) => (
                        <InvoiceEmployeeForm
                          invoice_to_id={getValues("delivery_note_supplier_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  }
                />
              )}
            />
          </div>

          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller
              name="delivery_note_copy_id"
              control={control}
              render={({ field }) => (
                <CopyTo
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  renderAddress={
                    <Controller
                      name="delivery_note_copy_address_id"
                      control={control}
                      render={({ field }) => (
                        <CopyAddressForm
                          copy_to_id={getValues("delivery_note_copy_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  }
                  renderEmployee={
                    <Controller
                      name="delivery_note_copy_contact_id"
                      control={control}
                      render={({ field }) => (
                        <CopyEmployeeForm
                          copy_to_id={getValues("delivery_note_copy_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  }
                />
              )}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <p className="mb-3 font-medium text-base">Details</p>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label>Description</label>
                <Textarea
                  className="bg-stone-100 border-0"
                  {...register("delivery_note_description")}
                  error={
                    errors && errors.delivery_note_description ? true : false
                  }
                />
                {errors.delivery_note_description && (
                  <ErrorFormMessage
                    message={errors.delivery_note_description?.message}
                  />
                )}
              </div>
              <div className="flex gap-5">
                <div className="flex-1 flex flex-col gap-1">
                  <label>Document Language</label>
                  <Controller
                    name="delivery_note_document_language"
                    control={control}
                    render={({ field }) => (
                      <DocumentLanguageSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.delivery_note_document_language}
                      />
                    )}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label>Currency</label>
                  <Controller
                    name="delivery_note_currency"
                    control={control}
                    render={({ field }) => (
                      <CurrencySelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.delivery_note_currency}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex-1 flex flex-col gap-1">
                  <label>Document Date</label>
                  <Controller
                    name="delivery_note_document_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                        date={field.value ? new Date(field.value) : undefined}
                        onChangeDate={(date) => field.onChange(date)}
                        format="dd-MM-yyyy"
                        error={errors && errors.delivery_note_document_date}
                      />
                    )}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="is_exclusive_vat" className="cursor-pointer">
                    Exclusive Vat
                  </label>
                  <div className="flex items-center h-full">
                    <Checkbox
                      id="is_exclusive_vat"
                      className="w-5 h-5 border-2 rounded-full group-hover/item:visible"
                      onCheckedChange={(value: boolean) =>
                        setValue("delivery_note_is_exclusive_vat", value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label>Payment Terms</label>
                <Controller
                  name="delivery_note_payment_terms_id"
                  control={control}
                  render={({ field }) => (
                    <PaymentTermSelect
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      error={errors && errors.delivery_note_payment_terms_id}
                    />
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label>Shipping Method</label>
                <Controller
                  name="delivery_note_shipping_method_id"
                  control={control}
                  render={({ field }) => (
                    <ShippingMethodSelect
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      error={errors && errors.delivery_note_shipping_method_id}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <p className="mb-3 font-medium text-base">Other Details</p>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="is_automatic_calculation"
                  className="cursor-pointer"
                >
                  Automatically calculate total weight base from items.
                </label>
                <Checkbox
                  id="is_automatic_calculation"
                  className="w-5 h-5 border-2 rounded-full group-hover/item:visible"
                  onCheckedChange={(value: boolean) =>
                    setValue(
                      "delivery_note_automatic_weight_calculation",
                      value
                    )
                  }
                />
              </div>
              <div className="flex gap-5">
                <div className="flex-1 flex flex-col gap-1">
                  <label>Net Weight</label>
                  <Input
                    className="bg-stone-100 border-0"
                    placeholder="0"
                    {...register("delivery_note_net_weight")}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label>Total Weight</label>
                  <Input
                    className="bg-stone-100 border-0"
                    placeholder="0"
                    {...register("delivery_note_total_weight")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>Sharepoint Link</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Enter a shareable sharepoint link"
                  {...register("delivery_note_document_link")}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Document Type</label>
                <Controller
                  name="delivery_note_type"
                  control={control}
                  render={({ field }) => (
                    <ProjectTypeSelect
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      error={errors && errors.delivery_note_type}
                    />
                  )}
                />
              </div>
              <div className="flex gap-5">
                <div className="flex-1 flex flex-col gap-1">
                  <label>Industry</label>
                  <Controller
                    name="delivery_note_industry_id"
                    control={control}
                    render={({ field }) => (
                      <CmsIndustrySelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.delivery_note_industry_id}
                      />
                    )}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="is_project_label" className="cursor-pointer">
                    Not a project
                  </label>
                  <Checkbox
                    id="is_project_label"
                    className="w-5 h-5 border-2 rounded-full group-hover/item:visible"
                    onCheckedChange={(value: boolean) =>
                      setValue("delivery_note_is_not_project", value)
                    }
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex flex-1 flex-col gap-1">
                  <label>Estimated Start Date</label>
                  <Controller
                    name="delivery_note_start_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                        date={field.value ? new Date(field.value) : undefined}
                        onChangeDate={(date) => field.onChange(date)}
                        format="dd-MM-yyyy"
                        error={errors && errors.delivery_note_start_date}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-1  flex-col gap-1">
                  <label>Estimated End Date</label>
                  <Controller
                    name="delivery_note_end_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                        date={field.value ? new Date(field.value) : undefined}
                        onChangeDate={(date) => field.onChange(date)}
                        format="dd-MM-yyyy"
                        error={errors && errors.delivery_note_end_date}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3" />
        </div>
      </div>
    </form>
  );
}

export default memo(CreateDeliveryDetails);
