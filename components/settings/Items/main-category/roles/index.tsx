import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pen, Trash } from "lucide-react";

export const ActionMenu = ({ onDelete, data }: IActionMenuProps) => (
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
      <ItemMenu onClick={() => onDelete(data.categoryId)}>
        <Trash
          className="mr-2 h-[18px] w-[18px] text-red-500"
          strokeWidth="2"
        />
        <span className="text-stone-600 text-sm">Delete</span>
      </ItemMenu>
    </DropdownMenuContent>
  </DropdownMenu>
);

interface IActionMenuProps {
  onDelete: (id: any) => void;
  data: any;
}
