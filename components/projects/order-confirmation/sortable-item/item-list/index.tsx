import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  CornerDownLeft,
  MinusCircle,
  Pencil,
  Trash,
  Undo2,
  X,
} from "lucide-react";
import React, { memo, useContext, useState } from "react";
import { OrderConfirmationDetailsContext } from "@/context/order-confirmation-details-content";
// import ShippingItemSerialNumber from "../../ShippingItemSerialNumber";
import CompletedMark from "./completed-mark";
import Description from "./description";
import HSCode from "./hscode";
import Weight from "./weight";
import Quantity from "./quantity";
import UnitValue from "./unit-value";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSWRConfig } from "swr";
import { OPEN, CANCELLED, CLOSED } from "@/lib/order";

const _ItemList = React.forwardRef((props: ItemListProps, ref: any) => {
  const orderConfirmationDetails: any = useContext(
    OrderConfirmationDetailsContext
  );
  const {
    item,
    descriptionWidth,
    onClickEdit,
    onClickAddSN,
    onDeletedSN,
    // onClickUncategorized,
  } = props;
  const _order_confirmation_id = orderConfirmationDetails
    ? orderConfirmationDetails._order_confirmation_id
    : null;
  const [_open, setOpen] = useState(item.open);
  const [alertMessage, setAlertMessage] = useState<any>({});
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [deleteItemLoading, setDeleteItemloading] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState<any>(null);
  const { mutate } = useSWRConfig();
  const orderConfirmationData: any = useContext(
    OrderConfirmationDetailsContext
  );
  const order_confirmation_status = orderConfirmationData
    ? orderConfirmationData.order_confirmation_status
    : null;
  const with_serial = item ? Number(item.with_serial) === 1 : false;

  const markCompletedOrIncompleted = () => {
    if (item.is_custom == 1) {
      return item.custom_total_added ? "Incomplete" : "Complete";
    }
    return Number(item.unserialized_total_added) ===
      Number(item.order_confirmation_quantity)
      ? "Incomplete"
      : "Complete";
  };

  const onCompleted = async () => {
    if (!item) return;
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          order_confirmation_item_id: item.order_confirmation_item_id,
        }),
      };
      const res = await fetch(
        "/api/orders/" + _order_confirmation_id + "/complete_nonserialized",
        options
      );
      const json = await res.json();
      if (json.success && json.order_confirmation) {
        mutate(`/api/orders/${_order_confirmation_id}/items`);
      }
      if (!json.success && json.message) {
        setOpenAlertMessage(true);
        setAlertMessage(json.message);
      }
    } catch (err: any) {}
  };

  const onDeleteOrderConfirmationItem = async (forceDelete = false) => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          order_confirmation_item_id: item.order_confirmation_item_id,
          delete: forceDelete,
        }),
      };
      setToDeleteItem(item);
      setDeleteItemloading(true);
      const res = await fetch(
        `/api/orders/${_order_confirmation_id}/item/delete`,
        options
      );
      const json = await res.json();
      setDeleteItemloading(false);
      if (json && !json.success && json.message) {
        setOpenAlertMessage(true);
        setAlertMessage(json.message);
      }
      if (json && json.success) {
        mutate(`/api/orders/${_order_confirmation_id}/items`);
      }
    } catch (err: any) {
      setDeleteItemloading(false);
    }
  };

  const onClickUncategorized = async () => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          items: [
            {
              _item_id: item._item_id,
              order_confirmation_item_id: item.order_confirmation_item_id,
            },
          ],
        }),
      };
      const res = await fetch(
        `/api/orders/${_order_confirmation_id}/item/update`,
        options
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        mutate(`/api/orders/${_order_confirmation_id}/items`);
      }
    } catch (err: any) {}
  };

  const iconProps = (colorClassName?: any) => ({
    className: cn("mr-2 h-[18px] w-[18px]", colorClassName),
    strokeWidth: 1.5,
  });

  const CANCELLEDItemsMenu = order_confirmation_status === CANCELLED && (
    <>
      <ItemMenu>
        <CornerDownLeft {...iconProps("text-orange-600")} />
        <span className="font-medium">Return</span>
      </ItemMenu>
      <ItemMenu>
        <Undo2 {...iconProps("text-purple-600")} />
        <span className="font-medium">Reset</span>
      </ItemMenu>
    </>
  );

  const nonserializedItemCLOSED = order_confirmation_status === CLOSED && (
    <>
      <ItemMenu>
        <AlertTriangle {...iconProps("text-red-600")} />
        <span className="font-medium">Report</span>
      </ItemMenu>
    </>
  );

  const nonSerialMenu = order_confirmation_status === OPEN && (
    <ItemMenu onClick={onCompleted}>
      {Number(item.unserialized_total_added) ===
      Number(item.order_confirmation_quantity) ? (
        <X {...iconProps("text-red-600")} strokeWidth={3} />
      ) : (
        <Check {...iconProps("text-green-600")} strokeWidth={3} />
      )}
      <span className="font-medium">
        Mark as {markCompletedOrIncompleted()}
      </span>
    </ItemMenu>
  );

  const commonMenu = order_confirmation_status === OPEN && (
    <>
      <ItemMenu onClick={onClickEdit}>
        <Pencil {...iconProps()} />
        <span className="font-medium">Edit</span>
      </ItemMenu>
      <ItemMenu onClick={() => onDeleteOrderConfirmationItem(false)}>
        <Trash {...iconProps()} />
        <span className="font-medium">Delete</span>
      </ItemMenu>
    </>
  );

  return (
    <>
      <AlertDialog
        open={openAlertMessage}
        onOpenChange={(open) => {
          setOpenAlertMessage(open);
          if (!open) {
            setToDeleteItem(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertMessage && alertMessage.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage && (
                <span
                  dangerouslySetInnerHTML={{ __html: alertMessage.description }}
                />
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteItemLoading}
              onClick={() => {
                toDeleteItem && onDeleteOrderConfirmationItem(true);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        ref={ref}
        className={cn("overflow-hidden flex flex-col bg-white rounded-sm")}
      >
        <div
          className={cn(
            "flex relative p-1",
            item.open && "border-b border-stone-100"
          )}
        >
          <div className="flex items-center">
            <Description
              descriptionWidth={descriptionWidth || 365}
              item={item}
            />
            <HSCode item={item} />
            <Weight item={item} />
            <Quantity item={item} />
            <UnitValue item={item} />
          </div>
          <CompletedMark item={item} />
          <div className="absolute right-0 h-full top-0 flex items-start pe-2 py-3">
            {item && Number(item.with_serial) === 1 && (
              <button
                className={cn("hover:bg-stone-100 p-1 rounded-sm")}
                tabIndex={-1}
                onClick={() => setOpen(!_open)}
              >
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    _open && "-rotate-180"
                  )}
                  strokeWidth={1}
                />
              </button>
            )}

            {with_serial && commonMenu && <MoreOption>{commonMenu}</MoreOption>}

            {!with_serial && (
              <MoreOption>
                {CANCELLEDItemsMenu}
                {commonMenu}
              </MoreOption>
            )}
          </div>
        </div>
        {/* {item.with_serial == 1 && (
          _open && (
            <ShippingItemSerialNumber
              item={item}
              onClickAddSN={onClickAddSN}
              onDeleted={onDeletedSN}
            />
          )
        )} */}
      </div>
    </>
  );
});

_ItemList.displayName = "_ItemList";

export const ItemList = memo(_ItemList);

type ItemListProps = {
  item?: any;
  descriptionWidth?: any;
  onClickEdit?: () => void;
  onClickAddSN?: (serial_numbers: any) => void;
  onDeletedSN?: (order_confirmation: any) => void;
  onClickDelete?: () => void;
  onCompleted?: () => void;
};