import { Button } from "@/components/ui/button";
import React, { memo, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "@/components/ui/textarea";
import CurrencySelect from "@/components/app/currency-select";
import ProjectTypeSelect from "@/components/app/project-type-select";
import CmsIndustrySelect from "@/components/app/cms-industry-select";
import CmsVatSelect from "@/components/app/cms-vat-select";
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
  InvoiceVatForm,
} from "../InvoiceTo";
import CopyTo, { CopyAddressForm, CopyEmployeeForm } from "../CopyTo";
import ErrorFormMessage from "@/components/app/error-form-message";
import ShippingMethodSelect from "@/components/app/shipping-method-select";
import { baseUrl, authHeaders } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { orderSchema } from "../schema";
import InputFile from "@/components/ui/input-file";
import SendTaskEmail from "../../send-email/SendTaskEmail";

dayjs.extend(timezone);

function EditOrderDetails({ id, order_confirmation }: any) {
  const { data: session }: any = useSession();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isWithDeliveryDate, setIsWithDeliveryDate] = useState(false);
  const router = useRouter();
  const [files, setFiles] = useState<any>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(orderSchema),
    defaultValues: order_confirmation,
  });
  const invoiceCmsId = watch("order_confirmation_supplier_id");

  useEffect(() => {
    // Set the initial value for the file input when editing
    setValue(
      "order_confirmation_purchase_order_file",
      order_confirmation.order_confirmation_purchase_order_file
    );
  }, [order_confirmation.order_confirmation_purchase_order_file, setValue]);

  const onSubmitForm = async (data: any) => {
    setLoadingSubmit(true);
    try {
      data.timezone = dayjs.tz.guess();

      const formData = new FormData();
      formData.append(
        "order_confirmation_purchase_order_file",
        files ? files[0] : null
      );
      formData.append("data", JSON.stringify(data));

      const res = await fetch(`${baseUrl}/api/projects/orders/update/${id}`, {
        method: "POST",
        body: formData,
        headers: authHeaders(session.user.access_token, true),
      });

      const json = await res.json();

      if (json.success) {
        toast({
          title: "An order confirmation has been updated successfully.",
          variant: "success",
          duration: 2000,
        });
        setTimeout(() => {
          setLoadingSubmit(false);
          router.push("/projects/order-confirmation/" + id);

          // send task emails
          SendTaskEmail(
            "UPDATE_ORDER_CONFIRMATION",
            session?.user?.access_token
          );
        }, 300);
      }
    } catch (err: any) {
      console.log(err);
      setLoadingSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex flex-col p-5 gap-3 w-full mx-auto max-w-[1600px]">
        <div className="flex justify-between bg-background p-3 rounded-app items-center shadow-sm">
          <h1 className="text-lg font-medium">Edit Order Confirmation</h1>
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
              name="order_confirmation_delivery_id"
              control={control}
              render={({ field }) => (
                <DeliverTo
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  error={errors && errors.order_confirmation_delivery_id}
                  renderAddress={
                    <Controller
                      name="order_confirmation_delivery_address_id"
                      control={control}
                      render={({ field }) => (
                        <AddressForm
                          deliver_to_id={getValues(
                            "order_confirmation_delivery_id"
                          )}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                          error={
                            errors &&
                            errors.order_confirmation_delivery_address_id
                          }
                        />
                      )}
                    />
                  }
                  renderEmployee={
                    <Controller
                      name="order_confirmation_delivery_contact_id"
                      control={control}
                      render={({ field }) => (
                        <EmployeeForm
                          deliver_to_id={getValues(
                            "order_confirmation_delivery_id"
                          )}
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
              <div className="flex flex-1 flex-col gap-1">
                <Controller
                  name="order_confirmation_supplier_id"
                  control={control}
                  render={({ field }) => (
                    <InvoiceTo
                      value={field.value}
                      onChangeValue={(value) => field.onChange(value)}
                      error={errors && errors.order_confirmation_supplier_id}
                      renderAddress={
                        <Controller
                          name="order_confirmation_supplier_address_id"
                          control={control}
                          render={({ field }) => (
                            <InvoiceAddressForm
                              invoice_to_id={getValues(
                                "order_confirmation_supplier_id"
                              )}
                              value={field.value}
                              onChangeValue={(value) => field.onChange(value)}
                              error={
                                errors &&
                                errors.order_confirmation_supplier_address_id
                              }
                            />
                          )}
                        />
                      }
                      renderEmployee={
                        <Controller
                          name="order_confirmation_supplier_contact_id"
                          control={control}
                          render={({ field }) => (
                            <InvoiceEmployeeForm
                              invoice_to_id={getValues(
                                "order_confirmation_supplier_id"
                              )}
                              value={field.value}
                              onChangeValue={(value) => field.onChange(value)}
                            />
                          )}
                        />
                      }
                      renderVat={
                        <Controller
                          name="order_confirmation_supplier_vat_id"
                          control={control}
                          render={({ field }) => (
                            <InvoiceVatForm
                              invoice_to_id={getValues(
                                "order_confirmation_supplier_id"
                              )}
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
              {/* <div className="flex flex-1 flex-col gap-1">
                <label>VAT</label>
                <Controller
                  name="order_confirmation_supplier_vat_id"
                  control={control}
                  render={({ field }) => (
                    <CmsVatSelect
                      cms_id={invoiceCmsId}
                      value={field.value}
                      onChangeValue={(value) => field.onChange(value)}
                      placeholder="Select VAT"
                    />
                  )}
                />
              </div> */}
            </div>
          </div>

          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller
              name="order_confirmation_copy_id"
              control={control}
              render={({ field }) => (
                <CopyTo
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  renderAddress={
                    <Controller
                      name="order_confirmation_copy_address_id"
                      control={control}
                      render={({ field }) => (
                        <CopyAddressForm
                          copy_to_id={getValues("order_confirmation_copy_id")}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  }
                  renderEmployee={
                    <Controller
                      name="order_confirmation_copy_contact_id"
                      control={control}
                      render={({ field }) => (
                        <CopyEmployeeForm
                          copy_to_id={getValues("order_confirmation_copy_id")}
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
                  {...register("order_confirmation_description")}
                  error={
                    errors && errors.order_confirmation_description
                      ? true
                      : false
                  }
                />
                {errors.order_confirmation_description && (
                  <ErrorFormMessage
                    message={errors.order_confirmation_description?.message}
                  />
                )}
              </div>
              <div className="flex gap-5">
                <div className="flex-1 flex flex-col gap-1">
                  <label>Document Language</label>
                  <Controller
                    name="order_confirmation_document_language"
                    control={control}
                    render={({ field }) => (
                      <DocumentLanguageSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={
                          errors && errors.order_confirmation_document_language
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label>Currency</label>
                  <Controller
                    name="order_confirmation_currency"
                    control={control}
                    render={({ field }) => (
                      <CurrencySelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.order_confirmation_currency}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex flex-1 flex-col gap-1">
                  <label>Document Date</label>
                  <Controller
                    name="order_confirmation_document_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                        date={field.value ? new Date(field.value) : undefined}
                        onChangeDate={(date) => field.onChange(date)}
                        format="dd-MM-yyyy"
                        error={
                          errors && errors.order_confirmation_document_date
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label htmlFor="is_exclusive_vat" className="cursor-pointer">
                    Exclusive Vat
                  </label>
                  <div className="flex items-center h-full">
                    <Controller
                      name="order_confirmation_is_exclusive_vat"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="is_exclusive_vat"
                          className="w-5 h-5 border-2 rounded-full group-hover/item:visible"
                          defaultChecked={!!+field.value}
                          onCheckedChange={(value: boolean) =>
                            field.onChange(value)
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex flex-col gap-1">
                  <label>Payment Terms</label>
                  <Controller
                    name="order_confirmation_payment_terms_id"
                    control={control}
                    render={({ field }) => (
                      <PaymentTermSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={
                          errors && errors.order_confirmation_payment_terms_id
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Shipping Method</label>
                  <Controller
                    name="order_confirmation_shipping_method_id"
                    control={control}
                    render={({ field }) => (
                      <ShippingMethodSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={
                          errors && errors.order_confirmation_shipping_method_id
                        }
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex flex-1 flex-col gap-1">
                  <label
                    htmlFor="is_with_delivery_date"
                    className="cursor-pointer"
                  >
                    With Delivery Date
                  </label>
                  <div className="flex items-center h-full">
                    <Checkbox
                      id="is_with_delivery_date"
                      className="w-5 h-5 border-2 rounded-full group-hover/item:visible"
                      onCheckedChange={(value: boolean) => {
                        setValue(
                          "order_confirmation_with_delivery_date",
                          value
                        );
                        setIsWithDeliveryDate(value);
                      }}
                    />
                  </div>
                </div>
                {isWithDeliveryDate && (
                  <div className="flex-1 flex flex-col gap-1">
                    <label>Delivery Date</label>
                    <Controller
                      name="order_confirmation_delivery_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                          date={field.value ? new Date(field.value) : undefined}
                          onChangeDate={(date) => field.onChange(date)}
                          format="dd-MM-yyyy"
                          error={
                            errors && errors.order_confirmation_delivery_date
                          }
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <p className="mb-3 font-medium text-base">Other Details</p>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <div className="flex flex-1 flex-col gap-1">
                  <label>PO Number</label>
                  <Input
                    className="bg-stone-100 border-0"
                    placeholder="Enter a PO number"
                    {...register("order_confirmation_purchase_order_number")}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <label>PO Date</label>
                  <Controller
                    name="order_confirmation_purchase_order_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                        date={field.value ? new Date(field.value) : undefined}
                        onChangeDate={(date) => field.onChange(date)}
                        format="dd-MM-yyyy"
                        error={
                          errors &&
                          errors.order_confirmation_purchase_order_date
                        }
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label>PO Attachment</label>
                {order_confirmation.order_confirmation_purchase_order_file && (
                  <div>
                    <span>
                      <i>Uploaded: </i>
                    </span>
                    {
                      <a
                        href={`https://hotware.blob.core.windows.net/apps/Hotware/po_attachments/${order_confirmation.order_confirmation_purchase_order_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#104bab" }}
                      >
                        {
                          order_confirmation.order_confirmation_purchase_order_file
                        }
                      </a>
                    }
                  </div>
                )}
                <Controller
                  name="order_confirmation_purchase_order_file"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      accept="*"
                      onChange={(files) => setFiles(files)}
                    />
                  )}
                />
                {errors.order_confirmation_purchase_order_file && (
                  <ErrorFormMessage
                    message={
                      errors.order_confirmation_purchase_order_file?.message
                    }
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label>Document Type</label>
                <Controller
                  name="order_confirmation_type"
                  control={control}
                  render={({ field }) => (
                    <ProjectTypeSelect
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      error={errors && errors.order_confirmation_type}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>Sharepoint Link</label>
                <Input
                  className="bg-stone-100 border-0"
                  placeholder="Enter a shareable sharepoint link"
                  {...register("order_confirmation_document_link")}
                />
              </div>
              <div className="flex gap-5">
                <div className="flex flex-1  flex-col gap-1">
                  <label>Industry</label>
                  <Controller
                    name="order_confirmation_industry_id"
                    control={control}
                    render={({ field }) => (
                      <CmsIndustrySelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.order_confirmation_industry_id}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-1  flex-col gap-1">
                  <label htmlFor="is_project_label" className="cursor-pointer">
                    Not a project
                  </label>
                  <Controller
                    name="order_confirmation_is_not_project"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="is_project_label"
                        className="w-5 h-5 border-2 rounded-full group-hover/item:visible"
                        defaultChecked={!!+field.value}
                        onCheckedChange={(value: boolean) =>
                          field.onChange(value)
                        }
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex flex-1 flex-col gap-1">
                  <label>Estimated Start Date</label>
                  <Controller
                    name="order_confirmation_start_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                        date={field.value ? new Date(field.value) : undefined}
                        onChangeDate={(date) => field.onChange(date)}
                        format="dd-MM-yyyy"
                        error={errors && errors.order_confirmation_start_date}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label>Estimated End Date</label>
                  <Controller
                    name="order_confirmation_end_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                        date={field.value ? new Date(field.value) : undefined}
                        onChangeDate={(date) => field.onChange(date)}
                        format="dd-MM-yyyy"
                        error={errors && errors.order_confirmation_end_date}
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

export default memo(EditOrderDetails);
