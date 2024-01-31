import { Input } from "@/components/ui/input";
import { memo } from "react";
import DepartmentSelect from "../../department-select";
import PositionSelect from "../../position-select";

const Filter = () => {
  return (
    <div className="flex items-start gap-2">
      Filter :
      <div className="w-[250px]">
        <DepartmentSelect placeholder="Department" />
      </div>
      <div className="w-[250px]">
        <PositionSelect placeholder="Position" />
      </div>
      <Input
        className="bg-stone-100 border-none w-[250px]"
        placeholder="Search"
      />
    </div>
  );
};

export default memo(Filter);
