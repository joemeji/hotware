import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { memo, useState } from "react";
import { ArrowLeft, ListFilter } from "lucide-react";
import ActivityLogs from "./ActivityLogs";
import FilterForm from "./FilterForm";

type ActivityLogSheetModal = {
  _delivery_note_id: string | undefined;
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
};

const ActivityLogSheetModal = ({
  _delivery_note_id,
  open,
  onOpenChange,
}: ActivityLogSheetModal) => {
  const [scrollHeaderHeight, setScrollHeaderHeight] = useState<any>(0);
  const [openFilterForm, setOpenFilterForm] = useState(false);
  const [filter, setFilter] = useState(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-[550px] bg-stone-50 p-0 border-0">
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
            <span className="text-base font-medium">Activity Log</span>
          </div>

          <Button
            variant={"ghost"}
            className="hover:bg-stone-200 flex gap-2 px-2"
            onClick={() => setOpenFilterForm(true)}
          >
            <ListFilter className="w-[18px] h-[18px]" /> Filter
          </Button>
        </div>

        {openFilterForm && (
          <FilterForm
            onSearch={(filter) => setFilter(filter)}
            onClose={(open: any) => setOpenFilterForm(open)}
          />
        )}

        <ActivityLogs
          _delivery_note_id={_delivery_note_id}
          filter={filter}
          scrollHeaderHeight={scrollHeaderHeight}
        />
      </SheetContent>
    </Sheet>
  );
};

export default memo(ActivityLogSheetModal);
