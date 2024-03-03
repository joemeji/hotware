import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemMenu } from "@/components/LoadingList";
import { ListIcon, MoreHorizontal, Pen, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsRoleLists from "./lists/SettingsRoleLists";

export const SettingsRole = () => {
  return (
    <div className=''>
      <div className='p-[20px] w-full max-w-[1600px] mx-auto xl:min-h-screen'>
        <div className='rounded-xl mt-4 shadow-sm flex flex-col min-h-[600px]'>
          <SettingsRoleLists />
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

interface ActionMenuProps {
  onDelete: (id: any) => void;
  onEdit: (id: any) => void;
  onAddModule: (id: any) => void;
  data: {};
}

export const ActionMenu = ({
  onDelete,
  onEdit,
  onAddModule,
  data,
}: ActionMenuProps) => (
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
      <ItemMenu onClick={() => onAddModule(data)}>
        <ListIcon 
          className='mr-2 h-[18px] w-[18px] text-cyan-500'
          strokeWidth='2'
        />
        <span className='text-stone-600 text-sm'>Add Module</span>
      </ItemMenu>
      <ItemMenu onClick={() => onEdit(data)}>
        <Pencil 
         className='mr-2 h-[18px] w-[18px] text-blue-500'
         strokeWidth='2'
         />
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

interface RoleModuleActionMenu {
  onDelete: (id: any) => void;
  data: {};
}

export const RoleModuleActionMenu = ({
  onDelete,
  data,
}: RoleModuleActionMenu) => (
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
    class: "uppercase text-left",
  },
  {
    name: "Description",
    class: "uppercase text-left",
  },
  {
    name: "Actions",
    class: "uppercase text-center",
  },
];

export const categoryHeadings = [
  {
    name: "Module",
    class: "uppercase text-left",
  },
  {
    name: "Description",
    class: "uppercase text-left",
  },

  {
    name: "Actions",
    class: "uppercase text-right",
  },
];
