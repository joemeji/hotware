import { BadgeDollarSign } from "lucide-react";

type CreateMarkAsPaidButtonParams = {
  isPaid: any;
  onPaid: any;
  onUnpaid: any;
};

export const CreateMarkAsPaidButton = ({
  isPaid,
  onPaid,
  onUnpaid,
}: CreateMarkAsPaidButtonParams) => {
  if (isPaid === "paid") {
    return (
      <div
        onClick={onUnpaid}
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
      >
        <BadgeDollarSign className="w-[18px] h-[18px] text-rose-500" />
        <span className="text-sm font-medium">Mark as Unpaid</span>
      </div>
    );
  }

  return (
    <div
      onClick={onPaid}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <BadgeDollarSign className="w-[18px] h-[18px] text-rose-500" />
      <span className="text-sm font-medium">Mark as Paid</span>
    </div>
  );
};
