import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { cn } from "@/lib/utils";
import { ChevronDown} from "lucide-react";
import React, { memo, useContext, useState } from "react";
import ShippingItemSerialNumber from "../../ShippingItemSerialNumber";
import { CompleteIncompleteStatus } from "../../shipping_id";
import ActionButton from "./action-buttons";
import Description from "../../sortable-item/item-list/description";
import HSCode from "../../sortable-item/item-list/hscode";
import Weight from "../../sortable-item/item-list/weight";
import UnitValue from "../../sortable-item/item-list/unit-value";
import Quantity from "../../sortable-item/item-list/quantity";
import { RETURNED } from "@/lib/shipping";

type SetItemListProps = {
  item?: any
  onClickAddSN?: (item: any, data: any) => void
  num?: number
}

type ItemListProps = { 
  item?: any, 
  children?: React.ReactNode, 
  open?: boolean, 
  onClickOpen?: () => void, 
  num?: number
}

const SetItemList = ({ item, onClickAddSN, num }: SetItemListProps) => {
  const [open, setOpen] = useState(false);
  return (
    <ItemList num={num} item={item} onClickOpen={() => setOpen(!open)} open={open}>
      {item && Number(item.with_serial) === 1 && open && (
        <ShippingItemSerialNumber 
          item={item}
          onClickAddSN={(data: any) => onClickAddSN && onClickAddSN(item, data)}
        />
      )}
    </ItemList>
  );
};

export default memo(SetItemList);

const ItemList = ({ item, children, open, onClickOpen }: ItemListProps) => {
  const shippingDetails: any = useContext(ShippingDetailsContext);

  const completed = () => {
    const with_serial = Number(item.with_serial) === 1;
    const total_returned = Number(item.total_returned);
    let total_sn_returned = Number(item.total_sn_returned);
    const item_set_list_quantity = Number(item.item_set_list_quantity);
    let total_added = Number(item.total_added) || 0;

    if (shippingDetails?.shipping_status === RETURNED) {
      total_sn_returned /= item_set_list_quantity;

      if (with_serial && total_sn_returned === item_set_list_quantity) {
        
        return <CompleteIncompleteStatus completed={true} />;
      }

      if (!with_serial && total_returned === item_set_list_quantity) {
        return <CompleteIncompleteStatus completed={true} />;
      }

      return <CompleteIncompleteStatus completed={false} />;

    }

    if (with_serial) {
      total_added /= item_set_list_quantity;
      if (total_added === item_set_list_quantity) {
        return <CompleteIncompleteStatus completed={true} />;
      }
    }
    if (!with_serial) {
      if (Number(item.unserialized_total_added) === Number(item.item_set_list_quantity)) {
        return <CompleteIncompleteStatus completed={true} />;
      }
    }
    return <CompleteIncompleteStatus completed={false} />;
  };

  return (
    <div
      className={cn(
        "overflow-hidden flex flex-col bg-background rounded-sm",
        // open && 'shadow-sm','
      )}
    >
      <div 
        className={cn(
          "flex relative p-1",
        )}>
        <div className="flex items-center">
          <Description item={item} descriptionWidth={355} />
          <HSCode item={item} />
          <Weight item={item} />
          <Quantity item={item} />
          <UnitValue item={item} />
        </div>
        <div className="min-w-[150px] p-2 ps-12 flex items-center">
          {completed()}
        </div>
        <div className="absolute right-0 h-full top-0 flex items-start pe-2 py-3">
          {item && Number(item.with_serial) === 1 && (
            <button 
              className={cn(
                "hover:bg-stone-100 p-1 rounded-app",
              )}
              tabIndex={-1} 
              onClick={onClickOpen}
            >
              <ChevronDown className={cn("h-5 w-5 transition-all duration-300", open && '-rotate-180')} strokeWidth={1} />
            </button>
          )}
          <ActionButton item={item} />
        </div>
      </div>
      {children}
    </div>
  )
}