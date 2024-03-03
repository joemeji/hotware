import { Button } from "@/components/ui/button";
import React, { memo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "@/components/ui/textarea";
import CurrencySelect from "@/components/app/currency-select";
import PaymentTermSelect from "@/components/app/payment-term-select";
import DocumentLanguageSelect from "@/components/app/document-language-select";
import ProjectSelect from "@/components/app/project-select";
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
import { purchaseSchema } from "../schema";
import { PurchaseOrderApproverSelect } from "@/components/app/po-approver-select";
import SendTaskEmail from "@/components/projects/send-email/SendTaskEmail";

dayjs.extend(timezone);

function CreatePurchaseDetails() {
  const { data: session }: any = useSession();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(purchaseSchema),
  });

  const onSubmitForm = async (data: any) => {
    setLoadingSubmit(true);
    try {
      data.timezone = dayjs.tz.guess();

      const res = await fetch(`${baseUrl}/api/purchases/create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(session.user.access_token),
      });

      const json = await res.json();

      if (json.success) {
        toast({
          title: "New purchase order added successfully.",
          variant: "success",
          duration: 2000,
        });
        setTimeout(() => {
          setLoadingSubmit(false);
          router.push("/purchase-order/" + json._po_id);

          // send task emails
          SendTaskEmail("CREATE_PURCHASE_ORDER", session.user.access_token);
        }, 300);
      }
    } catch (err: any) {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    const fetchApproverData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/purchases/enabled`, {
          headers: authHeaders(session?.user?.access_token),
        });
  
        const data = await res.json();
        
        if (data?.company_setting_value == 1) {
          setIsEnabled(true);
        } else {
          setIsEnabled(false);
        }
      } catch (err) {
        // Handle error if needed
      }
    };
    if (session?.user?.access_token) {
      fetchApproverData();
    }
    
  }, [session]);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex flex-col p-5 gap-3 w-full mx-auto max-w-[1600px]">
        <div className="flex justify-between bg-background p-3 rounded-app items-center shadow-sm">
          <h1 className="text-lg font-medium">Create Purchase Order</h1>
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
              name="po_delivery_id"
              control={control}
              render={({ field }) => (
                <DeliverTo
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  error={errors && errors.po_delivery_id}
                  renderAddress={
                    <Controller
                      name="po_delivery_address_id"
                      control={control}
                      render={({ field }) => (
                        <AddressForm
                          deliver_to_id={getValues("po_delivery_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                          error={errors && errors.po_delivery_address_id}
                        />
                      )}
                    />
                  }
                  renderEmployee={
                    <Controller
                      name="po_delivery_contact_id"
                      control={control}
                      render={({ field }) => (
                        <EmployeeForm
                          deliver_to_id={getValues("po_delivery_id")}
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
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <Controller
                  name="po_supplier_id"
                  control={control}
                  render={({ field }) => (
                    <InvoiceTo
                      value={field.value}
                      onChangeValue={(value) => field.onChange(value)}
                      error={errors && errors.po_supplier_id}
                      renderAddress={
                        <Controller
                          name="po_supplier_address_id"
                          control={control}
                          render={({ field }) => (
                            <InvoiceAddressForm
                              invoice_to_id={getValues("po_supplier_id")}
                              value={field.value}
                              onChangeValue={(value) => field.onChange(value)}
                              error={errors && errors.po_supplier_address_id}
                            />
                          )}
                        />
                      }
                      renderEmployee={
                        <Controller
                          name="po_supplier_contact_id"
                          control={control}
                          render={({ field }) => (
                            <InvoiceEmployeeForm
                              invoice_to_id={getValues("po_supplier_id")}
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
              <div className="flex flex-col gap-1">
                <label>Reference Number</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Enter a reference number"
                  {...register("po_reference_number")}
                />
              </div>
            </div>
          </div>

          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller
              name="po_copy_id"
              control={control}
              render={({ field }) => (
                <CopyTo
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  renderAddress={
                    <Controller
                      name="po_copy_address_id"
                      control={control}
                      render={({ field }) => (
                        <CopyAddressForm
                          copy_to_id={getValues("po_copy_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  }
                  renderEmployee={
                    <Controller
                      name="po_copy_contact_id"
                      control={control}
                      render={({ field }) => (
                        <CopyEmployeeForm
                          copy_to_id={getValues("po_copy_id")}
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
                  {...register("po_description")}
                  error={errors && errors.po_description ? true : false}
                />
                {errors.po_description && (
                  <ErrorFormMessage message={errors.po_description?.message} />
                )}
              </div>
              <div className="flex gap-5">
                <div className="flex-1 flex flex-col gap-1">
                  <label>Document Language</label>
                  <Controller
                    name="po_document_language"
                    control={control}
                    render={({ field }) => (
                      <DocumentLanguageSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.po_document_language}
                      />
                    )}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label>Currency</label>
                  <Controller
                    name="po_currency"
                    control={control}
                    render={({ field }) => (
                      <CurrencySelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.po_currency}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex-1 flex flex-col gap-1">
                  <label>Document Date</label>
                  <Controller
                    name="po_document_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                        date={field.value ? new Date(field.value) : undefined}
                        onChangeDate={(date) => field.onChange(date)}
                        format="dd-MM-yyyy"
                        error={errors && errors.po_document_date}
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
                        setValue("po_is_exclusive_vat", value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label>Delivery Date</label>
                <Controller
                  name="po_delivery_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                      date={field.value ? new Date(field.value) : undefined}
                      onChangeDate={(date) => field.onChange(date)}
                      format="dd-MM-yyyy"
                      error={errors && errors.po_delivery_date}
                    />
                  )}
                />
              </div>
              <div className="flex gap-5">
                <div className="flex flex-1 flex-col gap-1">
                  <label>Payment Terms</label>
                  <Controller
                    name="po_payment_terms_id"
                    control={control}
                    render={({ field }) => (
                      <PaymentTermSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.po_payment_terms_id}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label>Shipping Method</label>
                  <Controller
                    name="po_shipping_method_id"
                    control={control}
                    render={({ field }) => (
                      <ShippingMethodSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.po_shipping_method_id}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <p className="mb-3 font-medium text-base">Other Details</p>
            <div className="flex flex-col gap-5">
              <div className="flex flex-1 flex-col gap-1">
                <label>Project</label>
                <Controller
                  name="po_project_id"
                  control={control}
                  render={({ field }) => (
                    <ProjectSelect
                      onChangeValue={(value: any) => field.onChange(value)}
                      value={field.value}
                      error={errors && errors.po_project_id}
                    />
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label>Remarks</label>
                <Textarea
                  className="bg-stone-100 border-0"
                  {...register("po_remarks")}
                  error={errors && errors.po_remarks ? true : false}
                />
                {errors.po_remarks && (
                  <ErrorFormMessage message={errors.po_remarks?.message} />
                )}
              </div>
            </div>
          </div>
          {isEnabled && (
            <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
              <p className="mb-3 font-medium text-base">Approver</p>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-1 flex-col gap-1">
                    <label>Select approver</label>
                    <Controller
                      name="po_approver_id"
                      control={control}
                      render={({ field }) => (
                        <PurchaseOrderApproverSelect
                          onChangeValue={(value: any) => field.onChange(value)}
                          value={field.value}
                        />
                      )}
                    />
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default memo(CreatePurchaseDetails);
