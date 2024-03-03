import { LogOutIcon, Search } from "lucide-react";

type ExportPaymentButtonParams = {
  invoice: any;
  onExport: any;
  onView: any;
};

export const ExportPaymentButton = ({
  invoice,
  onExport,
  onView,
}: ExportPaymentButtonParams) => {
  if (invoice?.invoice_status != "paid") return null;

  if (
    invoice?.invoice_payment_export_status == 1 &&
    invoice?.invoice_is_exported_by != null
  ) {
    return (
      <div
        onClick={onView}
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
      >
        <Search className="w-[18px] h-[18px] text-cyan-500" />
        <span className="text-sm font-medium">Invoice Payment Details</span>
      </div>
    );
  }

  return (
    <div
      onClick={onExport}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <LogOutIcon className="w-[18px] h-[18px] text-cyan-500" />
      <span className="text-sm font-medium">Export Payment</span>
    </div>
  );
};
