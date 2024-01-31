import { memo } from "react";
import { status } from "@/lib/loadinglist";
import { cn } from "@/lib/utils";

const StatusChip = ({ status: statusName }: { status: any }) => {
  const _status = status[statusName];

  console.log({ status: status })
  return (
    <div
      className={cn(
        "bg-[var(--bg-hover)] text-white w-fit px-3 py-[2px] rounded-full",
        "font-medium",
        "flex items-center"
      )}
      ref={el => {
        el?.style.setProperty('--bg-hover', `rgb(${_status?.color})`);
      }}
    >
      {_status?.name}
    </div>
  );
};

export default memo(StatusChip);