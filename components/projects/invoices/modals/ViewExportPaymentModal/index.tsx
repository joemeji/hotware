import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { fetchApi } from "@/utils/api.config";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const round2 = (val: number) => {
  return Number((Math.round(val * 100) / 100).toFixed(2));
};

function ViewExportPaymentModal(props: ViewExportPaymentModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, _invoice_id } = props;
  const { data } = useSWR(
    [
      _invoice_id ? `/api/projects/invoices/${_invoice_id}/abacus` : undefined,
      session?.user?.access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const payments = data?.invoice?.receive || [];

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent className="max-w-[900px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>Invoice Export Details</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <table className="m-6">
            <thead>
              <tr>
                <TH>Received</TH>
                <TH>WH Tax</TH>
                <TH>Type</TH>
                <TH>Date</TH>
                <TH>Description</TH>
                <TH>Paid By</TH>
              </tr>
            </thead>
            <tbody>
              {payments?.length ? (
                payments.map((payment: any) => (
                  <tr key={payment.invoice_payment_id}>
                    <TD>{round2(payment.invoice_payment_received)}</TD>
                    <TD>{round2(payment.invoice_payment_wh_tax)}</TD>
                    <TD>{payment.invoice_payment_type}</TD>
                    <TD>{payment.invoice_payment_date}</TD>
                    <TD>{payment.invoice_payment_description}</TD>
                    <TD>{payment.payment_creator}</TD>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    {children}
  </td>
);

export default memo(ViewExportPaymentModal);

type ViewExportPaymentModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  _invoice_id: any;
};
