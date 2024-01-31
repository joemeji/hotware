import { Button } from "@/components/ui/button";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { cn } from "@/lib/utils";
import {
  mutateIndex,
  resetItemApi,
  returnItemApi,
} from "@/services/shipping/item";
import { mutateIndex as mutateIndexSet } from "@/services/shipping/set";
import { deleteSerialNumberApi } from "@/services/shipping/serialNumber";
import { AlertTriangle, CornerDownLeft, Trash, Undo2 } from "lucide-react";
import { useContext, useState } from "react";
import { useSWRConfig } from "swr";

const buttonClassName = "py-1.5 px-2 flex gap-2 items-center";

export const ShippedButton = ({
  serial_number,
  onClick,
}: {
  serial_number?: any;
  onClick?: () => void;
}) => {
  return (
    <Button variant={"ghost"} className={cn(buttonClassName)} onClick={onClick}>
      <AlertTriangle
        strokeWidth={1}
        className="w-[18px] h-[18px] text-red-600"
      />
      Report
    </Button>
  );
};

export const ReturnedButton = ({ serial_number }: { serial_number?: any }) => {
  const [loading, setLoading] = useState(false);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const { mutate } = useSWRConfig();

  const onReturn = async () => {
    try {
      setLoading(true);
      const json = await returnItemApi(shippingDetails?._shipping_id, {
        shipping_item_id: serial_number?.shipping_item_id,
        return_quantity: 1,
        shipping_item_details_id: serial_number?.shipping_item_details_id,
      });
      if (json.success) {
        mutate(mutateIndex(shippingDetails?._shipping_id));
        mutate(
          mutateIndexSet(
            shippingDetails?._shipping_id,
            serial_number?.shipping_item_id
          )
        );
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
    }
  };

  if (serial_number?.shipping_return_item_quantity) {
    return <></>;
  }

  return (
    <Button
      variant={"ghost"}
      className={cn(buttonClassName, loading && "loading")}
      disabled={loading}
      onClick={onReturn}
    >
      <CornerDownLeft
        strokeWidth={1}
        className="w-[18px] h-[18px] text-orange-600"
      />
      Return
    </Button>
  );
};

export const ResetReturnedButton = ({
  serial_number,
}: {
  serial_number?: any;
}) => {
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  const onReset = async () => {
    try {
      setLoading(true);
      const json = await resetItemApi(shippingDetails?._shipping_id, {
        shipping_return_item_id: serial_number.shipping_return_item_id,
      });
      if (json.success) {
        mutate(
          mutateIndexSet(
            shippingDetails?._shipping_id,
            serial_number?.shipping_item_id
          )
        );
        mutate(mutateIndex(shippingDetails?._shipping_id));
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!serial_number?.shipping_return_item_quantity) {
    return <></>;
  }

  return (
    <Button
      variant={"ghost"}
      className={cn(loading && "loading", buttonClassName)}
      onClick={onReset}
    >
      <Undo2 strokeWidth={1} className="w-[18px] h-[18px] text-purple-600" />
      Reset
    </Button>
  );
};

export const RemoveButton = ({ serial_number }: { serial_number?: any }) => {
  const [loading, setLoading] = useState(false);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const { mutate } = useSWRConfig();

  const onDelete = async () => {
    try {
      setLoading(true);
      const json = await deleteSerialNumberApi({
        shipping_item_details_id: serial_number.shipping_item_details_id,
        shipping_item_id: serial_number.shipping_item_id,
        _shipping_id: shippingDetails?._shipping_id,
      });
      if (json.success) {
        setLoading(false);
        mutate(
          mutateIndexSet(
            shippingDetails?._shipping_id,
            serial_number?.shipping_item_id
          )
        );
        mutate(mutateIndex(shippingDetails?._shipping_id));
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={"ghost"}
      className={cn(buttonClassName, loading && "loading")}
      onClick={onDelete}
      disabled={loading}
    >
      <Trash strokeWidth={1} className="text-red-600 w-[18px] h-[18px]" />
      Remove
    </Button>
  );
};
