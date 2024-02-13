import Link from "next/link";
import { FileText } from "lucide-react";

type OrderConfirmationButtonParams = {
  _order_confirmation_id: string;
  onCreate: any;
};

export const CreateOrderConfirmationButton = ({
  _order_confirmation_id,
  onCreate,
}: OrderConfirmationButtonParams) => {
  if (_order_confirmation_id != "0") {
    return (
      <Link
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
        href={`/projects/order-confirmation/${_order_confirmation_id}`}
      >
        <FileText className="w-[18px] h-[18px] text-cyan-500" />
        <span className="text-sm font-medium">Open Order Confirmation</span>
      </Link>
    );
  }

  return (
    <div
      onClick={onCreate}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <FileText className="w-[18px] h-[18px] text-cyan-500" />
      <span className="text-sm font-medium">Create Order Confirmation</span>
    </div>
  );
};
