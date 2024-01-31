import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { memo } from "react";

const ListSearchBar = () => {
  return (
    <div className="bg-stone-100 flex items-center w-full rounded-xl overflow-hidden px-2 h-10">
      <Search className="text-gray-400 w-5 h-5" />
      <input placeholder="Search" 
        className={cn(
          "border-0 rounded-none outline-none text-sm w-full px-2 bg-transparent h-full",
        )} 
        name="search"
      />
    </div>
  );
};

export default memo(ListSearchBar);