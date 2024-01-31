import { PurchaseOrderDetailsContext } from "@/context/purchase-order-details-context";
import React, { memo, useContext, useState } from "react";
import CmsAddressSelect from "./CmsAddressSelect";
import CmsEmployeeSelect from "@/components/app/cms-employee-select";
import CmsSelect from "@/components/app/cms-select";

const InvoiceTo = ({
  value,
  onChangeValue,
  renderAddress,
  renderEmployee,
  error,
}: InvoiceToProps) => {
  const purchaseDetails: any = useContext(PurchaseOrderDetailsContext);
  const _invoice_to_id = purchaseDetails
    ? purchaseDetails.supplier_cms_id
    : null;

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 relative">
        <div>
          <p className="mb-3 font-medium text-base">Invoice To:</p>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1">Company</p>
              <CmsSelect
                shipping_id={purchaseDetails && purchaseDetails._po_id}
                value={value}
                onChangeValue={onChangeValue}
                error={error}
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

export function InvoiceAddressForm({
  invoice_to_id,
  onChangeValue,
  value,
  error,
}: ChildFormProps) {
  return (
    <CmsAddressSelect
      cms_id={invoice_to_id}
      value={value}
      onChangeValue={onChangeValue}
      error={error}
    />
  );
}

export function InvoiceEmployeeForm({
  invoice_to_id,
  onChangeValue,
  value,
}: ChildFormProps) {
  return (
    <CmsEmployeeSelect
      cms_id={invoice_to_id}
      onChangeValue={onChangeValue}
      value={value}
    />
  );
}

export default memo(InvoiceTo);

type ChildFormProps = {
  invoice_to_id?: any;
  onChangeValue?: (id?: any) => void;
  value?: any;
  error?: any;
};

type InvoiceToProps = {
  onChangeValue?: (deliver_to_id?: any) => void;
  value?: any;
  renderAddress?: React.ReactNode;
  renderEmployee?: React.ReactNode;
  error?: any;
};
