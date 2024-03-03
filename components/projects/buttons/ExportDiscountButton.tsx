import { LogOutIcon, Search } from "lucide-react";

type ExportDiscountButtonParams = {
  invoice: any;
  onExport: any;
  onView: any;
};

export const ExportDiscountButton = ({
  invoice,
  onExport,
  onView,
}: ExportDiscountButtonParams) => {
  if (invoice?.invoice_payment_export_status != 1) return null;

  if (
    invoice?.invoice_discount_is_exported == 1 &&
    invoice?.invoice_discount_is_exported_by != null
  ) {
    return (
      <div
        onClick={onView}
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
      >
        <Search className="w-[18px] h-[18px] text-cyan-500" />
        <span className="text-sm font-medium">Invoice Discount Details</span>
      </div>
    );
  }

  return (
    <div
      onClick={onExport}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <LogOutIcon className="w-[18px] h-[18px] text-cyan-500" />
      <span className="text-sm font-medium">Export Loss/Discount</span>
    </div>
  );
};
