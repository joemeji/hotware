import { Button } from "@/components/ui/button";
import React, { memo, useContext, useEffect, useState } from "react";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { SettingsContext } from "@/context/access-token-context";
import * as yup from 'yup';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "@/components/ui/textarea";
import CurrencySelect from "@/components/app/currency-select";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import Combobox, { Content } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Details from "../EditShippingDetails/Details";
import DeliverTo, { AddressForm, EmployeeForm } from "../EditShippingDetails/DeliverTo";
import InvoiceTo, { InvoiceEmployeeForm } from "../EditShippingDetails/InvoiceTo";
import Sender, { SenderContactForm } from "../EditShippingDetails/Sender";
import CopyTo, { CopyAddressForm } from "../EditShippingDetails/CopyTo";
import ErrorFormMessage from "@/components/app/error-form-message";

dayjs.extend(timezone);

const yupSchema = yup.object({
  // Details
  shipping_description: yup.string().required('Description is required.'),
  currency: yup.string().required('Currency is required.'),
  shipping_delivery_date: yup.date().required('Delivery Date is required.'),
  shipping_furnace: yup.mixed().nullable(),
  shipping_type_of_unit: yup.string().nullable(),
  shipping_work: yup.string().nullable(),
  // Deliver to
  shipping_delivery_id: yup.number().required('Shipping Delivery is Required.'),
  shipping_delivery_address_id: yup.number().nullable(),
  shipping_delivery_contact_id: yup.number().nullable(),
  // Invoice To
  shipping_supplier_id: yup.number().required('Shipping Invoice is Required.'),
  shipping_supplier_address_id: yup.number().nullable(),
  // Sender
  warehouse_id: yup.number().required('Warehouse is Required.'),
  shipping_sender_contact: yup.number().nullable(),
  // Copy To
  shipping_copy_id: yup.number().nullable(),
  shipping_copy_address_id: yup.number().nullable(),
});

function CreateShippingDetails(props: EditShippingDetailsModalProps) {
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const settings: any = useContext(SettingsContext);
  const type_of_units = settings ? settings.type_of_units : [];
  const works = settings ? settings.works : [];
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const router = useRouter();

  const typeofWorkContents: Content[] = type_of_units.map((value: any) => ({ value, text: value }));
  const worksContents: Content[] = works.map((value: any) => ({ value, text: value }));

  const { 
    control,
    register, 
    handleSubmit, 
    formState: { errors }, 
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      shipping_description: shippingDetails && shippingDetails.shipping_description,
      currency: shippingDetails && shippingDetails.shipping_currency,
      shipping_delivery_date: shippingDetails && shippingDetails.shipping_delivery_date,
      shipping_furnace: shippingDetails && shippingDetails.shipping_furnace,
      shipping_type_of_unit: shippingDetails && shippingDetails.shipping_type_of_unit,
      shipping_work: shippingDetails && shippingDetails.shipping_work,
      shipping_delivery_id: shippingDetails && shippingDetails.cms_id,
      shipping_delivery_address_id: shippingDetails && shippingDetails.cms_address_id,
      shipping_delivery_contact_id: shippingDetails && shippingDetails.shipping_delivery_contact_id,
      shipping_supplier_id: shippingDetails && shippingDetails.supplier_cms_id,
      shipping_supplier_address_id: shippingDetails && shippingDetails.supplier_address_id,
      warehouse_id: shippingDetails && shippingDetails.warehouse_id,
      shipping_sender_contact: shippingDetails && shippingDetails.shipping_sender_contact,
      shipping_copy_id: shippingDetails && shippingDetails.copy_cms_id,
      shipping_copy_address_id: shippingDetails && shippingDetails.shipping_copy_address_id,
    }
  });

  const onSubmitEditForm = async (data: any) => {
    setLoadingSubmit(true);
    try {
      if (data.shipping_delivery_date) {
        data.shipping_delivery_date = (
          dayjs(data.shipping_delivery_date).format('YYYY-MM-DD')
        );
      }
      data.timezone = dayjs.tz.guess();

      const res = await fetch('/api/shipping/create', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (json.success) {
        toast({
          title: "New shipping added successfully.",
          variant: 'success',
          duration: 2000
        });
        setTimeout(() => {
          setLoadingSubmit(false);
          router.push('/projects/shipping-list/' + json._shipping_id);
        }, 300);
      }  
    }
    catch(err: any) {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    if (shippingDetails) {
      setValue('shipping_description', shippingDetails.shipping_description);
      setValue('currency', shippingDetails.shipping_currency);
      setValue('shipping_delivery_date', shippingDetails.shipping_delivery_date);
      setValue('shipping_furnace', shippingDetails.shipping_furnace);
      setValue('shipping_delivery_date', shippingDetails.shipping_delivery_date);
      setValue('shipping_type_of_unit', shippingDetails.shipping_type_of_unit);
      setValue('shipping_work', shippingDetails.shipping_work);
      setValue('shipping_delivery_id', shippingDetails.cms_id);
      setValue('shipping_delivery_address_id', shippingDetails.cms_address_id);
      setValue('shipping_delivery_contact_id', shippingDetails.shipping_delivery_contact_id);
      setValue('shipping_supplier_id', shippingDetails.supplier_cms_id);
      setValue('shipping_supplier_address_id', shippingDetails.supplier_address_id);
      setValue('warehouse_id', shippingDetails.warehouse_id);
      setValue('shipping_sender_contact',shippingDetails.shipping_sender_contact);
      setValue('shipping_copy_id', shippingDetails.copy_cms_id);
      setValue('shipping_copy_address_id', shippingDetails.shipping_copy_address_id);
    }
  }, [shippingDetails, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmitEditForm)}>
      <div className="flex flex-col p-5 gap-3 w-full mx-auto max-w-[1600px]">

        <div className="flex justify-between bg-background p-3 rounded-app items-center shadow-sm">
          <h1 className="text-lg font-medium">Create Shipping</h1>
          <div className="flex items-center gap-1">
            <Button 
              variant={'secondary'} 
              type="button" 
              disabled={loadingSubmit}
              onClick={() => {
                router.back();
              }}
            >
              Back
            </Button>
            <Button type="submit" disabled={loadingSubmit} className={cn(loadingSubmit && 'loading')}>Submit</Button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Details 
              renderDescription={(
                <>
                  <Textarea 
                    className="bg-stone-100 border-0" 
                    {...register('shipping_description')}
                    error={(errors && errors.shipping_description) ? true : false}
                  />
                  {errors.shipping_description && (
                    <ErrorFormMessage message={errors.shipping_description?.message} />
                  )}
                </>
              )}
              renderCurrency={(
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <CurrencySelect 
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      error={errors && errors.currency}
                    />
                  )}
                />
              )}
              renderDeliveryDate={(
                <Controller
                  name="shipping_delivery_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                      date={field.value ? new Date(field.value) : undefined}
                      onChangeDate={date => field.onChange(date)}
                      format="dd-MM-yyyy"
                      error={errors && errors.shipping_delivery_date}
                    />
                  )}
                />
              )}
              renderFurnace={(
                <Input 
                  className="bg-stone-100 border-0" 
                  {...register('shipping_furnace')}
                />
              )}
              renderTypeOfUnit={(
                <Controller
                  name="shipping_type_of_unit"
                  control={control}
                  render={({ field }) => (
                    <Combobox 
                      contents={typeofWorkContents}
                      value={field.value}
                      onChangeValue={(value) => field.onChange(value)}
                    />
                  )}
                />
              )}
              renderWork={(
                <Controller
                  name="shipping_work"
                  control={control}
                  render={({ field }) => (
                    <Combobox 
                      contents={worksContents}
                      value={field.value}
                      onChangeValue={(value) => field.onChange(value)}
                    />
                  )}
                />
              )}
            />
          </div>

          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller
              name="shipping_delivery_id"
              control={control}
              render={({ field }) => (
                <DeliverTo 
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  error={errors && errors.shipping_delivery_id}
                  renderAddress={(
                    <Controller 
                      name="shipping_delivery_address_id"
                      control={control}
                      render={({ field }) => (
                        <AddressForm 
                          deliver_to_id={getValues('shipping_delivery_id')}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                          error={errors && errors.shipping_delivery_address_id}
                        />
                      )}
                    />
                  )}
                  renderEmployee={(
                    <Controller 
                      name="shipping_delivery_contact_id"
                      control={control}
                      render={({ field }) => (
                        <EmployeeForm 
                          deliver_to_id={getValues('shipping_delivery_id')}
                          value={field.value}
                          onChangeValue={(value) =>field.onChange(value)}
                        />
                      )}
                    />
                  )}
                />
              )}
            />
          </div>
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller 
              name="shipping_supplier_id"
              control={control}
              render={({ field }) => (
                <InvoiceTo
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)} 
                  error={errors && errors.shipping_supplier_id}
                  renderAddress={(
                    <Controller 
                      name="shipping_supplier_address_id"
                      control={control}
                      render={({ field }) => (
                        <InvoiceEmployeeForm 
                          invoice_to_id={getValues('shipping_supplier_id')}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                          error={errors && errors.shipping_supplier_address_id}
                        />
                      )}
                    />
                  )}
                />
              )}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller 
              name="warehouse_id"
              control={control}
              render={({ field }) => (
                <Sender 
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  error={errors && errors.warehouse_id}
                  renderContactForm={(
                    <Controller 
                      name="shipping_sender_contact"
                      control={control}
                      render={({ field }) => (
                        <SenderContactForm 
                          onChangeValue={(value) => field.onChange(value)}
                          value={field.value}
                        />
                      )}
                    />
                  )}
                />
              )}
            />
          </div>
          <div className="w-1/3 bg-background p-6 rounded-app shadow-sm">
            <Controller 
              name="shipping_copy_id"
              control={control}
              render={({ field }) => (
                <CopyTo 
                  value={field.value}
                  onChangeValue={(value) => field.onChange(value)}
                  renderAddress={(
                    <Controller 
                      name="shipping_copy_address_id"
                      control={control}
                      render={({ field }) => (
                        <CopyAddressForm 
                          shipping_copy_id={getValues('shipping_copy_id')}
                          value={field.value}
                          onChangeValue={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  )}
                />
              )}
            />
          </div>
          <div className="w-1/3"/>
        </div>

      </div>
    </form>
  );
}

export default memo(CreateShippingDetails);

type EditShippingDetailsModalProps = {}