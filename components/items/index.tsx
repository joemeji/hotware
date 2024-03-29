import { cn } from "@/lib/utils";
import {
  DropdownMenuItem,
  DropdownMenuItemProps,
} from "@radix-ui/react-dropdown-menu";
import { BookmarkIcon, Pencil, Printer, QrCode, Trash, X } from "lucide-react";
import React from "react";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { Checkbox } from "../ui/checkbox";

export const certificationActionButton = [
  {
    name: "Certification",
    icon: (
      <BookmarkIcon className={cn("mr-2 h-[18px] w-[18px] text-green-600")} />
    ),
    actionType: "item-certification",
  },
];

export const actionMenu = [
  {
    name: "Type Plate",
    icon: <QrCode className={cn("mr-2 h-[18px] w-[18px] text-red-600")} />,
    actionType: "type-plate",
  },
  {
    name: "QR Code",
    icon: <QrCode className={cn("mr-2 h-[18px] w-[18px] text-blue-600")} />,
    actionType: "qr-code",
  },
];

export const serialNumberAction = [
  {
    name: "View P/O",
    icon: <Printer className={cn("mr-2 h-[18px] w-[18px] text-purple-600")} />,
    actionType: "po",
  },
  // {
  //   name: 'Delete',
  //   icon: <Trash2 className={cn("mr-2 h-[18px] w-[18px] text-red-400")} strokeWidth={2} />,
  //   actionType: 'delete',
  // },
];

export const TH = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 text-sm bg-stone-300/90 text-stone-600",
      className
    )}
  >
    {children}
  </td>
);
export const TD = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-2 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    {children}
  </td>
);

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
      {...rest}
    >
      {children}
    </DropdownMenuItem>
  );
};

export const SelectAll = React.forwardRef((props: CheckboxProps, ref: any) => {
  return (
    <label
      className={cn(
        "p-2 py-1.5 h-auto bg-transparent font-medium hover:bg-stone-100 rounded-xl",
        "flex items-center cursor-pointer",
        props.checked && "bg-stone-100"
      )}
      htmlFor={props.id || "selectAll"}
    >
      <Checkbox
        className={cn(
          "me-2 bg-transparent w-[19px] h-[19px] border-2 rounded-full",
          props.className
        )}
        {...props}
        id={props.id || "selectAll"}
        ref={ref}
      />{" "}
      Select All
    </label>
  );
});
SelectAll.displayName = "SelectAll";
