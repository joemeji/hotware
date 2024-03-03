import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export default function MoreOption({
  children,
  contentClassName,
  menuTriggerChildren,
  triggerButtonClassName,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  triggerButtonClassName?: string;
  contentClassName?: string;
  menuTriggerChildren?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange} open={open}>
      <DropdownMenuTrigger asChild>
        {menuTriggerChildren || (
          <Button
            variant="outline"
            className={cn(
              "p-1 border-0 bg-transparent h-auto",
              open && "bg-stone-100",
              triggerButtonClassName
            )}
          >
            <MoreHorizontal className="w-5 h-5" strokeWidth={1} />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn("border border-stone-100 px-0 py-2", contentClassName)}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
