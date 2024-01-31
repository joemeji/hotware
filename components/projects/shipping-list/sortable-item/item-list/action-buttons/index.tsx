import MoreOption from "@/components/MoreOption";
import { cn } from "@/lib/utils";
import {
  CommonOnActiveButton,
  NonSerializedOnActiveButton,
  NonSerializedOnShippedButton,
  ReturnButton,
} from "./buttons";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { useContext, useState } from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { useSWRConfig } from "swr";
import {
  deleteShippingItemApi,
  markCompletedItemApi,
  mutateIndex,
  returnItemApi,
} from "@/services/shipping/item";
import dynamic from "next/dynamic";
import { ACTIVE, RETURNED, SHIPPED } from "@/lib/shipping";

const EditShippingItemModal = dynamic(
  () => import("../../../modals/EditShippingItemModal")
);
const ReturnEquipmentModal = dynamic(
  () => import("../../../modals/ReturnEquipmentModal")
);

const AddItemReportModal = dynamic(
  () => import("../../../modals/AddItemReportModal")
);

export const iconProps = (colorClassName?: any) => ({
  className: cn("mr-2 h-[18px] w-[18px]", colorClassName),
  strokeWidth: 1.5,
});

export default function ActionButtons({ item }: { item: any }) {
  const [alertMessage, setAlertMessage] = useState<any>({});
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [deleteItemLoading, setDeleteItemloading] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState<any>(null);
  const shippingData: any = useContext(ShippingDetailsContext);
  const { mutate } = useSWRConfig();
  const [isEditItem, setIsEditItem] = useState(false);
  const [openReturnModal, setOpenReturnModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  const onDeleteShippingItem = async (forceDelete = false) => {
    try {
      setToDeleteItem(item);
      setDeleteItemloading(true);

      const json = await deleteShippingItemApi(shippingData?._shipping_id, {
        shipping_item_id: item.shipping_item_id,
        isDelete: forceDelete,
      });

      setDeleteItemloading(false);
      if (json && !json.success && json.message) {
        setOpenAlertMessage(true);
        setAlertMessage(json.message);
      }
      if (json && json.success) {
        mutate(mutateIndex(shippingData?._shipping_id));
      }
    } catch (err: any) {
      setDeleteItemloading(false);
    }
  };

  const onCompleted = async () => {
    if (!item) return;
    try {
      const json = await markCompletedItemApi(shippingData?._shipping_id, {
        shipping_item_id: item.shipping_item_id,
      });
      if (json.success && json.shipping_item) {
        mutate(mutateIndex(shippingData?._shipping_id));
      }
      if (!json.success && json.message) {
        +setOpenAlertMessage(true);
        setAlertMessage(json.message);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

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
            {toDeleteItem && (
              <AlertDialogAction
                disabled={deleteItemLoading}
                onClick={() => {
                  toDeleteItem && onDeleteShippingItem(true);
                }}
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditShippingItemModal
        item={item}
        _shipping_id={shippingData?._shipping_id}
        onOpenChange={setIsEditItem}
        open={isEditItem}
      />

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

      {shippingData?.shipping_status === ACTIVE && item?.is_custom == 1 && (
        <MoreOption>
          <NonSerializedOnActiveButton item={item} onCompleted={onCompleted} />
          <CommonOnActiveButton
            item={item}
            onDelete={() => onDeleteShippingItem(false)}
            onEdit={() => setIsEditItem(true)}
          />
        </MoreOption>
      )}

      {shippingData?.shipping_status === ACTIVE && item?.with_serial == 0 && (
        <MoreOption>
          <NonSerializedOnActiveButton item={item} onCompleted={onCompleted} />
          <CommonOnActiveButton
            item={item}
            onDelete={() => onDeleteShippingItem(false)}
            onEdit={() => setIsEditItem(true)}
          />
        </MoreOption>
      )}

      {shippingData?.shipping_status === ACTIVE && item?.with_serial == 1 && (
        <MoreOption>
          <CommonOnActiveButton
            item={item}
            onDelete={() => onDeleteShippingItem(false)}
            onEdit={() => setIsEditItem(true)}
          />
        </MoreOption>
      )}

      {shippingData?.shipping_status === RETURNED &&
        (item?.with_serial == 0 || item?.is_custom == 1) && (
          <MoreOption>
            <ReturnButton
              item={item}
              onReturn={() => setOpenReturnModal(true)}
            />
          </MoreOption>
        )}

      {shippingData?.shipping_status === SHIPPED &&
        (item?.with_serial == 0 || item?.is_custom == 1) && (
          <MoreOption>
            <NonSerializedOnShippedButton
              item={item}
              onReport={() => setOpenReportModal(true)}
            />
          </MoreOption>
        )}
    </>
  );
}
