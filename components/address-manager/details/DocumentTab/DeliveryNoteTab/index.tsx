import { Input } from "@/components/ui/input";
import { memo } from "react";
import List from "./List";

const DeliveryNoteTab = () => {
  return (
    <>
      <div className="flex justify-between items-center py-2 px-3">
        <span className="text-base font-medium">Delivery Note</span>
        <Input
          className="bg-stone-100 border-none w-[300px] py-1.5 h-auto"
          placeholder="Search"
        />
      </div>
      <List />
    </>
  );
};

export default memo(DeliveryNoteTab);
