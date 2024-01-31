import { Truck } from "lucide-react";
import { CompleteIncompleteStatus, MarkWrapper } from "../../shipping_id";
import React, { useContext } from "react";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { RETURNED } from "@/lib/shipping";

export default function CompletedMark({ item }: any) {
  let render = null;
  const shippingData: any = useContext(ShippingDetailsContext);
  const shipping_item_quantity = Number(item.shipping_item_quantity);
  const is_custom = Number(item.is_custom) === 1;
  const custom_total_added = Number(item.custom_total_added);
  const with_serial = Number(item.with_serial) === 1;
  const total_returned = Number(item.total_returned);
  let total_sn_returned = Number(item.total_sn_returned);
  const unserialized_total_added = Number(item.unserialized_total_added);
  const serial_number_total_added = Array.isArray(item?.serial_numbers) ? item.serial_numbers.length : 0;
  const total_custom_returned = Number(item?.total_custom_returned) || 0;

  if (!item) {
    render = <CompleteIncompleteStatus completed={false} />;
  }

  if (shippingData?.shipping_status === RETURNED) {
    total_sn_returned /= shipping_item_quantity;

    if (with_serial && total_sn_returned > 0 && shipping_item_quantity == total_sn_returned) {
      render = <CompleteIncompleteStatus completed={true} />;
    }

    if (!with_serial && total_returned > 0 && shipping_item_quantity == total_returned) {
      render = <CompleteIncompleteStatus completed={true} />;
    }

    if (is_custom && total_custom_returned === shipping_item_quantity) {
      render = <CompleteIncompleteStatus completed={true} />;
    }

    return (
      <StatusWrapper>
        {render || <CompleteIncompleteStatus completed={false} />}
      </StatusWrapper>
    );
  }

  if (is_custom && custom_total_added === shipping_item_quantity) {
    render = <CompleteIncompleteStatus completed={true} />;
  }

  if (with_serial && serial_number_total_added === shipping_item_quantity) {
    render = <CompleteIncompleteStatus completed={true} />;
  }

  if (!with_serial && unserialized_total_added === shipping_item_quantity) {
    render = <CompleteIncompleteStatus completed={true} />;
  }

  return (
    <StatusWrapper>
      {render || <CompleteIncompleteStatus completed={false} />}
    </StatusWrapper>
  );
}

function StatusWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-[150px] p-2 ps-12 flex items-center">{children}</div>
  );
}

export function ShippedMark() {
  return (
    <StatusWrapper>
      <MarkWrapper className="bg-transparent p-0">
        <Truck widths={20} height={20} className="text-red-500" />
      </MarkWrapper>
    </StatusWrapper>
  );
}
