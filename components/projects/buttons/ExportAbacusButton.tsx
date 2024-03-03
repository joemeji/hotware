import { LogOutIcon, Search } from "lucide-react";

type ExportAbacusButtonParams = {
  exported_by: number;
  onExport: any;
  onView: any;
};

export const ExportAbacusButton = ({
  onExport,
  onView,
  exported_by,
}: ExportAbacusButtonParams) => {
  if (exported_by) {
    return (
      <div
        onClick={onView}
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
      >
        <Search className="w-[18px] h-[18px] text-cyan-500" />
        <span className="text-sm font-medium">Invoice Export Details</span>
      </div>
    );
  }

  return (
    <div
      onClick={onExport}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <LogOutIcon className="w-[18px] h-[18px] text-cyan-500" />
      <span className="text-sm font-medium">Export to Abacus</span>
    </div>
  );
};
