import Link from "next/link";
import { FileText } from "lucide-react";

type OfferButtonParams = {
  _offer_id: string;
  onCreate: any;
};

export const CreateOfferButton = ({
  _offer_id,
  onCreate,
}: OfferButtonParams) => {
  if (_offer_id != "0") {
    return (
      <Link
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
        href={`/projects/offers/${_offer_id}`}
      >
        <FileText className="w-[18px] h-[18px] text-purple-500" />
        <span className="text-sm font-medium">Open Offer</span>
      </Link>
    );
  }

  return (
    <div
      onClick={onCreate}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <FileText className="w-[18px] h-[18px] text-cyan-500" />
      <span className="text-sm font-medium">Create Offer</span>
    </div>
  );
};
