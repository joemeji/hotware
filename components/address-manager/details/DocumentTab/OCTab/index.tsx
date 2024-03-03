import { Input } from "@/components/ui/input";
import { memo, useState } from "react";
import List from "./List";
import SearchInput from "@/components/app/search-input";

const OCTab = () => {
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="flex justify-between items-center py-2 px-3">
        <span className="text-base font-medium">Order Confirmation</span>
        <SearchInput
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          delay={500}
        />
      </div>
      <List search={search} />
    </>
  );
};

export default memo(OCTab);
