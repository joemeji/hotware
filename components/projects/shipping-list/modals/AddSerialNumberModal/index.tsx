import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { memo, useContext, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetcher } from "@/utils/api.config";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SerialStatus from "@/components/status/status";
import {
  SN_DAMAGE,
  SN_ONSOLD,
  SN_QUARANTINE,
  SN_SHIPPED,
  snStatuses,
} from "@/utils/snStatuses";
import LoadingMore from "@/components/LoadingMore";
import { useSWRConfig } from "swr";
import { mutateIndex } from "@/services/shipping/item";
import { mutateIndex as mutateIndexSet } from "@/services/shipping/set";
import Image from "next/image";

function AddSerialNumberModal(props: AddSerialNumberModalProps) {
  const {
    open,
    onOpenChange,
    _item_id,
    needed_quantity,
    _shipping_id,
    shipping_item_id,
    addedSerialNumbers,
    is_item_in_set,
    onAddedSN,
    item,
  } = props;
  const [checkedItems, setCheckedItems] = useState<any>([]);
  const [openWarningAlert, setOpenWarningAlert] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const _is_item_in_set = is_item_in_set || 0;
  const itemProp = item;

  const { data, isLoading, error, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      if (_shipping_id) paramsObj["_shipping_id"] = _shipping_id;
      let searchParams = new URLSearchParams(paramsObj);
      return open
        ? `${`/api/item/${_item_id}/serial_number/list`}?${searchParams.toString()}`
        : null;
    }, fetcher);

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onCheckedChange = (checked: boolean, sn: any) => {
    const _checkedItems = [...checkedItems];
    const _checkedItemIndex = _checkedItems.findIndex(
      (item: any) => item._serial_number_id === sn._serial_number_id
    );

    if (_checkedItems[_checkedItemIndex]) {
      if (
        typeof _checkedItems[_checkedItemIndex].shipping_item_details_id !==
        "undefined"
      ) {
        _checkedItems[_checkedItemIndex].removed = !checked;
      }
      if (
        !checked &&
        typeof _checkedItems[_checkedItemIndex].shipping_item_details_id ===
          "undefined"
      ) {
        _checkedItems.splice(_checkedItemIndex, 1);
      }
    }

    if (checked && !_checkedItems[_checkedItemIndex]) {
      sn.removed = false;
      _checkedItems.push(sn);
    }

    if (
      Array.isArray(_checkedItems) &&
      _checkedItems.filter((item: any) => !item.removed).length >
        Number(needed_quantity)
    ) {
      _checkedItems.pop();
      setOpenWarningAlert(true);
    }

    setCheckedItems(_checkedItems);
  };

  const checkedItem = (_serial_number_id: string) => {
    return checkedItems.find((item: any) => {
      return (
        item._serial_number_id === _serial_number_id && item.removed === false
      );
    });
  };

  const disabledItem = (serial_number: any) => {
    const _statuses: string[] = snStatuses.map((sn: any) => sn.name);
    if (!serial_number) return true;
    // if (serial_number && serial_number.exists_serial_number === '1') return true;
    if (
      serial_number.serial_number_status === SN_DAMAGE ||
      serial_number.serial_number_status === SN_SHIPPED ||
      serial_number.serial_number_status === SN_QUARANTINE ||
      serial_number.serial_number_status === SN_ONSOLD
    )
      return true;
    if (_statuses.includes(serial_number.serial_number_status)) return false;
    if (!_statuses.includes(serial_number.serial_number_status)) return true;
    return false;
  };

  const onSubmit = async () => {
    try {
      setisSubmitting(true);
      const options = {
        method: "POST",
        body: JSON.stringify({}),
      };
      const _checkedItems = [...checkedItems].map((item: any) => {
        const _item: any = {
          shipping_item_id,
          _serial_number_id: item._serial_number_id,
          is_item_in_set: _is_item_in_set,
        };
        if (itemProp && itemProp.sisl_id) {
          _item.sisl_id = itemProp.sisl_id;
        }
        if (typeof item.shipping_item_details_id !== "undefined") {
          _item.shipping_item_details_id = item.shipping_item_details_id;
        }
        if (typeof item.removed !== "undefined") {
          _item.removed = item.removed;
        }
        return _item;
      });
      options["body"] = JSON.stringify({
        serial_numbers: _checkedItems,
        shipping_item_id,
      });

      const res = await fetch(
        `/api/shipping/${_shipping_id}/serial_number/${_item_id}/save`,
        options
      );
      const json = await res.json();

      if (json.success) {
        setisSubmitting(false);
        mutate(mutateIndexSet(_shipping_id, itemProp?.shipping_item_id));
        mutate(mutateIndex(_shipping_id));
        onOpenChange && onOpenChange(false);
        setCheckedItems([]);
      }
    } catch (err: any) {
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(addedSerialNumbers)) {
      const _addedSerialNumbers = addedSerialNumbers.map((item: any) => ({
        ...item,
        removed: false,
      }));
      setCheckedItems(_addedSerialNumbers);
    }
  }, [addedSerialNumbers]);

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data);
    if (currentPage) {
      setSize(currentPage + 1);
    }
  };

  return (
    <React.Fragment>
      <AlertDialog open={openWarningAlert} onOpenChange={setOpenWarningAlert}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Needed Quantity Exceed</AlertDialogTitle>
            <AlertDialogDescription>
              The needed quantity must not exceed to <b>{needed_quantity}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={open}
        onOpenChange={(open: boolean) =>
          !isSubmitting && onOpenChange && onOpenChange(open)
        }
      >
        <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-1 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>Select S/N</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <ScrollArea
            onScrollEndViewPort={onscrollend}
            viewPortClassName="max-h-[600px]"
          >

            {(Array.isArray(_data) && _data.length === 1 && _data[0].serial_numbers?.length === 0) ? (
              <div className="flex justify-center">
                <Image
                  src="/images/No data-rafiki.svg"
                  width={300}
                  height={300}
                  alt="No Data to Shown"
                />
              </div>
            ) : (
              <>
                <div className="flex justify-between shadow-sm bg-background/40 backdrop-blur-sm py-2 px-4 sticky top-0 items-center z-10">
                  <p>Needed Quantity</p>

                  <div className="flex items-center gap-[2px]">
                    <span className="font-extrabold text-lg">
                      {
                        checkedItems.filter((item: any) => item.removed === false)
                          .length
                      }
                    </span>
                    <span className="text-stone-400">/</span>
                    <p className="font-medium">{needed_quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 p-3">
                  {_data &&
                    Array.isArray(_data) &&
                    _data.map((data: any) => {
                      return (
                        data &&
                        Array.isArray(data.serial_numbers) &&
                        data.serial_numbers.map((item: any, key: number) => (
                          <label
                            key={key}
                            className={cn(
                              "flex justify-between p-3 rounded-xl cursor-pointer hover:bg-stone-100",
                              disabledItem(item) &&
                                "opacity-50 pointer-events-none",
                              checkedItem(item._serial_number_id) && "bg-stone-100"
                            )}
                            htmlFor={item._serial_number_id}
                          >
                            <div className="flex items-center">
                              <Checkbox
                                className={cn("w-5 h-5 rounded-full mr-2")}
                                id={item._serial_number_id}
                                checked={
                                  checkedItem(item._serial_number_id) ? true : false
                                }
                                onCheckedChange={(checked: boolean) =>
                                  onCheckedChange(checked, item)
                                }
                                disabled={disabledItem(item)}
                              />
                              <span className="font-medium">
                                {item.serial_number}
                              </span>
                            </div>
                            <SerialStatus
                              statusName={item.serial_number_status}
                              className={cn(
                                "flex gap-1 py-1 px-2 items-center rounded-md"
                              )}
                              statusClassName="text-sm font-medium"
                              iconProps={{
                                width: 15,
                                height: 15,
                              }}
                            />
                          </label>
                        ))
                      );
                    })}
                  {isLoadingMore && <LoadingMore />}
                </div>
              </>
            )} 
          </ScrollArea>
          <DialogFooter className="border-t py-3 px-4">
            <Button
              variant={"ghost"}
              onClick={() => onOpenChange && onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              className={cn(isSubmitting && "loading")}
              disabled={isSubmitting}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default memo(AddSerialNumberModal);

type AddSerialNumberModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  _item_id: string;
  needed_quantity?: number;
  _shipping_id?: any;
  shipping_item_id: any;
  onAddedSN?: (serials?: any) => void;
  addedSerialNumbers?: any;
  is_item_in_set?: number;
  item?: any;
};
