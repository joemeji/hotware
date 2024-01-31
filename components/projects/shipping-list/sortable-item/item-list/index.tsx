import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { memo, useState } from "react";
import ShippingItemSerialNumber from "../../ShippingItemSerialNumber";
import CompletedMark from "./completed-mark";
import Description from "./description";
import HSCode from "./hscode";
import Weight from "./weight";
import Quantity from "./quantity";
import UnitValue from "./unit-value";
import ActionButtons from "./action-buttons";

const _ItemList = React.forwardRef((props: ItemListProps, ref: any) => {
  const { 
    item, 
    descriptionWidth, 
    onClickAddSN, 
    onClickReturnSN,
    ...rest
  } = props;
  const [_open, setOpen] = useState(item.open);

  return (
    <>
      <div ref={ref}
        className={cn(
          "overflow-hidden flex flex-col bg-white rounded-sm",
        )}
        {...rest}
      >
        <div 
          className={cn(
            "flex relative p-1",
            item.open && 'border-b border-stone-100'
          )}>
          <div className="flex items-center">
            <Description descriptionWidth={descriptionWidth || 365} item={item} />
            <HSCode item={item} />
            <Weight item={item} />
            <Quantity item={item} />
            <UnitValue item={item} />
          </div>
          <CompletedMark item={item} />
          {/* <ShippedMark /> */}
          <div className="absolute right-0 h-full top-0 flex items-start pe-2 py-3">
            {item && Number(item.with_serial) === 1 && (
              <button 
                className={cn(
                  "hover:bg-stone-100 p-1 rounded-sm",
                )}
                tabIndex={-1} 
                onClick={() => setOpen(!_open)}
              >
                <ChevronDown className={cn("h-5 w-5 transition-all duration-300", _open && '-rotate-180')} strokeWidth={1} />
              </button>
            )} 

            <ActionButtons item={item} />

          </div>
        </div>
        {item.with_serial == 1 && (
          _open && (
            <ShippingItemSerialNumber 
              item={item}
              onClickAddSN={onClickAddSN}
              // onDeleted={onDeletedSN}
              onClickReturn={(serial_number) => onClickReturnSN && onClickReturnSN(serial_number, item)}
            />
          )
        )}
      </div>
    </>
  );
});

_ItemList.displayName = '_ItemList';

export const ItemList = memo(_ItemList);

type ItemListProps = {
  item?: any
  descriptionWidth?: any
  onClickAddSN?: (serial_numbers: any) => void
  onClickReturnSN?: (serial_number?: any, item?: any) => void
  [key: string]: any
};