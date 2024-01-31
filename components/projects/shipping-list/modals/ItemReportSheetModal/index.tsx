import { Sheet, SheetContent } from "@/components/ui/sheet";
import { memo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Content from "./Content";
import { Input } from "@/components/ui/input";
import _ from "lodash";

type ItemReportSheetModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
};

const ItemReportSheetModal = ({ open, onOpenChange }: ItemReportSheetModal) => {
  const [scrollHeaderHeight, setScrollHeaderHeight] = useState<any>(0);
  const [search, setSearch] = useState(null);

  const handleChangeSearch = _.debounce((e: any) => {
    setSearch(e.target.value);
  }, 500);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-[700px] bg-white p-0 border-0">
        <div
          className="py-3 px-4 items-center flex justify-between border-b border-b-stone-200/70"
          ref={(el) => setScrollHeaderHeight(el?.offsetHeight)}
        >
          <div className="flex items-center gap-2">
            <button
              className="w-fit p-1 rounded-full bg-stone-100 hover:bg-stone-200"
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              <ArrowLeft />
            </button>
            <span className="text-base font-medium">Reported Items</span>
          </div>

          <Input
            className="max-w-[200px] h-9 border-0 bg-stone-100"
            placeholder="Search"
            onChange={handleChangeSearch}
          />
        </div>

        <Content scrollHeaderHeight={scrollHeaderHeight} search={search} />
      </SheetContent>
    </Sheet>
  );
};

export default memo(ItemReportSheetModal);
