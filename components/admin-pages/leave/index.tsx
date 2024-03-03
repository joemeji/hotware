import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import LeaveLists from "./lists/LeaveLists";

export const Leave = () => {
  return (
    <div className="">
      <div className="p-[20px] w-full max-w-[1600px] mx-auto xl:min-h-screen">
        <div className="rounded-xl mt-4 shadow-sm flex flex-col min-h-[600px]">
          <LeaveLists />
        </div>
      </div>
    </div>
  );
};

export const TH = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium",
      className
    )}
  >
    {children}
  </td>
);
export const TD = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  [x: string]: unknown;
}) => (
  <td
    {...props}
    className={cn(
      "py-3 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    {children}
  </td>
);
