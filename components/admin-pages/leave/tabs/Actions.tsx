import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Check, X } from "lucide-react";

interface ActionMenuProps {
  onDelete: (id: any) => void;
  onEdit: (id: any) => void;
  onApprove: (id: any) => void;
  onReject: (id: any) => void;
  data: any;
  canApprove: boolean;
}

const isOpen = ({ excuse_status }: { excuse_status: string }) => {
  return excuse_status === "pending";
};

export const ActionMenu = ({
  onDelete,
  onEdit,
  onApprove,
  onReject,
  data,
  canApprove,
}: ActionMenuProps) => (
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
      {data && isOpen(data) && canApprove ? (
        <>
          <ItemMenu onClick={() => onApprove(data.excuse_id)}>
            <Check
              className="mr-2 h-[18px] w-[18px] text-green-500"
              strokeWidth="2"
            />
            <span className="text-stone-600 text-sm">Approve</span>
          </ItemMenu>
          <ItemMenu onClick={() => onReject(data.excuse_id)}>
            <X
              className="mr-2 h-[18px] w-[18px] text-violet-500"
              strokeWidth="2"
            />
            <span className="text-stone-600 text-sm">Reject</span>
          </ItemMenu>
        </>
      ) : null}
      <ItemMenu onClick={() => onEdit(data.excuse_id)}>
        <Pencil
          className="mr-2 h-[18px] w-[18px] text-orange-500"
          strokeWidth="2"
        />
        <span className="text-stone-600 text-sm">Edit</span>
      </ItemMenu>
      {data && isOpen(data) ? (
        <ItemMenu onClick={() => onDelete(data)}>
          <Trash
            className="mr-2 h-[18px] w-[18px] text-red-500"
            strokeWidth="2"
          />
          <span className="text-stone-600 text-sm">Delete</span>
        </ItemMenu>
      ) : null}
    </DropdownMenuContent>
  </DropdownMenu>
);
