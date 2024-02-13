import Link from "next/link";
import { FilePieChart } from "lucide-react";

type CreateInvoiceButtonParams = {
  _invoice_id: string;
  invoice_number: number;
  onCreate: any;
};

export const CreateInvoiceButton = ({
  _invoice_id,
  invoice_number,
  onCreate,
}: CreateInvoiceButtonParams) => {
  return (
    <>
      <div
        onClick={onCreate}
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
      >
        <FilePieChart className="w-[18px] h-[18px] text-rose-500" />
        <span className="text-sm font-medium">Create Invoice</span>
      </div>
      {_invoice_id != "0" ? (
        <Link
          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          href={`/projects/invoices/${invoice_number}/list`}
        >
          <FilePieChart className="w-[18px] h-[18px] text-rose-500" />
          <span className="text-sm font-medium">Open Invoice(s)</span>
        </Link>
      ) : null}
    </>
  );
};
