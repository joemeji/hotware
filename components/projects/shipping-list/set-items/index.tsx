import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { memo, useContext, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { fetcher } from "@/utils/api.config";
import SetItemList from "./set-item-list";
import { Skeleton } from "@/components/ui/skeleton";
import AddSerialNumberModal from "../modals/AddSerialNumberModal";
import { CompleteIncompleteStatus } from "../shipping_id";
import useSWR, { useSWRConfig } from "swr";
import { formatter } from "@/utils/text";
import ActionButtons from "./action-buttons";
import { ACTIVE, RETURNED } from "@/lib/shipping";

const _ItemList = React.forwardRef((props: ItemListProps, ref: any) => {
  const { 
    item, 
    descriptionWidth,
    onOpenModal,
    onDeletedSN,
    ...rest
  } = props;
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const shipping_id = shippingDetails ? shippingDetails._shipping_id : null;
  const [openSNModal, setOpenSNModal] = useState(false);
  const [serialNumbersForAddSnModal, setSerialNumbersForAddSnModal] = useState<any>([]);
  const [selectedItemForAddSnModal, setSelectedItemForAddSnModal] = useState<any>(null);
  const shippingData: any = useContext(ShippingDetailsContext);
  const [openSn, setOpenSn] = useState(false);

  const uri = () => {
    if (!item) return null;
    if (!openSn) return null;
    return `/api/shipping/${shipping_id}/set/item/${item.shipping_item_id}`;
  }
  
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    () => {
      let paramsObj: any = {};
      return uri();
    }, 
    fetcher
  );

  const unitValue = (num: number) => {
    if (shippingDetails) {
      return formatter(shippingDetails.currency).format(num);
    }
    return num;
  };

  const onClickAddSN = (_item: any, data: any) => {
    setSelectedItemForAddSnModal(_item);
    setOpenSNModal(true);
    setSerialNumbersForAddSnModal(data);
  };

  const onAddedSN = (params: any) => {
    mutate(data);
  };


  const completed = (item: any) => {
    if (item && item.set_qty) {
      const total_list_qty = item.set_qty.total_list_qty ? Number(item.set_qty.total_list_qty) : 0;
      const total_details_qty = item.set_qty.total_details_qty ? Number(item.set_qty.total_details_qty) : 0;

      if (shippingData?.shipping_status === RETURNED) {
        const returnedTotal = item?.shipping_return_item_quantity_total;
        const detailsTotal = item?.shipping_item_details_quantity_total;

        if (returnedTotal === detailsTotal) {
          return <CompleteIncompleteStatus completed={true} />; 
        }

        return <CompleteIncompleteStatus completed={false} />; 
      }

      if (total_list_qty === 0 && total_details_qty === 0) {
        return <CompleteIncompleteStatus completed={false} />;
      }
      if (total_list_qty === total_details_qty) {
        return <CompleteIncompleteStatus completed={true} />;
      }
      return <CompleteIncompleteStatus completed={false} />;
    }
    return <CompleteIncompleteStatus completed={false} />;
  };

  return (
    <>
      <AddSerialNumberModal 
        open={openSNModal} 
        onOpenChange={(open: any) => {
          setOpenSNModal(open);
          if (!open) {
            setSerialNumbersForAddSnModal([]);
          }
        }} 
        _item_id={selectedItemForAddSnModal && selectedItemForAddSnModal._item_id}
        needed_quantity={
          selectedItemForAddSnModal ? (
            !isNaN(selectedItemForAddSnModal.item_set_list_quantity) ? (
              Number(selectedItemForAddSnModal.item_set_list_quantity)
            ) : 0
          ) : 0
        }
        _shipping_id={shippingData && shippingData._shipping_id}
        shipping_item_id={selectedItemForAddSnModal && selectedItemForAddSnModal.shipping_item_id}
        onAddedSN={onAddedSN}
        addedSerialNumbers={serialNumbersForAddSnModal}
        is_item_in_set={1}
        item={selectedItemForAddSnModal}
      />

      <div ref={ref}
        className={cn(
          "overflow-hidden flex flex-col hover:border-stone-100 rounded-sm",
          // _open && "shadow-sm border-stone-100"
        )}
        {...rest}
      >
        <div className={cn(
            "flex relative py-3 ps-3 pe-2",
            "bg-white"
          )}
        >
          <div className="flex items-start">
            <div className="flex items-start gap-1" style={{ width: '357px' }}>
              <div className="w-[15px] h-[15px] bg-purple-300 mt-1 rounded-full" />
              <div className="flex flex-col px-2">
                <span className="font-medium" dangerouslySetInnerHTML={{ __html: item.shipping_item_name || '' }} />
                <span className="text-stone-500">{item.shipping_item_country_of_origin}</span>
              </div>
            </div>
            <div className="w-[155px] p-2 text-right">
              <span className="text-sm">{item.shipping_item_hs_code}</span>
            </div>
            <div className="w-[130px] p-2 text-right">
              <span className="text-sm">{item.shipping_item_weight}</span>
            </div>
            <div className="w-[100px] p-2 text-right">
              <span className="text-sm p-1 font-bold">{item.shipping_item_quantity}</span>
            </div>
            <div className="w-[215px] p-2 text-right">
              <span className="text-sm">
                {unitValue(item.shipping_item_unit_value)}
              </span>
            </div>
          </div>
          <div className="min-w-[150px] p-2 ps-12">
            {completed(item)}
          </div>
          <div className="absolute right-0 h-full top-0 flex items-start pe-2 py-3">
            {item && item.item_set_id && (
              <button 
                className={cn(
                  "hover:bg-stone-100 p-1 rounded-app",
                )}
                tabIndex={-1} 
                onClick={() => setOpenSn(!openSn)}
              >
                <ChevronDown className={cn("h-5 w-5 transition-all duration-300", openSn && '-rotate-180')} strokeWidth={1} />
              </button>
            )} 
            {shippingDetails?.shipping_status === ACTIVE && <ActionButtons item={item} />}
          </div>
        </div>
        <ScrollArea 
          ref={scrollAreaRef} 
          className={"w-full"}
          style={{ height: openSn ? 'auto' : 0 }}
        >
          <div className="flex flex-col gap-[4px] ps-2 pt-1 ms-[1px] bg-stone-100">
            {data && Array.isArray(data.items) && data.items.map((item: any, key: number) => (
              <SetItemList 
                key={key} 
                num={key + 1}
                item={item} 
                onClickAddSN={onClickAddSN}
              />
            ))}
            {data && Array.isArray(data.items) && data.items.length === 0 && (
              <div className="flex justify-center">
                <span className="font-extrabold text-xl text-stone-400">NO ITEMS FOUND</span>
              </div>
            )}
            {isLoading && (
              <div className="flex flex-col items-center gap-2 pt-4">
                <Skeleton className="w-[200px] h-[15px]" />
                <Skeleton className="w-[50px] h-[15px]" />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
});

_ItemList.displayName = '_ItemList';

export const SetItem = memo(_ItemList);

type ItemListProps = {
  item?: any
  descriptionWidth?: any
  onOpenModal?: (open: any) => void
  onDeletedSN?: (shipping_item: any) => void
  [index: string]: any
};