import Link from "next/link";
import { LogOutIcon } from "lucide-react";

type ExportAbacusButtonParams = {
  // _credit_note_id: string;
  // credit_note_number: number;
  onExport: any;
};

export const ExportAbacusButton = ({ onExport }: ExportAbacusButtonParams) => {
  return (
    <>
      <div
        onClick={onExport}
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
      >
        <LogOutIcon className="w-[18px] h-[18px] text-cyan-500" />
        <span className="text-sm font-medium">Export to Abacus</span>
      </div>
      {/* {_credit_note_id != "0" ? (
        <Link
          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          href={`/projects/credit-note/${credit_note_number}/list`}
        >
          <FileText className="w-[18px] h-[18px] text-purple-500" />
          <span className="text-sm font-medium">Open Credit Note(s)</span>
        </Link>
      ) : null} */}
    </>
  );
};
