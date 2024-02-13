import Link from "next/link";
import { FileText } from "lucide-react";

type OfferButtonParams = {
  _credit_note_id: string;
  credit_note_number: number;
  onCreate: any;
};

export const CreateCreditNoteButton = ({
  _credit_note_id,
  credit_note_number,
  onCreate,
}: OfferButtonParams) => {
  return (
    <>
      <div
        onClick={onCreate}
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
      >
        <FileText className="w-[18px] h-[18px] text-cyan-500" />
        <span className="text-sm font-medium">Create Credit Note</span>
      </div>
      {_credit_note_id != "0" ? (
        <Link
          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          href={`/projects/credit-note/${credit_note_number}/list`}
        >
          <FileText className="w-[18px] h-[18px] text-purple-500" />
          <span className="text-sm font-medium">Open Credit Note(s)</span>
        </Link>
      ) : null}
    </>
  );
};
