import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

interface ActionMenuProps {
  onDelete: (id: any) => void;
  onEdit: (id: any) => void;
  data: {};
}

export const ActionMenu = ({ onDelete, onEdit, data }: ActionMenuProps) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        className="p-2 text-stone-400 border-0 bg-transparent h-auto rounded-full"
      >
        <MoreHorizontal className="w-5 h-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="border border-stone-50">
      <ItemMenu onClick={() => onEdit(data)}>
        <Pencil
          className="mr-2 h-[18px] w-[18px] text-blue-500"
          strokeWidth="2"
        />
        <span className="text-stone-600 text-sm">Edit</span>
      </ItemMenu>
      <ItemMenu onClick={() => onDelete(data)}>
        <Trash
          className="mr-2 h-[18px] w-[18px] text-red-500"
          strokeWidth="2"
        />
        <span className="text-stone-600 text-sm">Delete</span>
      </ItemMenu>
    </DropdownMenuContent>
  </DropdownMenu>
);
