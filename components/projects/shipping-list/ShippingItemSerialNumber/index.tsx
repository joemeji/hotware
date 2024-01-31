import React, { memo, useContext, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { ACTIVE, RETURNED, SHIPPED } from "@/lib/shipping";
import {
  RemoveButton,
  ResetReturnedButton,
  ReturnedButton,
  ShippedButton,
} from "./Buttons";
import dynamic from "next/dynamic";

const AddItemReportModal = dynamic(
  () => import("../modals/AddItemReportModal")
);

const ShippingItemSerialNumber = React.forwardRef(
  (props: ShippingItemSerialNumberProps, ref: any) => {
    const { item, onClickAddSN } = props;
    const shippingDetails: any = useContext(ShippingDetailsContext);
    const [_serial_number, set_serial_number] = useState<any>(
      item.serial_number
    );
    const shipping_status = shippingDetails
      ? shippingDetails.shipping_status
      : null;

    const _onClickAddSN = () => {
      onClickAddSN && onClickAddSN(_serial_number);
    };
    const [openReportModal, setOpenReportModal] = useState(false);
    const [itemReport, setItemReport] = useState<any>(null);

    const toggleButton = () => {
      if (!item) return false;
      if (!_serial_number) return false;
      const dataLength = _serial_number.length;
      let totalQty = !isNaN(item.shipping_item_quantity)
        ? Number(item.shipping_item_quantity)
        : 0;
      if (item.item_set_id) {
        totalQty = !isNaN(item.item_set_list_quantity)
          ? Number(item.item_set_list_quantity)
          : 0;
      }
      return totalQty > dataLength;
    };

    const onReport = (serial_number: any) => {
      const data = {
        shipping_item_name: item.shipping_item_name || item.item_set_name,
        item_image: item.item_image,
        item_id: item.item_id,
        serial_number_id: serial_number.serial_number_id,
        serial_number: serial_number.serial_number,
      };
      setOpenReportModal(true);
      setItemReport(data);
    };

    useEffect(() => {
      if (Array.isArray(item.serial_numbers)) {
        set_serial_number(item.serial_numbers);
      }
    }, [item]);

    return (
      <>
        <AddItemReportModal
          onOpenChange={(open: any) => {
            setOpenReportModal(open);
            setItemReport(null);
          }}
          open={openReportModal}
          data={itemReport}
        />
        <div className="flex justify-center">
          <ScrollArea className="w-full">
            {Array.isArray(_serial_number) && _serial_number.length > 0 && (
              <div className="flex flex-col">
                {_serial_number.map((sn: any, key: number) => (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center py-2 ps-3 pe-1 first:border-t",
                      "border-b border-stone-100"
                    )}
                  >
                    <div className="font-medium w-[50px]">
                      <span className="w-7 h-7 bg-stone-200 flex items-center justify-center rounded-full text-sm">
                        {key + 1}
                      </span>
                    </div>
                    <div className="font-medium">{sn.serial_number}</div>
                    <div className="ms-auto flex items-center">
                      {shipping_status === SHIPPED && (
                        <ShippedButton
                          serial_number={{
                            ...sn,
                            shipping_item_id: item.shipping_item_id,
                            item_id: item.item_id,
                            item_image: item.item_image,
                          }}
                          onClick={() => onReport && onReport(sn)}
                        />
                      )}
                      {shipping_status === RETURNED && (
                        <>
                          <ReturnedButton
                            serial_number={{
                              ...sn,
                              shipping_item_id: item.shipping_item_id,
                            }}
                          />
                          <ResetReturnedButton
                            serial_number={{
                              ...sn,
                              shipping_item_id: item.shipping_item_id,
                            }}
                          />
                        </>
                      )}
                      {shipping_status === ACTIVE && (
                        <RemoveButton
                          serial_number={{
                            ...sn,
                            shipping_item_id: item.shipping_item_id,
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div
              className={cn(
                "flex flex-col gap-3",
                Array.isArray(_serial_number) &&
                  _serial_number.length > 0 &&
                  "p-0"
              )}
            >
              {toggleButton() && (
                <div className="flex justify-center items-center">
                  <div className="flex justify-center flex-col items-center sticky bottom-0 py-2 w-full border-t border-t-stone-100">
                    <Button
                      variant={"secondary"}
                      className="flex gap-1 items-center "
                      onClick={_onClickAddSN}
                    >
                      <Plus className="w-5 h-5" /> Serial Number
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }
);

ShippingItemSerialNumber.displayName = "ShippingItemSerialNumber";

export default memo(ShippingItemSerialNumber);

type ShippingItemSerialNumberProps = {
  item?: any;
  onClickAddSN?: any;
  onClickReturn?: (serial_number: any) => void;
};
