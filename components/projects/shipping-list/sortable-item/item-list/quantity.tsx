import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { RETURNED } from "@/lib/shipping";
import { useContext } from "react";

export default function Quantity({ item }: any) {
  const shippingData: any = useContext(ShippingDetailsContext);
  const serial_number_total_added = Array.isArray(item?.serial_numbers) ? item.serial_numbers.length : 0;

  const totalAdded = () => {
    let total_sn_returned = Number(item.total_sn_returned);
    let total_returned = Number(item.total_returned);
    let shipping_item_quantity = Number(item.shipping_item_quantity);
    const with_serial = Number(item.with_serial) === 1;

    if (item?.item_set_id) {
      shipping_item_quantity = Number(item.item_set_list_quantity);
    }

    if (shippingData?.shipping_status == RETURNED) {
      if (with_serial) {
        total_sn_returned /= shipping_item_quantity;
        return total_sn_returned;
      }
      if (!with_serial) {
        return total_returned;
      }
    }
    
    if (with_serial) {
      return serial_number_total_added;
    }

    if (!with_serial) {
      return Number(item.unserialized_total_added);
    }
    return 0;
  };

  const quantityStatus = () => {
    let shipping_item_quantity = Number(item.shipping_item_quantity);

    if (item?.item_set_id) {
      shipping_item_quantity = Number(item.item_set_list_quantity);
    }

    if (item.is_custom == 1) {
      return (
        <>
          <span className="font-bold">
            {item.custom_total_added || 0}
          </span>{Number(item.custom_total_added) !== Number(item.shipping_item_quantity) && '/' +shipping_item_quantity}
        </>
      );
    }
    return (
      <>
        <span className="font-bold">
          {totalAdded()}
        </span>{totalAdded() !== Number(shipping_item_quantity) && '/' +shipping_item_quantity}
      </>
    );
  }

  return (
    <div className="w-[100px] p-2 text-right">
      {quantityStatus()}
    </div>
  );
}