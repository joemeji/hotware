import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
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
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { ACTIVE, RETURNED, SHIPPED } from "@/lib/shipping";
import { cn } from "@/lib/utils";
import {
  markCompletedItemApi,
  mutateIndex,
  resetItemApi,
  returnItemApi,
} from "@/services/shipping/item";
import {
  mutateIndex as mutateIndexSet,
  removeSetItemApi,
} from "@/services/shipping/set";
import { AlertTriangle, Check, CornerDownLeft, Trash, X } from "lucide-react";
import { useContext, useState } from "react";
import { useSWRConfig } from "swr";
import { iconProps } from "../../sortable-item/item-list/action-buttons";
import { Undo2 } from "lucide-react";
import ReturnEquipmentModal from "../../modals/ReturnEquipmentModal";
import dynamic from "next/dynamic";

const AddItemReportModal = dynamic(
  () => import("../../modals/AddItemReportModal")
);

export default function ActionButton({ item }: { item: any }) {
  const [alertMessage, setAlertMessage] = useState<any>({});
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const { mutate } = useSWRConfig();
  const [openReturnModal, setOpenReturnModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  const onCompleted = async () => {
    try {
      const json = await markCompletedItemApi(shippingDetails?._shipping_id, {
        shipping_item_id: item.shipping_item_id,
        sisl_id: item.sisl_id,
      });

      if (json.success && json.shipping_item) {
        mutate(mutateIndex(shippingDetails?._shipping_id));
        mutate(
          mutateIndexSet(
            shippingDetails?._shipping_id,
            json.shipping_item.shipping_item_id
          )
        );
      }
      if (!json.success && json.message) {
        setOpenAlertMessage(true);
        setAlertMessage(json.message);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onRemove = async (forceDelete = false) => {
    try {
      setDeleteItem(item);
      const json = await removeSetItemApi(shippingDetails?._shipping_id, {
        sisl_id: item.sisl_id,
        delete: forceDelete,
      });
      if (json && json.message) {
        setAlertMessage(json.message);
        setOpenAlertMessage(true);
      }
      if (json.success) {
        setDeleteItem(null);
        setAlertMessage(null);
        setOpenAlertMessage(false);
        mutate(
          mutateIndexSet(shippingDetails?._shipping_id, item.shipping_item_id)
        );
        mutate(mutateIndex(shippingDetails?._shipping_id));
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onReturn = async () => {
    if (item?.item_set_list_quantity > 1) {
      setOpenReturnModal(true);
    } else {
      const json = await returnItemApi(shippingDetails?._shipping_id, {
        return_quantity: 1,
        shipping_item_details_id: item?.shipping_item_details_id,
        shipping_item_id: item?.shipping_item_id,
      });
      if (json && json.success) {
        mutate(mutateIndex(shippingDetails?._shipping_id));
        mutate(
          mutateIndexSet(shippingDetails?._shipping_id, item?.shipping_item_id)
        );
      }
    }
  };

  const onReport = () => {
    item.shipping_item_name = item.item_set_name;
    setOpenReportModal(true);
  };

  return (
    <>
      <AlertDialog open={openAlertMessage} onOpenChange={setOpenAlertMessage}>
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
            <AlertDialogCancel
              onClick={() => {
                setDeleteItem(null);
                setAlertMessage(null);
                setOpenAlertMessage(false);
              }}
            >
              Close
            </AlertDialogCancel>
            {deleteItem && (
              <AlertDialogAction onClick={() => onRemove(true)}>
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReturnEquipmentModal
        open={openReturnModal}
        onOpenChange={setOpenReturnModal}
        item={item}
      />

      <AddItemReportModal
        onOpenChange={(open: any) => setOpenReportModal(open)}
        open={openReportModal}
        data={item}
      />

      {item.with_serial == 0 && (
        <MoreOption triggerButtonClassName="hover:bg-stone-100">
          <ReturnButton item={item} onReturn={onReturn} />
          <ReportButton item={item} onReport={onReport} />
          {shippingDetails?.shipping_status === ACTIVE && (
            <>
              <MarkAsCompleted item={item} onCompleted={onCompleted} />
              <RemoveAction onRemove={() => onRemove(false)} />
            </>
          )}
        </MoreOption>
      )}

      {item.with_serial == 1 && shippingDetails?.shipping_status === ACTIVE && (
        <MoreOption triggerButtonClassName="hover:bg-stone-100">
          <MarkAsCompleted item={item} onCompleted={onCompleted} />
          <RemoveAction onRemove={() => onRemove(false)} />
        </MoreOption>
      )}
    </>
  );
}

const ReportButton = ({
  onReport,
  item,
}: {
  item: any;
  onReport?: () => void;
}) => {
  const shippingData: any = useContext(ShippingDetailsContext);
  if (item?.with_serial == 0 && shippingData?.shipping_status === SHIPPED) {
    return (
      <>
        <ItemMenu onClick={onReport}>
          <AlertTriangle {...iconProps("text-red-600")} />
          <span className="font-medium">Report</span>
        </ItemMenu>
      </>
    );
  }
  return <></>;
};

const ReturnButton = ({
  item,
  onReturn,
}: {
  item: any;
  onReturn?: () => void;
}) => {
  const shippingData: any = useContext(ShippingDetailsContext);
  const item_set_list_quantity = Number(item?.item_set_list_quantity) || 0;
  const total_returned = Number(item?.total_returned) || 0;
  const { mutate } = useSWRConfig();

  const onReset = async () => {
    const json = await resetItemApi(shippingData?._shipping_id, {
      shipping_return_item_id: item?.shipping_return_item_id,
    });
    if (json.success) {
      mutate(mutateIndex(shippingData?._shipping_id));
      mutate(
        mutateIndexSet(shippingData?._shipping_id, item?.shipping_item_id)
      );
    }
  };

  if (item?.with_serial == 0 && shippingData?.shipping_status === RETURNED) {
    return (
      <>
        {total_returned != item_set_list_quantity && (
          <ItemMenu onClick={onReturn}>
            <CornerDownLeft {...iconProps("text-orange-600")} />
            <span className="font-medium">Return</span>
          </ItemMenu>
        )}
        {total_returned > 0 && (
          <ItemMenu onClick={onReset}>
            <Undo2 {...iconProps("text-purple-600")} />
            <span className="font-medium">Reset</span>
          </ItemMenu>
        )}
      </>
    );
  }
  return <></>;
};

const MarkAsCompleted = ({
  item,
  onCompleted,
}: {
  item: any;
  onCompleted: () => void;
}) => {
  if (item && Number(item.with_serial) === 0) {
    return (
      <>
        <ItemMenu onClick={onCompleted}>
          {Number(item.unserialized_total_added) ===
          Number(item.item_set_list_quantity) ? (
            <X
              className={cn("mr-2 h-[18px] w-[18px] text-red-600")}
              strokeWidth={3}
            />
          ) : (
            <Check
              className={cn("mr-2 h-[18px] w-[18px] text-green-600")}
              strokeWidth={3}
            />
          )}
          <span className="font-medium">
            Mark as{" "}
            {Number(item.unserialized_total_added) ===
            Number(item.item_set_list_quantity)
              ? "Incomplete"
              : "Complete"}
          </span>
        </ItemMenu>
      </>
    );
  }

  return <></>;
};

const RemoveAction = ({
  onRemove,
}: {
  onRemove: (delelte: boolean) => void;
}) => {
  return (
    <>
      <ItemMenu onClick={() => onRemove && onRemove(false)}>
        <Trash className={cn("mr-2 h-[18px] w-[18px]")} strokeWidth={1} />
        <span className="font-medium">Remove</span>
      </ItemMenu>
    </>
  );
};
