import { Input } from "@/components/ui/input";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import React, { memo, useContext, useState } from "react";
import CmsAddressSelect from "./CmsAddressSelect";
import CmsSelect from "@/components/app/cms-select";

const CopyTo = ({ onChangeValue, value, renderAddress }: CopyToProps) => {
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const _shipping_copy_id = shippingDetails ? shippingDetails.shipping_copy_id : null;
  const [shipping_copy_id, set_shipping_copy_id] = useState(_shipping_copy_id);
  const [cms_address, set_cms_address] = useState<any>(null);

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 relative">
        <div>
          <p className="mb-3 font-medium text-base">Copy To:</p>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1">Company</p>
              <CmsSelect 
                shipping_id={shippingDetails && shippingDetails._shipping_id}
                value={value} 
                onChangeValue={onChangeValue}
                />
            </div>
            <div>
            <p className="mb-1">Location</p>
              {renderAddress}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export function CopyAddressForm({ shipping_copy_id, value, onChangeValue }: CopyAddressFormProps) {
  return (
    <CmsAddressSelect 
      cms_id={shipping_copy_id}
      value={value}
      onChangeValue={onChangeValue}
    />
  );
}

type CopyAddressFormProps = {
  shipping_copy_id?: any
  value?: any
  onChangeValue?: (value?: any) => void
}

type CopyToProps = {
  onChangeValue?: (copy_id?: any) => void
  value?: any
  renderAddress?: React.ReactNode
}

export default memo(CopyTo);