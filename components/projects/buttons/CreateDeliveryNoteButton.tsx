import Link from "next/link";
import { FileBox } from "lucide-react";

type CreateDeliveryNoteButtonParams = {
  _delivery_note_id: string;
  onCreate: any;
};

export const CreateDeliveryNoteButton = ({
  _delivery_note_id,
  onCreate,
}: CreateDeliveryNoteButtonParams) => {
  if (_delivery_note_id != "0") {
    return (
      <Link
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
        href={`/projects/delivery-note/${_delivery_note_id}`}
      >
        <FileBox className="w-[18px] h-[18px] text-indigo-500" />
        <span className="text-sm font-medium">Open Delivery Note</span>
      </Link>
    );
  }

  return (
    <div
      onClick={onCreate}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <FileBox className="w-[18px] h-[18px] text-indigo-500" />
      <span className="text-sm font-medium">Create Delivery Note</span>
    </div>
  );
};
