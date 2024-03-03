import { cn } from "@/lib/utils";
import { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import {
  Copy,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash,
  View,
} from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import React from "react";

export const tableListMenu = [
  {
    name: "Add Item",
    icon: <Plus className={cn("mr-2 h-[18px] w-[18px]")} />,
    actionType: "add-item",
  },
  {
    name: "Delete",
    icon: <Trash className={cn("mr-2 h-[18px] w-[18px]")} />,
    actionType: "delete",
  },
];

export const loadingHeaderMenu = [
  {
    name: "Add Item from Template",
    icon: <Plus className={cn("mr-2 h-[18px] w-[18px]")} />,
    actionType: "add-from-template",
  },
  {
    name: "New Copy",
    icon: <Copy className={cn("mr-2 h-[18px] w-[18px]")} />,
    actionType: "new-copy",
  },
  {
    name: "Preview",
    icon: <View className={cn("mr-2 h-[18px] w-[18px]")} />,
    actionType: "preview",
  },
  // {
  //   name: 'Save as PDF',
  //   icon: <FileText className={cn("mr-2 h-[18px] w-[18px]")}/>,
  //   actionType: 'save-as-pdf'
  // }
];

export const loadingListMenu = [
  {
    name: "Edit",
    icon: <Pencil className={cn("mr-2 h-[18px] w-[18px] text-blue-600")} />,
    actionType: "edit",
  },
  {
    name: "Delete",
    icon: <Trash className={cn("mr-2 h-[18px] w-[18px] text-red-600")} />,
    actionType: "delete",
  },
];

export const ItemMenu = (props: DropdownMenuItemProps) => {
  const { children, onClick, className, ...rest } = props;
  return (
    <DropdownMenuItem
      className={cn(
        "flex items-center p-2 px-3 cursor-pointer gap-1",
        "hover:bg-stone-100 outline-none",
        className
      )}
      onClick={onClick}
      style={{ border: "none" }}
      {...rest}
    >
      {children}
    </DropdownMenuItem>
  );
};
