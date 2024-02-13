import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { cn } from "@/lib/utils";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
// import { ShippingDetailsContext } from "@/context/shipping-details-context";
// import { AccessTokenContext } from "@/context/access-token-context";
import useSWR, { useSWRConfig } from "swr";
// import VatSelect from "@/components/app/vat-select";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import BookingTypeSelect from "@/components/app/booking-type-select";
import VatSelect from "@/components/app/vat-select";
import AccountTitleSelect from "@/components/app/account-titles-select";

function AbacusExportModal(props: AbacusExportModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, invoice, onSubmit } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();
  // const { data: calculation } = useSWR(
  //   [
  //     offer_item_id
  //       ? `/api/projects/offers/items/calculation/${offer_item_id}`
  //       : undefined,
  //     session?.user?.access_token,
  //   ],
  //   fetchApi,
  //   {
  //     revalidateOnFocus: false,
  //     revalidateIfStale: false,
  //   }
  // );

  const yupSchema = yup.object({
    booking_type: yup.string().required(),
    invoice_account_debit: yup.number().required(),
    invoice_account_credit: yup.number().required(),
    invoice_vat_code: yup.number().required(),
    invoice_amount: yup.number().required(),
    invoice_description: yup.string().required(),
    invoice_book: yup.boolean().required(),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      booking_type: "Normal",
      invoice_account_debit: 0,
      invoice_account_credit: 0,
      invoice_vat_code: 0,
      invoice_amount: invoice?.invoice_total,
      invoice_description: invoice?.invoice_description,
      invoice_book: false,
    },
  });

  const onSubmitForm = async (formData: any) => {
    if (Object.keys(errors).length > 0) return;
    try {
      setIsSubmitting(true);
      const options = {
        method: "POST",
        headers: { ...authHeaders(session?.user?.access_token) },
        body: JSON.stringify(formData),
      };
      const res = await fetch(
        baseUrl + `/api/projects/invoices/${invoice._invoice_id}/abacus`,
        options
      );
      const json = await res.json();
      setIsSubmitting(false);
      onOpenChange && onOpenChange(false);
      if (json.success) {
        onSubmit && onSubmit(invoice.invoice_id);
      }
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (invoice) {
      setValue("invoice_description", invoice.invoice_description);
      setValue("invoice_amount", invoice.invoice_total);
    }
  }, [invoice, setValue]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) =>
          !isSubmitting && onOpenChange && onOpenChange(open)
        }
      >
        <DialogContent className="max-w-[900px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>Export to Abacus</DialogTitle>
            <DialogPrimitive.Close
              disabled={isSubmitting}
              className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
            >
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="flex flex-col p-3 gap-x-5 gap-y-2">
              <div>
                <label>Customer Name</label>
                <Input
                  type="text"
                  className="border-0"
                  disabled={true}
                  defaultValue={invoice?.client}
                />
              </div>
              <div className="flex gap-2.5 w-full">
                <div className="flex-1">
                  <label>Booking Type</label>
                  <Controller
                    name="booking_type"
                    control={control}
                    render={({ field }) => (
                      <BookingTypeSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.booking_type}
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <label>Date</label>
                  <Input
                    type="date"
                    className="border-0 w-full"
                    value={invoice?.invoice_date}
                  />
                </div>
              </div>
              <div className="flex gap-2.5 w-full">
                <div className="flex-1">
                  <label>Accounts Receivables</label>
                  <Controller
                    name="invoice_account_debit"
                    control={control}
                    render={({ field }) => (
                      <AccountTitleSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.invoice_account_debit}
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <label>Sales</label>
                  <Controller
                    name="invoice_account_credit"
                    control={control}
                    render={({ field }) => (
                      <AccountTitleSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.invoice_account_credit}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-2.5 w-full">
                <div className="flex-1">
                  <label>VAT Code</label>
                  <Controller
                    name="invoice_vat_code"
                    control={control}
                    render={({ field }) => (
                      <VatSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.invoice_vat_code}
                        byCompany={true}
                        allowNoVat={false}
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <label>Amount</label>
                  <Input
                    type="number"
                    className="bg-stone-100 border-0"
                    step=".01"
                    error={errors && (errors.invoice_amount ? true : false)}
                    {...register("invoice_amount")}
                  />
                  {errors.invoice_amount && (
                    <span className="text-red-500 text-sm">
                      <>{errors.invoice_amount?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label>Description</label>
                <Textarea
                  className="bg-stone-100 border-0"
                  error={errors && (errors.invoice_description ? true : false)}
                  {...register("invoice_description")}
                />
                {errors.invoice_description && (
                  <span className="text-red-500 text-sm">
                    <>{errors.invoice_description?.message}</>
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2.5">
                <Checkbox
                  id="booked_accounting"
                  className="rounded-none w-[17px] h-[17px]"
                  {...register("invoice_book")}
                />
                <label
                  htmlFor="booked_accounting"
                  className="font-medium cursor-pointer"
                >
                  SET INVOICE AS BOOKED IN ACCOUNTING AFTER THE EXPORT
                </label>
              </div>
            </div>

            <DialogFooter className="p-3">
              <Button type="submit" disabled={isSubmitting}>
                Export to Abacus
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(AbacusExportModal);

type AbacusExportModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  invoice: any;
  onSubmit?: (updatedItem?: any) => void;
  onAdded?: () => void
};
