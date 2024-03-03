import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useCallback, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Check, Trash, Save, Download } from "lucide-react";
import { Input } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import useSWR, { mutate, useSWRConfig } from "swr";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import AccountTitleSelect from "@/components/app/account-titles-select";
import X2JS from "x2js";
import xmlFormat from "xml-formatter";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { cn } from "@/lib/utils";
import { useDelete } from "./useDeletePayment";
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

const round2 = (val: number) => {
  return Number((Math.round(val * 100) / 100).toFixed(2));
};

const PaymentRows = ({
  total,
  payments,
  handleDelete,
}: {
  total: number;
  payments: any[];
  handleDelete: any;
}) => {
  let totalAmount = total;
  let amount = total;
  return payments.map((payment, key: number) => {
    amount = totalAmount;
    totalAmount -= parseFloat(payment.invoice_payment_received);
    return (
      <tr key={key}>
        <TD>{round2(amount)}</TD>
        <TD>{payment.invoice_payment_date}</TD>
        <TD>{payment.invoice_payment_type}</TD>
        <TD>{round2(payment.invoice_payment_received)}</TD>
        <TD>{round2(payment.invoice_payment_wh_tax)}</TD>
        <TD>{round2(payment.invoice_payment_bank_account)}</TD>
        <TD>
          <button
            onClick={() => handleDelete(payment.invoice_payment_id)}
            className="bg-red-500 p-1.5 rounded-sm"
          >
            <Trash color="#fff" width={18} />
          </button>
        </TD>
      </tr>
    );
  });
};

function ExportPaymentModal(props: ExportPaymentModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, invoice, onSubmit } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<null | String>(null);
  const { data: exportedInvoice, mutate: mutateExported } = useSWR(
    [
      invoice?._invoice_id
        ? `/api/projects/invoices/${invoice._invoice_id}/abacus`
        : undefined,
      session?.user?.access_token,
    ],
    fetchApi
  );
  const { data: totalPayment } = useSWR(
    [
      invoice?._invoice_id
        ? `/api/projects/invoices/${invoice._invoice_id}/total_payment`
        : undefined,
      session?.user?.access_token,
    ],
    fetchApi
  );
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    _invoice_id: invoice?._invoice_id,
    onDelete: () => {
      mutateExported();
    },
  });

  const yupSchema = yup.object({
    payment_invoice_date: yup.string().required("Payment Date is required."),
    invoice_payment_type: yup.boolean().required(),
    payment_invoice_received: yup.number().required(),
    payment_invoice_wh_tax: yup.number().required(),
    payment_invoice_difference: yup.number().required(),
    payment_bank_account: yup.string().required("Bank Account is required."),
    customer_amount: yup.number().required(),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      payment_invoice_date: "",
      invoice_payment_type: false,
      payment_invoice_received: 0,
      payment_invoice_wh_tax: 0,
      payment_invoice_difference: 0,
      payment_bank_account: "",
      customer_amount: round2(invoice?.invoice_total),
    },
  });
  const data = watch();
  const invoicedAmount =
    parseFloat(invoice?.invoice_total || 0) -
    (parseFloat(totalPayment?.totalAmount || 0) +
      parseFloat(totalPayment?.totalWHTax || 0));
  const difference =
    invoicedAmount -
    (+data.payment_invoice_received + +data.payment_invoice_wh_tax);

  const onSubmitForm = async (formData: any) => {
    setError(null);
    if (Object.keys(errors).length > 0) return;
    if (formData.payment_invoice_received <= 0) {
      setError("Amount should be greater than 0.");
      return;
    }

    if (!data.payment_bank_account) {
      setError("Bank account is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const options = {
        method: "POST",
        headers: { ...authHeaders(session?.user?.access_token) },
        body: JSON.stringify(formData),
      };
      const res = await fetch(
        baseUrl + `/api/projects/invoices/${invoice._invoice_id}/payments`,
        options
      );
      const json = await res.json();

      // mutate data
      mutate([
        `/api/projects/invoices/${invoice._invoice_id}/total_payment`,
        session?.user?.access_token,
      ]);

      setIsSubmitting(false);

      if (res.status !== 200) {
        setError(json.message);
        return;
      }
      if (json.success) {
        mutateExported();
      }
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  const calculateRemainingAmount = useCallback(() => {
    setValue("payment_invoice_date", invoice.invoice_date);
    setValue("customer_amount", round2(invoice.invoice_total));
  }, [setValue, invoice]);

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
    const payments = invoice.receive;
    const baseCurrency = json.base_currency;
    const isAbacusNumber = json.is_abacus_number;
    const paymentIds = payments?.map(
      (payment: any) => payment.invoice_payment_id
    );

    let isDownloadable = true;
    let transactionRows: any[] = [];
    for (let payment of payments) {
      if (
        !checkDataIfMissing(
          invoice.invoice_abacus_booking,
          invoice.is_abacus_number,
          baseCurrency,
          payment.currency,
          payment.invoice_payment_received,
          true,
          invoice.invoice_abacus_debit,
          true,
          payment.invoice_payment_bank_account,
          true,
          true,
          true,
          true
        )
      ) {
        isDownloadable = false;
        break;
      }

      transactionRows = [
        ...transactionRows,
        {
          Entry: {
            CollectiveInformation: {
              EntryLevel: "A",
              EntryType: "S",
              Type: invoice.invoice_abacus_booking,
              DebitCredit: "C",
              Client: invoice.is_abacus_number,
              Division: 0,
              KeyCurrency: baseCurrency,
              EntryDate: payment.invoice_payment_date,
              AmountData: {
                Currency: payment.currency,
                Amount: parseFloat(payment.invoice_payment_received),
                _mode: "SAVE",
              },
              KeyAmount:
                payment.currency == baseCurrency
                  ? parseFloat(payment.invoice_payment_received)
                  : 0,
              Account: invoice.invoice_abacus_debit,
              Text1: payment.invoice_payment_description,
              SingleCount: 0,
              _mode: "SAVE",
            },
            SingleInformation: {
              Type: invoice.invoice_abacus_booking,
              DebitCredit: "C",
              EntryDate: payment.invoice_payment_date,
              AmountData: {
                Currency: payment.currency,
                Amount: parseFloat(payment.invoice_payment_received),
                _mode: "SAVE",
              },
              KeyAmount:
                payment.currency == baseCurrency
                  ? parseFloat(payment.invoice_payment_received)
                  : 0,
              Account: payment.invoice_payment_bank_account,
              Text1: payment.invoice_payment_description,
              _mode: "SAVE",
            },
            _mode: "SAVE",
          },
        },
      ];
    }

    if (!isDownloadable) return false;

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
    anchorData.setAttribute("download", "Invoice_Payment_Batch_Export.xml");
    anchorData.click();
    anchorData.remove();

    // set invoice as exported
    const exportRes = await fetch(
      baseUrl + `/api/projects/invoices/${_invoice_id}/payment_exported`,
      {
        method: "POST",
        headers: { ...authHeaders(session?.user?.access_token) },
        body: JSON.stringify({
          paymentIds,
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

  const handleExport = async () => {
    try {
      if (invoice.receive == 0) {
        setError("Received payment is still empty.");
        return;
      }

      if (
        invoice.invoice_is_exported_by == null ||
        invoice.invoice_is_booked == 0
      ) {
        setError(
          "Invoice must be booked/exported to abacus before the payment."
        );
        return;
      }

      setIsExporting(true);
      const success = await exportToXML(invoice._invoice_id, invoice);
      if (success) {
        onSubmit && onSubmit(invoice._invoice_id);
        onOpenChange && onOpenChange(false);
      }
      setIsExporting(false);
    } catch (error) {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (invoice && totalPayment) {
      calculateRemainingAmount();
    }
  }, [invoice, totalPayment, calculateRemainingAmount]);

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
            <DialogTitle>Add Payment Information</DialogTitle>
            <DialogPrimitive.Close
              disabled={isSubmitting}
              className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
            >
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <DeleteDialog />
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="flex flex-col p-3 gap-x-5 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label>Amount Invoiced</label>
                  <Input
                    type="text"
                    className="border-0"
                    disabled={true}
                    readOnly
                    defaultValue={`${round2(invoicedAmount)} (${
                      invoice?.invoice_total || 0
                    } - ${
                      parseFloat(totalPayment?.totalAmount || 0) +
                      parseFloat(totalPayment?.totalWHTax || 0)
                    })`}
                  />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1">
                    <label>Payment Date</label>
                    <Input
                      type="date"
                      className="border-0"
                      {...register("payment_invoice_date")}
                    />
                    {errors.payment_invoice_date && (
                      <span className="text-red-500 text-sm">
                        <>{errors.payment_invoice_date?.message}</>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex items-center">
                    <Controller
                      name="invoice_payment_type"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="invoice_payment_type"
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
                      className="ml-2 cursor-pointer"
                    >
                      Partial Payment
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label>Currency</label>
                  <Input
                    type="text"
                    className="border-0"
                    disabled={true}
                    readOnly
                    defaultValue={invoice?.currency}
                  />
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-full">
                    <label>VAT</label>
                    <Input
                      type="text"
                      className="border-0"
                      disabled={true}
                      readOnly
                      defaultValue={round2(
                        parseFloat(invoice?.invoice_vat) +
                          parseFloat(invoice?.invoice_RTVat) * -1
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <label>Discount</label>
                    <Input
                      type="text"
                      className="border-0"
                      disabled={true}
                      readOnly
                      defaultValue={round2(invoice?.invoice_discount)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5 w-full">
                <div className="flex-1">
                  <label>Deduction</label>
                  <Input
                    type="text"
                    className="border-0"
                    disabled={true}
                    readOnly
                    defaultValue={round2(
                      parseFloat(invoice?.invoice_deduction || 0) * -1
                    )}
                  />
                </div>
                <div className="flex-1">
                  <label>Surcharge</label>
                  <Input
                    type="text"
                    className="border-0"
                    disabled={true}
                    readOnly
                    defaultValue={round2(invoice?.invoice_surcharge || 0)}
                  />
                </div>
              </div>
              <div className="flex gap-2.5 w-full">
                <div className="flex-1">
                  <label>Amount Received</label>
                  <Input
                    type="number"
                    className="border-0"
                    {...register("payment_invoice_received")}
                  />
                  {errors.payment_invoice_received && (
                    <span className="text-red-500 text-sm">
                      <>{errors.payment_invoice_received?.message}</>
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <label>Withholding Tax</label>
                  <Input
                    type="number"
                    className="border-0"
                    {...register("payment_invoice_wh_tax")}
                  />
                  {errors.payment_invoice_wh_tax && (
                    <span className="text-red-500 text-sm">
                      <>{errors.payment_invoice_wh_tax?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2.5 w-full">
                <div className="flex-1">
                  <label>Difference</label>
                  <Input
                    type="number"
                    className="border-0"
                    disabled={true}
                    readOnly
                    value={round2(difference)}
                  />
                </div>
                <div className="flex-1 flex items-end gap-2">
                  <div className="flex-1">
                    <label>Bank Account</label>
                    <Controller
                      name="payment_bank_account"
                      control={control}
                      render={({ field }) => (
                        <AccountTitleSelect
                          onChangeValue={(value) => field.onChange(value)}
                          value={field.value}
                          error={errors && errors.payment_bank_account}
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1 flex items-end">
                    <div className="flex-1">
                      {difference <= 0 ? (
                        <div className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center">
                          <Check color="#fff" width={30} height={30} />
                        </div>
                      ) : (
                        <div className="bg-red-500 rounded-full h-10 w-10 flex items-center justify-center">
                          <X color="#fff" width={20} height={20} />
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Save color="#fff" />
                        &nbsp; Save Payment
                      </Button>
                    </DialogFooter>
                  </div>
                </div>
              </div>
              <div className="text-red-500">{error ? error : null}</div>
            </div>
          </form>

          <div className="flex">
            <table className="w-full m-3">
              <thead>
                <tr>
                  <TH>Invoice</TH>
                  <TH>Date</TH>
                  <TH>Type</TH>
                  <TH>Received</TH>
                  <TH>Tax</TH>
                  <TH>Bank</TH>
                  <TH></TH>
                </tr>
              </thead>
              <tbody>
                {exportedInvoice?.invoice?.receive?.length ? (
                  <PaymentRows
                    total={invoice.invoice_total}
                    payments={exportedInvoice.invoice.receive}
                    handleDelete={mutateDelete}
                  />
                ) : (
                  <tr>
                    <TD colSpan={7} className="text-center">
                      No records found.
                    </TD>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter className="p-3">
            <Button type="submit" disabled={isExporting} onClick={handleExport}>
              <Download color="#fff" />
              &nbsp; Export to Abacus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const TH = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium",
      className
    )}
  >
    {children}
  </td>
);
const TD = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  [x: string]: unknown;
}) => (
  <td
    {...props}
    className={cn(
      "py-3 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    {children}
  </td>
);

export default memo(ExportPaymentModal);

type ExportPaymentModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  invoice: any;
  onSubmit?: (updatedItem?: any) => void;
  onAdded?: () => void;
};
