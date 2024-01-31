import CompanySelect from "@/components/app/company-select";
import DocumentCategorySelect from "@/components/app/document-category-select";
import { forwardRef, memo } from "react";

const Filter = forwardRef((props: any, ref: any) => {
  return (
    <div className="bg-white rounded-app p-3" ref={ref}>
      <p className="text-base mb-3 font-medium">Filter</p>
      <div className="flex gap-4 flex-col">
        <CompanySelect placeholder="Company" />
        <DocumentCategorySelect placeholder="Category" />
      </div>
    </div>
  );
});

Filter.displayName = "Filter";

export default memo(Filter);
