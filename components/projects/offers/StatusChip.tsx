import { memo } from "react";
import { status } from "@/lib/offer";
import { cn } from "@/lib/utils";

export const StatusChip = memo(({ status: statusName }: { status: any }) => {
  const _status = status[statusName];
  return (
    <div
      className={cn(
        "bg-[var(--bg-hover)] text-white w-fit px-3 py-[2px] rounded-full",
        "font-medium",
        "flex items-center"
      )}
      ref={(el) => {
        el?.style.setProperty("--bg-hover", `rgb(${_status?.color})`);
      }}
    >
      {_status?.name}
    </div>
  );
});

StatusChip.displayName = "StatusChip";
