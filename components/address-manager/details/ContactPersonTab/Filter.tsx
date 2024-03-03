import { Input } from "@/components/ui/input";
import { memo } from "react";
import DepartmentSelect from "../../department-select";
import PositionSelect from "../../position-select";
import SearchInput from "@/components/app/search-input";

const Filter = ({
  onSearch,
  onDepartment,
  onPosition,
}: {
  onSearch?: (evt: any) => void;
  onDepartment?: (evt: any) => void;
  onPosition?: (evt: any) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      Filter :
      <div className="w-[250px]">
        <DepartmentSelect
          placeholder="Department"
          onChangeValue={(value: any) => onDepartment && onDepartment(value)}
        />
      </div>
      <div className="w-[250px]">
        <PositionSelect
          placeholder="Position"
          onChangeValue={(value: any) => onPosition && onPosition(value)}
        />
      </div>
      <SearchInput
        onChange={(e) => onSearch && onSearch(e.target.value)}
        delay={500}
      />
    </div>
  );
};

export default memo(Filter);
