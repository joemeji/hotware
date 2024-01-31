import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import unitTypes from "@/utils/unitTypes"
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ArrowRight, Pencil } from "lucide-react";

dayjs.extend(customParseFormat);

export const actionMenu = [
  {
    name: 'View',
    icon: <ArrowRight className={cn("mr-2 h-[18px] w-[18px] text-green-400")} strokeWidth={2} />,
    actionType: 'view',
  },
  {
    name: 'Edit',
    icon: <Pencil className={cn("mr-2 h-[18px] w-[18px] text-blue-400")} strokeWidth={2} />,
    actionType: 'edit',
  },
];


export const UserListHeaderForm = () => {
  return (
    <div className="flex items-end justify-between mb-4 pe-4">
      <div className="flex">
        <div className="flex gap-1 flex-col px-4">
          <span className="text-sm text-stone-500">Filter By Company</span>
          <Select>
            <SelectTrigger className="w-[300px] bg-stone-100 border-0 rounded-xl">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              {unitTypes.map((unitType: string, key: number) => (
                <SelectItem value={unitType} key={key} className="cursor-pointer">
                  {unitType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-1 flex-col px-4">
          <span className="text-sm text-stone-500">Filter By Role</span>
          <Select>
            <SelectTrigger className="w-[300px] bg-stone-100 border-0 rounded-xl">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              {unitTypes.map((unitType: string, key: number) => (
                <SelectItem value={unitType} key={key} className="cursor-pointer">
                  {unitType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Input placeholder="Search" className="bg-stone-100 border-0 w-[400px]" />
    </div>
  );
};

export const TH = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <td className={cn('py-3 px-2 text-sm border-stone-200 bg-stone-200 text-stone-700 font-medium', className)}>{children}</td>
);

export const TD = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
  <td className={cn('py-2 px-2 border-stone-100 group-last:border-0', className)}>{children}</td>
);

export function lengthOfService(yearStarted: string) {
  if (yearStarted && dayjs(yearStarted, 'YYYY-MM-DD', true).isValid()) {
    const diffYear = dayjs().diff(yearStarted, 'year', true);

    if (diffYear < 1) {
      const diffMonth = dayjs().diff(yearStarted, 'month', true);
      if (diffMonth < 1) {
        const diffDay = dayjs().diff(yearStarted, 'day', true);
        return Math.floor(diffDay) + ' days';
      }
      const month = Math.floor(diffMonth);
      return month + (month > 1 ? ' months' : ' month');
    }
    const year = Math.floor(diffYear);
    return year + (year > 1 ? ' years' : ' year');
  }
  return '-';
}