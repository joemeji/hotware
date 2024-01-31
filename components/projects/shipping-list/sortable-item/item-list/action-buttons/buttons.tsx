import { ItemMenu } from "@/components/items";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import {
  AlertTriangle,
  Check,
  CornerDownLeft,
  MinusCircle,
  Pencil,
  Trash,
  Undo2,
  X,
} from "lucide-react";
import { useContext } from "react";
import { iconProps } from ".";
import { ACTIVE, RETURNED, SHIPPED } from "@/lib/shipping";
import { useSWRConfig } from "swr";
import { mutateIndex, resetItemApi } from "@/services/shipping/item";

export const ReturnButton = ({
  onReturn,
  item
}: {
  onReturn: () => void;
  item: any;
}) => {
  const shippingData: any = useContext(ShippingDetailsContext);
  const with_serial = Number(item?.with_serial) === 1;
  const is_custom = Number(item?.is_custom) === 1;
  const shipping_item_quantity = Number(item?.shipping_item_quantity);
  const total_returned = Number(item?.total_returned);
  const { mutate } = useSWRConfig();
  const total_custom_returned = Number(item?.total_custom_returned) || 0;

  const onReset = async () => {
    const json = await resetItemApi(shippingData?._shipping_id, {
      shipping_return_item_id: item?.shipping_return_item_id,
    });
    if (json.success) {
      mutate(mutateIndex(shippingData?._shipping_id));
    }
  };

  if (is_custom && shippingData?.shipping_status === RETURNED) {
    return (
      <>
        {shipping_item_quantity > total_custom_returned && (
          <ItemMenu onClick={onReturn}>
            <CornerDownLeft {...iconProps("text-orange-600")} />
            <span className="font-medium">Return</span>
          </ItemMenu>
        )}
        {total_custom_returned > 0 && (
          <ItemMenu onClick={onReset}>
            <Undo2 {...iconProps("text-purple-600")} />
            <span className="font-medium">Reset</span>
          </ItemMenu>
        )}
      </>
    );
  }

  if (!with_serial && shippingData?.shipping_status === RETURNED) {
    return (
      <>
        {shipping_item_quantity > total_returned && (
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

export const NonSerializedOnShippedButton = ({
  onReport,
  item
}: {
  onReport: () => void;
  item: any
}) => {
  const shippingData: any = useContext(ShippingDetailsContext);

  if (shippingData?.shipping_status === SHIPPED && (item?.with_serial == 0 || item?.is_custom == 1)) {
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

export const NonSerializedOnActiveButton = ({
  onCompleted,
  item,
}: {
  onCompleted: () => void;
  item: any;
}) => {
  const shippingData: any = useContext(ShippingDetailsContext);
  const is_custom = item.is_custom == 1;

  const markCompletedOrIncompleted = () => {
    if (is_custom) {
      return item.custom_total_added == 1 ? "Incomplete" : "Complete";
    } 
    return Number(item.unserialized_total_added) ===
      Number(item.shipping_item_quantity)
      ? "Incomplete"
      : "Complete";
  };

  const iconMark = () => {
    const unserialized_total_added = Number(item.unserialized_total_added) || 0;
    const shipping_item_quantity = Number(item.shipping_item_quantity) || 0;
    const custom_total_added = Number(item.custom_total_added) || 0;

    if (is_custom) {
      if (custom_total_added === shipping_item_quantity) {
        return <X {...iconProps("text-red-600")} strokeWidth={3} />;
      }
      return <Check {...iconProps("text-green-600")} strokeWidth={3} />;
    }

    if (unserialized_total_added === shipping_item_quantity) {
      return <X {...iconProps("text-red-600")} strokeWidth={3} />;
    }

    return <Check {...iconProps("text-green-600")} strokeWidth={3} />;
  }
  

  if ((item?.with_serial == 0 || item?.is_custom == 1) && shippingData?.shipping_status === ACTIVE) {
    return (
      <ItemMenu onClick={onCompleted}>
        {iconMark()}
        <span className="font-medium">
          Mark as {markCompletedOrIncompleted()}
        </span>
      </ItemMenu>
    );
  }

  return <></>;
};

export const CommonOnActiveButton = ({
  item,
  onEdit,
  onDelete,
}: {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const shippingData: any = useContext(ShippingDetailsContext);
  const { mutate } = useSWRConfig();

  const onUncategorized = async () => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ 
          items: [{
            _item_id: item._item_id,
            shipping_item_id: item.shipping_item_id,
            shipping_category_id: null
          }] 
        })
      };
      const res = await fetch(`/api/shipping/${shippingData?._shipping_id}/item/update`, options);
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        mutate(mutateIndex(shippingData?._shipping_id));
      }
    }
    catch(err: any) {}
  };

  if (shippingData?.shipping_status === ACTIVE) {
    return (
      <>
        <ItemMenu onClick={onEdit}>
          <Pencil {...iconProps()} />
          <span className="font-medium">Edit</span>
        </ItemMenu>
        {item.shipping_category_id && (
          <ItemMenu onClick={onUncategorized}>
            <MinusCircle {...iconProps()} />
            <span className="font-medium">Uncategorized</span>
          </ItemMenu>
        )}
        <ItemMenu onClick={onDelete}>
          <Trash {...iconProps()} />
          <span className="font-medium">Delete</span>
        </ItemMenu>
      </>
    );
  }

  return <></>;
};
