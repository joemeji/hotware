import { Input } from "@/components/ui/input";
import { PurchaseOrderDetailsContext } from "@/context/purchase-order-details-context";
import React, { memo, useContext, useState } from "react";
import CmsAddressSelect from "./CmsAddressSelect";
import CmsEmployeeSelect from "@/components/app/cms-employee-select";
import CmsSelect from "@/components/app/cms-select";

const CopyTo = ({
  onChangeValue,
  value,
  renderAddress,
  renderEmployee,
}: CopyToProps) => {
  const purchaseDetails: any = useContext(PurchaseOrderDetailsContext);
  const _po_copy_id = purchaseDetails ? purchaseDetails.po_copy_id : null;
  const [po_copy_id, set_po_copy_id] = useState(_po_copy_id);
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
                shipping_id={purchaseDetails && purchaseDetails._po_id}
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
        <div>
          <p className="mb-1">Contact Person</p>
          {renderEmployee}
        </div>
      </div>
    </React.Fragment>
  );
};

export function CopyAddressForm({
  copy_to_id,
  onChangeValue,
  value,
  error,
}: ChildFormProps) {
  return (
    <CmsAddressSelect
      cms_id={copy_to_id}
      value={value}
      onChangeValue={onChangeValue}
      error={error}
    />
  );
}

export function CopyEmployeeForm({
  copy_to_id,
  onChangeValue,
  value,
}: ChildFormProps) {
  return (
    <CmsEmployeeSelect
      cms_id={copy_to_id}
      onChangeValue={onChangeValue}
      value={value}
    />
  );
}

type ChildFormProps = {
  copy_to_id?: any;
  onChangeValue?: (id?: any) => void;
  value?: any;
  error?: any;
};

type CopyToProps = {
  onChangeValue?: (copy_to_id?: any) => void;
  value?: any;
  renderAddress?: React.ReactNode;
  renderEmployee?: React.ReactNode;
  error?: any;
};

export default memo(CopyTo);
