import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Company } from "./schema";

interface ListViewProps {
  isLoading: boolean;
  data: Company[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ListView = ({
  isLoading,
  data,
  onEdit,
  onDelete,
}: ListViewProps) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr>
          <Th className="w-1/5">Name</Th>
          <Th className="w-1/5">Address</Th>
          <Th>Contact Number</Th>
          <Th>Email Address</Th>
          <Th>Contact Person</Th>
          <Th className="text-right w-1/10">Actions</Th>
        </tr>
      </thead>
      <tbody>
        {isLoading &&
          Array.from({ length: 7 })
            .fill(0)
            .map((_, key: number) => (
              <tr key={key}>
                <Td className="align-top">
                  <Skeleton className="w-4/5 h-[15px]" />
                </Td>
                <Td className="align-top">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-full h-[15px]" />
                    <Skeleton className="w-3/5 h-[15px]" />
                  </div>
                </Td>
                <Td className="align-top">
                  <Skeleton className="w-full h-[15px]" />
                </Td>
                <Td className="align-top">
                  <Skeleton className="w-full h-[15px]" />
                </Td>
                <Td className="align-top">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-full h-[15px]" />
                    <Skeleton className="w-2/5 h-[15px]" />
                  </div>
                </Td>
                <Td className="flex justify-end">
                  <Skeleton className="w-2/5 h-[15px]" />
                </Td>
              </tr>
            ))}
        {data &&
          data.map((company: Company, key: number) => (
            <tr key={key} className="even:bg-stone-50 hover:bg-stone-100">
              <Td>{company.company_name}</Td>
              <Td>{company.company_address}</Td>
              <Td>{company.company_contact_number}</Td>
              <Td>{company.company_email}</Td>
              <Td>{company.company_contact_person}</Td>
              <Td className="text-right">
                <ActionMenu
                  onEdit={() => {
                    onEdit(company.company_id);
                  }}
                  onDelete={() => {
                    onDelete(company.company_id);
                  }}
                />
              </Td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

interface ThProps {
  className?: string;
  children?: React.ReactNode;
}

const Th = ({ className, children }: ThProps) => (
  <th
    className={cn(
      "p-2 border-stone-200 bg-stone-200 text-stone-700 text-left",
      className
    )}
  >
    {children}
  </th>
);

interface TdProps {
  className?: string;
  children?: React.ReactNode;
}

const Td = ({ className, children }: TdProps) => (
  <td
    className={cn(
      "p-2 border-stone-100 group-last:border-0 align-top",
      className
    )}
  >
    {children}
  </td>
);

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionMenu = ({ onEdit, onDelete }: ActionMenuProps) => (
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
