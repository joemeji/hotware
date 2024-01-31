import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ItemMenu } from "@/components/items"
import { MoreHorizontal, Pencil, Trash, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const TH = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <td className={cn('py-3 px-2 text-sm border-stone-200 bg-stone-200 text-stone-700 font-medium', className)}>{children}</td>
);

export const TD = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <td className={cn('py-2 px-2 border-stone-100 group-last:border-0', className)}>{children}</td>
);

interface IActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionMenu = ({ onEdit, onDelete }: IActionMenuProps) => (
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
      <ItemMenu onClick={onEdit}>
        <Pencil
          className="mr-2 h-[18px] w-[18px] text-blue-500"
          strokeWidth="2"
        />
        <span className="text-stone-600 text-sm">Edit</span>
      </ItemMenu>
      <ItemMenu onClick={onDelete}>
        <Trash
          className="mr-2 h-[18px] w-[18px] text-red-500"
          strokeWidth="2"
        />
        <span className="text-stone-600 text-sm">Delete</span>
      </ItemMenu>
    </DropdownMenuContent>
  </DropdownMenu>
);