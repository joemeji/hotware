import { TH } from "@/components/items";

export const TableHead = () => {
  return (
    <>
      <thead>
        <tr>
          <TH className="ps-4 font-medium w-[70px]">Image</TH>
          <TH className="ps-4 font-medium w-[60px] text-center">No.</TH>
          <TH className="font-medium w-[500px]">Name</TH>
          <TH className="font-medium">Contact</TH>
          <TH className="pe-4 font-medium">Website</TH>
          <TH className="pe-4 font-medium">Category</TH>
          <TH className="pe-4 font-medium text-right">Actions</TH>
        </tr>
      </thead>
    </>
  );
};
