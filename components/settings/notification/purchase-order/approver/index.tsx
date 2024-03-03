import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemMenu } from "@/components/LoadingList";
import { MoreHorizontal, Trash, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsPurchaseOrderApproverList from "./lists/SettingsPurchaseOrderApproverList";
import SettingsPurchaseOrderNotifierList from "../notifier/lists/SettingsPurchaseOrderNotifierList";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const SettingsPurchaseOrderApprover = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const listUrl = `/api/company-settings/info?companySettingName=PURCHASE_ORDER_ENABLE_APPROVAL`;
  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const togglePurchaseOrderApprover = async (data: any) => {
    setIsEnabled(data);
    
    try {
      const payload = {
        company_setting_value: data,
      };

      const res = await fetch("/api/company-settings/enable-purchase-order-approver", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      mutate(json);

      if (json && json.success) {
        toast({
          title: "Successfully saved!",
          variant: "success",
          duration: 4000,
        });
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  useEffect(() => {
    if (data?.company_setting_value == 1){
      setIsEnabled(true);
    }
  }, [data, isLoading]);

  return (
    <div className=''>
      <div className='p-[20px] w-full max-w-[1600px] mx-auto xl:min-h-screen'>
        <div className='rounded-xl mt-4 shadow-sm flex flex-col min-h-[600px] gap-10 pb-10'>
          <div className='flex gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
            <label className='font-medium flex items-center' >
              <Switch
                checked={isEnabled}
                onCheckedChange={togglePurchaseOrderApprover}
              />
              &nbsp; Enable Purchase Order Approval
            </label>
          </div>
          {isEnabled && (
            <>
              <SettingsPurchaseOrderApproverList />
              <SettingsPurchaseOrderNotifierList />
            </>
          )}
            
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
  onSet: (id: any) => void;
  data: {};
}

export const ActionMenu = ({
  onDelete,
  onSet,
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
      <ItemMenu onClick={() => onSet(data)}>
        <UserCog 
          className='mr-2 h-[18px] w-[18px] text-green-500'
          strokeWidth='2'/>
        <span className='text-stone-600 text-sm'>Set default</span>
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
    name: "Email Address",
    class: "uppercase text-center",
  },
  {
    name: "Status",
    class: "uppercase text-center",
  },
  {
    name: "Actions",
    class: "uppercase text-center",
  },
];
