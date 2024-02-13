import Link from "next/link";
import { FileBox } from "lucide-react";

type CreateShippingListButtonParams = {
  _shipping_id: string;
  onCreate: any;
};

export const CreateShippingListButton = ({
  _shipping_id,
  onCreate,
}: CreateShippingListButtonParams) => {
  if (_shipping_id != "0") {
    return (
      <Link
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
        href={`/projects/shipping-list/${_shipping_id}`}
      >
        <FileBox className="w-[18px] h-[18px] text-indigo-500" />
        <span className="text-sm font-medium">Open Shipping list</span>
      </Link>
    );
  }

  return (
    <div
      onClick={onCreate}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <FileBox className="w-[18px] h-[18px] text-indigo-500" />
      <span className="text-sm font-medium">Create Shipping List</span>
    </div>
  );
};
