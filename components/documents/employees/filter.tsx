import CompanySelect from "@/components/app/company-select";
import DocumentCategorySelect from "@/components/app/document-category-select";
import UserRoleSelect from "@/components/app/user-role-select";
import UserServiceSelect from "@/components/app/user-service-select";
import { forwardRef, memo } from "react";

const Filter = forwardRef((props: filterProps, ref: any) => {
  const { selectedCategory, selectedCompany, selectedRole } = props;
  return (
    <div className="bg-white rounded-app p-3" ref={ref}>
      <p className="text-base mb-3 font-medium">Filter</p>
      <div className="flex gap-4 flex-col">
        <CompanySelect
          placeholder="Company"
          value={selectedCompany}
          onChangeValue={(value: any) =>
            selectedCompany && selectedCompany(value)
          }
        />
        <UserRoleSelect
          placeholder="Roles"
          value={selectedRole}
          onChangeValue={(value: any) => selectedRole && selectedRole(value)}
        />
        <UserServiceSelect
          placeholder="Category"
          value={selectedCategory}
          onChangeValue={(value: any) =>
            selectedCategory && selectedCategory(value)
          }
        />
      </div>
    </div>
  );
});

Filter.displayName = "Filter";

export default memo(Filter);

type filterProps = {
  selectedCompany?: (value: any) => void;
  selectedCategory?: (value: any) => void;
  selectedRole?: (value: any) => void;
};
