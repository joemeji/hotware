import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemMenu } from "@/components/LoadingList";
import { ListIcon, MoreHorizontal, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsRequirementLevelLists from "./lists/SettingsRequirementLevelLists";

export const SettingsRequirementLevel = () => {
  return (
    <div className=''>
      <div className='p-[20px] w-full max-w-[1600px] mx-auto xl:min-h-screen'>
        <div className='rounded-xl mt-4 shadow-sm flex flex-col min-h-[600px]'>
          <SettingsRequirementLevelLists />
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
      "py-3 px-2 text-sm border-stone-200 bg-stone-200 text-stone-700 font-medium",
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
    className={cn("py-2 px-2 border-stone-100 group-last:border-0", className)}
  >
    {children}
  </td>
);

interface IActionMenuProps {
  onDelete: (id: any) => void;
  onEdit: (id: any) => void;
  onAddDocumentCategory: (id: any) => void;
  data: {};
}

export const ActionMenu = ({
  onDelete,
  onEdit,
  onAddDocumentCategory,
  data,
}: IActionMenuProps) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant='outline'
        className='p-2 text-stone-400 border-0 bg-transparent h-auto rounded-full'
      >
        <MoreHorizontal className='w-5 h-5' />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' className='border border-stone-50'>
      <ItemMenu onClick={() => onAddDocumentCategory(data)}>
        <ListIcon />
        <span className='text-stone-600 text-sm'>Add Document</span>
      </ItemMenu>
      <ItemMenu onClick={() => onEdit(data)}>
        <Pen />
        <span className='text-stone-600 text-sm'>Edit</span>
      </ItemMenu>
      <ItemMenu onClick={() => onDelete(data)}>
        <Trash
          className='mr-2 h-[18px] w-[18px] text-red-500'
          strokeWidth='2'
        />
        <span className='text-stone-600 text-sm'>Delete</span>
      </ItemMenu>
    </DropdownMenuContent>
  </DropdownMenu>
);

interface IDocumentCategoryActionMenu {
  onDelete: (id: any) => void;
  data: {};
}

export const DocumentCategoryActionMenu = ({
  onDelete,
  data,
}: IDocumentCategoryActionMenu) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant='outline'
        className='p-2 text-stone-400 border-0 bg-transparent h-auto rounded-full'
      >
        <MoreHorizontal className='w-5 h-5' />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' className='border border-stone-50'>
      <ItemMenu onClick={() => onDelete(data)}>
        <Trash
          className='mr-2 h-[18px] w-[18px] text-red-500'
          strokeWidth='2'
        />
        <span className='text-stone-600 text-sm'>Delete</span>
      </ItemMenu>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const tableHeadings = [
  {
    name: "#",
    class: "text-center",
  },
  {
    name: "Name",
    class: "uppercase text-center",
  },
  {
    name: "Actions",
    class: "uppercase text-center",
  },
];

export const categoryHeadings = [
  {
    name: "Document Type",
    class: "uppercase text-center",
  },
  {
    name: "Document Category",
    class: "uppercase text-center",
  },

  {
    name: "Actions",
    class: "uppercase text-center",
  },
];
