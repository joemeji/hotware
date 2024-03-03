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
import { Input } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import AccountTitleSelect from "@/components/app/account-titles-select";
import X2JS from "x2js";
import xmlFormat from "xml-formatter";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { toast } from "@/components/ui/use-toast";

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

function truncateText(text: String) {
  const maxLength = 80;

  if (text.length <= maxLength) {
    return text; // If the text is already within the limit, no need to truncate
  } else {
    // Truncate the text and add ellipsis at the end
    return text.slice(0, maxLength - 3) + "...";
  }
}

function ExportDiscountModal(props: ExportDiscountModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, invoice, onSubmit } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<null | String>(null);
  const yupSchema = yup.object({
    discount_bank_account: yup.number().required("Bank Account is required"),
    discount_amount: yup.number().required("Amount is required"),
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
      discount_bank_account: 0,
      discount_amount: 0,
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
        baseUrl + `/api/projects/invoices/${invoice._invoice_id}/discounts`,
        options
      );
      const json = await res.json();
      setIsSubmitting(false);
      if (json.success) {
        const success = await exportToXML(
          invoice._invoice_id,
          json.bank_code,
          formData
        );
        if (success) {
          onSubmit && onSubmit(invoice._invoice_id);
          onOpenChange && onOpenChange(false);
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

  const exportToXML = async (
    _invoice_id: string,
    bankCode: string,
    data: any
  ) => {
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
        invoice.invoice_total,
        invoice.invoice_total_payment_received,
        bankCode,
        invoice.vat_account,
        invoice.invoice_abacus_debit,
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
          EntryDate: new Date().toISOString().slice(0, 10),
          AmountData: {
            Currency: invoice.invoice_currency,
            Amount:
              parseFloat(invoice.invoice_total) -
              parseFloat(invoice.invoice_total_payment_received),
            _mode: "SAVE",
          },
          KeyAmount:
            parseFloat(invoice.invoice_total) -
            parseFloat(invoice.invoice_total_payment_received),
          Account: bankCode,
          TaxAccount: invoice.vat_account,
          Text1: truncateText(`Discount/Loss for ${invoice.invoice_number}`),
          SingleCount: 0,
          _mode: "SAVE",
        },
        SingleInformation: {
          Type: invoice.invoice_abacus_booking,
          DebitCredit: "D",
          EntryDate: new Date().toISOString().slice(0, 10),
          AmountData: {
            Currency: invoice.invoice_currency,
            Amount:
              parseFloat(invoice.invoice_total) -
              parseFloat(invoice.invoice_total_payment_received),
            _mode: "SAVE",
          },
          KeyAmount:
            parseFloat(invoice.invoice_total) -
            parseFloat(invoice.invoice_total_payment_received),
          Account: invoice.invoice_abacus_debit,
          Text1: truncateText(`Discount/Loss for ${invoice.invoice_number}`),
          TaxData: {
            TaxIncluded: "I",
            TaxType: 0,
            UseCode: 0,
            AmountData: {
              Currency: baseCurrency,
              Amount: 0,
              _mode: "SAVE",
            },
            KeyAmount: -1 * invoice.invoice_vat,
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
    anchorData.setAttribute(
      "download",
      "Discount/Loss for " + invoice.invoice_number + ".xml"
    );
    anchorData.click();
    anchorData.remove();

    // set invoice as exported
    const exportRes = await fetch(
      baseUrl + `/api/projects/invoices/${_invoice_id}/discount_exported`,
      {
        method: "POST",
        headers: { ...authHeaders(session?.user?.access_token) },
        body: JSON.stringify({
          timezone: dayjs.tz.guess(),
        }),
      }
    );
    await exportRes.json();
    toast({
      title: "Successfully saved and exported.",
      variant: "success",
      duration: 1000,
    });
    return true;
  };

  useEffect(() => {
    if (invoice) {
      setValue(
        "discount_amount",
        parseFloat(invoice.invoice_total) -
          parseFloat(invoice.invoice_total_payment_received)
      );
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
            <DialogTitle>Export Invoice Discount / Loss</DialogTitle>
            <DialogPrimitive.Close
              disabled={isSubmitting}
              className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
            >
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="flex flex-col p-3 gap-x-5 gap-y-2">
              <div className="flex gap-2.5 w-full">
                <div className="flex-1">
                  <label>Bank Account</label>
                  <Controller
                    name="discount_bank_account"
                    control={control}
                    render={({ field }) => (
                      <AccountTitleSelect
                        onChangeValue={(value) => field.onChange(value)}
                        value={field.value}
                        error={errors && errors.discount_bank_account}
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
                    error={errors && (errors.discount_amount ? true : false)}
                    {...register("discount_amount")}
                  />
                  {errors.discount_amount && (
                    <span className="text-red-500 text-sm">
                      <>{errors.discount_amount?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center text-red-500">
                {error ?? ""}
              </div>
            </div>

            <DialogFooter className="p-3">
              <Button type="submit" disabled={isSubmitting}>
                Save and Export Discount/Loss
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(ExportDiscountModal);

type ExportDiscountModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  invoice: any;
  onSubmit?: (updatedItem?: any) => void;
  onAdded?: () => void;
};
