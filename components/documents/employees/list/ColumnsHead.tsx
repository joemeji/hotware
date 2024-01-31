import { TH } from "@/components/items";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectedEmployeeContext } from "@/pages/documents/employees";
import { memo, useContext } from "react";

const ColumnsHead = () => {
  const selectedEmployee: any = useContext(SelectedEmployeeContext);

  return (
    <tr>
      <TH className="w-[50px]  bg-stone-300">
        {/* <div className="flex justify-center items-center">
          <Checkbox className="mb-0 rounded-none w-[16px] h-[16px]" />
        </div> */}
      </TH>
      {!selectedEmployee && <TH className="w-[50px] bg-stone-300">Employee</TH>}
      <TH className="w-[250px] bg-stone-300">Name</TH>
      <TH className="w-[150px] bg-stone-300">Category</TH>
      <TH className="w-[150px] bg-stone-300">Lang</TH>
      <TH className="w-[100px] bg-stone-300">ExpiredAt</TH>
      <TH className="w-[50px] bg-stone-300">Modified</TH>
      <TH className="w-[100px] bg-stone-300">ModifiedAt</TH>
      <TH className="w-[100px] bg-stone-300">Status</TH>
      <TH className=" bg-stone-300"></TH>
    </tr>
  );
};

export default memo(ColumnsHead);
