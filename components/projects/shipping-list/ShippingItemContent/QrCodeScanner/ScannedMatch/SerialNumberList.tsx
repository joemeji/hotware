import { Button } from "@/components/ui/button";

type SerialNumberList = {
  serial_number?: any
}

export function SerialNumberList({ serial_number }: SerialNumberList) {
  return (
    <div className="flex justify-center w-full items-center bg-stone-100 p-2 ps-3 rounded-sm">
      <span className="font-medium text-xl">{serial_number}</span>
    </div>
  );
}