import { cn } from "@/lib/utils"
import { snStatuses } from "@/utils/snStatuses"

type IconPropsType = {
  width?: number
  height?: number
  className?: string
  color?: string
  style?: object
}

type ShippingStatus = {
  style?: object
  statusName?: string
  className?: string
  iconProps?: IconPropsType
  statusClassName?: string
}

export function statusIndex(statusName: string | any) {
  const statusIndex = snStatuses.findIndex((item: any) => item.name === statusName);
  const undefinedIndex = snStatuses.findIndex((item: any) => item.name === 'undefined');
  const index = (statusIndex > -1) ? statusIndex : undefinedIndex;
  return index;
}

export default function Status({ statusName, className, iconProps, statusClassName, style }: ShippingStatus) {
  const index = statusIndex(statusName);
  
  return (
    <div style={{ ...style, background: `rgba(${snStatuses[index].color}, 0.1)` }} className={className}>
      {snStatuses[index].icon(iconProps)}
      <div 
        className={statusClassName}
        style={{ 
          color: `rgba(${snStatuses[index].color})`
        }}
      >
        {snStatuses[index].text}
      </div>
    </div>
  );
}