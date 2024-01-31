import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { memo, useState } from "react";

const FilterForm = ({ onClose, onSearch: _onSearch }: { onClose?: (open?: boolean) => void, onSearch?: (filter?: any) => void }) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState("");

  const onSearch = () => {
    const payload: any = {};
    if (fromDate) payload["from"] = format(fromDate, "yyyy-MM-dd");
    if (toDate) payload["to"] = format(toDate, "yyyy-MM-dd");
    if (search) payload["search"] = search;
    _onSearch && _onSearch(payload);
    onClose && onClose(false);
  };

  return (
    <div className="absolute top-0 bg-white py-5 px-4 w-full z-20 drop-shadow-md flex flex-col gap-3">
      <span className="text-base font-medium">Filter</span>
      <Input
        className="border-0 bg-stone-100"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        <label className="font-medium">Date</label>
        <div className="flex gap-2">
          <DatePicker
            triggerWrapperClassName="w-full"
            triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
            date={fromDate}
            onChangeDate={(date) => setFromDate(date)}
            format="yyyy-MM-dd"
            placeholder={"From"}
          />

          <DatePicker
            triggerWrapperClassName="w-full"
            triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
            date={toDate}
            onChangeDate={(date) => setToDate(date)}
            format="yyyy-MM-dd"
            placeholder={"To"}
          />
        </div>
      </div>
      <div className="flex justify-end bg-red-30 mt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onClose && onClose(false)}
        >
          Close
        </Button>
        <Button onClick={onSearch}>Search</Button>
      </div>
    </div>
  );
};

export default memo(FilterForm);
