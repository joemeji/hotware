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
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import useSWR, { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import BookingTypeSelect from "@/components/app/booking-type-select";
import VatSelect from "@/components/app/vat-select";
import AccountTitleSelect from "@/components/app/account-titles-select";
import X2JS from "x2js";
import xmlFormat from "xml-formatter";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

let JSON_XML = {
  AbaConnectContainer: {
    TaskCount: 1,
    Task: {
      Parameter: {
        Application: "FIBU",
        Id: "XML Buchungen",
        MapId: "AbaDefault",
        Version: 2015,
      },
      Transaction: {},
    },
  },
};

function AbacusExportModal(props: AbacusExportModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, invoice, onSubmit } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<null | String>(null);
  const { mutate } = useSWRConfig();
  const yupSchema = yup.object({
    booking_type: yup.string().required(),
    invoice_account_debit: yup.number().required(),
    invoice_account_credit: yup.number().required(),
    invoice_vat_code: yup.number().required(),
    invoice_amount: yup.number().required(),
    invoice_description: yup.string().max(80).required(),
    invoice_book: yup.boolean().required(),
    invoice_date: yup.string().required(),
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
      invoice_date: dayjs().format("YYYY-MM-DD"),
    },
  });

  const onSubmitForm = async (formData: any) => {
    setError(null);
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

      if (json.success) {
        const success = await exportToXML(invoice._invoice_id, formData);
        if (success) {
          onSubmit && onSubmit(invoice._invoice_id);
          onOpenChange && onOpenChange(false);

          mutate(
            [`/api/projects/invoices?`, session?.user?.access_token]
          );
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  const checkDataIfMissing = (
    booking: any,
    number: any,
    base_currency: any,
    currency: any,
    total: any,
    received: any,
    receivable: any,
    tax_account: any,
    sales: any,
    percentage: any,
    vat: any,
    country: any,
    tax_code: any
  ) => {
    if (!booking) {
      setError(
        "Booking type is missing! Please update in the field or in the invoice."
      );
      return false;
    } else if (!number) {
      setError(
        "Abacus number is missing! Please update in the Settings (Abacus Connection)."
      );
      return false;
    } else if (!base_currency) {
      setError(
        "Base currency is missing! Please update in the Settings (Abacus Connection)."
      );
      return false;
    } else if (!currency) {
      setError(
        "Currency is missing! Please update in the field or in the invoice."
      );
      return false;
    } else if (!total) {
      setError(
        "Total is missing! Please update in the field or in the invoice."
      );
      return false;
    } else if (!received) {
      setError(
        "Amount received is missing! Please update in the field or in the invoice."
      );
      return false;
    } else if (!receivable) {
      setError(
        "Receivable account is missing! Please update in the field or in the invoice."
      );
      return false;
    } else if (!tax_account) {
      setError(
        "Tax account is missing! Please update in the Settings (Value Added Tax [VAT])."
      );
      return false;
    } else if (!sales) {
      setError(
        "Sales account is missing! Please update in the field or in the invoice."
      );
      return false;
    } else if (!percentage) {
      setError(
        "Tax percentage is missing! Please update in the Settings (Value Added Tax [VAT])."
      );
      return false;
    } else if (!vat) {
      setError(
        "Invoice VAT is missing! Please update in the the field or in the invoice."
      );
      return false;
    } else if (!country) {
      setError(
        "Tax country is missing! Please update in the the Settings (Value Added Tax [VAT])."
      );
      return false;
    } else if (!tax_code) {
      setError(
        "Tax code is missing! Please update in the the Settings (Value Added Tax [VAT])."
      );
      return false;
    } else {
      return true;
    }
  };

  const exportToXML = async (_invoice_id: string, data: any) => {
    const options = {
      method: "GET",
      headers: { ...authHeaders(session?.user?.access_token) },
    };

    const res = await fetch(
      baseUrl + `/api/projects/invoices/${_invoice_id}/abacus`,
      options
    );

    const json = await res.json();
    const invoice = json.invoice;
    const baseCurrency = json.base_currency;
    const isAbacusNumber = json.is_abacus_number;
    
    if (
      !checkDataIfMissing(
        invoice.invoice_abacus_booking,
        isAbacusNumber,
        baseCurrency,
        invoice.invoice_currency,
        invoice.invoice_abacus_amount,
        true,
        invoice.invoice_abacus_debit,
        invoice.vat_account,
        invoice.invoice_abacus_credit,
        invoice.vat_percentage,
        true,
        invoice.vat_country,
        invoice.invoice_abacus_vat
      )
    ) {
      return false;
    }

    let transactionRows = {
      Entry: {
        CollectiveInformation: {
          EntryLevel: "A",
          EntryType: "S",
          Type: invoice.invoice_abacus_booking,
          DebitCredit: "D",
          Client: isAbacusNumber,
          Division: 0,
          KeyCurrency: baseCurrency,
          EntryDate: data.invoice_date,
          AmountData: {
            Currency: invoice.invoice_currency,
            Amount: invoice.invoice_abacus_amount,
            _mode: "SAVE",
          },
          KeyAmount:
            invoice.invoice_currency == baseCurrency
              ? invoice.invoice_abacus_amount
              : 0,
          Account: invoice.invoice_abacus_debit,
          TaxAccount: invoice.vat_account,
          Text1: invoice.invoice_abacus_description,
          SingleCount: 0,
          _mode: "SAVE",
        },
        SingleInformation: {
          Type: invoice.invoice_abacus_booking,
          DebitCredit: "D",
          EntryDate: data.invoice_date,
          AmountData: {
            Currency: invoice.invoice_currency,
            Amount: invoice.invoice_abacus_amount,
            _mode: "SAVE",
          },
          KeyAmount:
            invoice.invoice_currency == baseCurrency
              ? invoice.invoice_abacus_amount
              : 0,
          Account: invoice.invoice_abacus_credit,
          Text1: invoice.invoice_abacus_description,
          TaxData: {
            TaxIncluded: invoice.invoice_is_exclusive_vat == 1 ? "" : "I",
            TaxType: 0,
            UseCode: 0,
            AmountData: {
              Currency: baseCurrency,
              Amount: 0,
              _mode: "SAVE",
            },
            KeyAmount:
              invoice.invoice_currency == baseCurrency
                ? -1 * invoice.invoice_vat
                : 0,
            TaxRate: invoice.vat_percentage,
            TaxCoefficient: 100,
            Country: invoice.vat_country,
            TaxCode: invoice.invoice_abacus_vat,
            FlatRate: 0,
            _mode: "SAVE",
          },
          _mode: "SAVE",
        },
        _mode: "SAVE",
      },
    };

    JSON_XML.AbaConnectContainer.Task.Transaction = transactionRows;
    const x2js = new X2JS();
    const convertedJSON = x2js.js2xml(JSON_XML);
    const trimXML = xmlFormat(convertedJSON, {
      indentation: "    ",
      collapseContent: true,
    });
    const JSON_XML_EXPORT = trimXML;

    const strData =
      "data:text/xml;charset=utf-8," + encodeURIComponent(JSON_XML_EXPORT);
    const anchorData = document.createElement("a");
    anchorData.setAttribute("href", strData);
    anchorData.setAttribute("download", invoice.invoice_number + ".xml");
    anchorData.click();
    anchorData.remove();

    // set invoice as exported
    const exportRes = await fetch(
      baseUrl + `/api/projects/invoices/${_invoice_id}/abacus_exported`,
      {
        method: "POST",
        headers: { ...authHeaders(session?.user?.access_token) },
        body: JSON.stringify({
          is_invoice_booked: data.invoice_book,
          timezone: dayjs.tz.guess(),
        }),
      }
    );
    await exportRes.json();

    return true;
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
                    className="bg-stone-100 border-0"
                    error={errors && (errors.invoice_date ? true : false)}
                    {...register("invoice_date")}
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
                  maxLength={80}
                />
                {errors.invoice_description && (
                  <span className="text-red-500 text-sm">
                    <>{errors.invoice_description?.message}</>
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2.5">
                <Controller
                  name="invoice_book"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="invoice_book"
                      className="rounded-none w-[17px] h-[17px]"
                      defaultChecked={!!+field.value}
                      onCheckedChange={(value: boolean) =>
                        field.onChange(value)
                      }
                    />
                  )}
                />
                <label
                  htmlFor="invoice_book"
                  className="font-medium cursor-pointer"
                >
                  SET INVOICE AS BOOKED IN ACCOUNTING AFTER THE EXPORT
                </label>
              </div>
              <div className="mt-4 flex items-center text-red-500">
                {error ?? ""}
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
  onAdded?: () => void;
};
