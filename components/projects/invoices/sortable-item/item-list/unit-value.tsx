import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { formatter } from "@/utils/text";
import { useContext } from "react";

export default function UnitValue({item}: any) {
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const shipping_currency = shippingDetails ? shippingDetails.currency : '';

  return (
    <div className="w-[215px] p-2 text-right">
      <span className="text-sm">
        {shippingDetails ? formatter(shipping_currency).format(item.shipping_item_unit_value) : 0}
        {/* {shippingDetails ? item.shipping_item_unit_value : 0} */}
      </span>
    </div>
  );
}