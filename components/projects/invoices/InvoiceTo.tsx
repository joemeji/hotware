import { InvoiceDetailsContext } from "@/context/invoice-details-content";
import React, { memo, useContext, useState } from "react";
import CmsAddressSelect from "./CmsAddressSelect";
import CmsEmployeeSelect from "@/components/app/cms-employee-select";
import CmsSelect from "@/components/app/cms-select";
import CmsVatSelect from "@/components/app/cms-vat-select";

const InvoiceTo = ({
  value,
  onChangeValue,
  renderAddress,
  renderEmployee,
  renderVat,
  error,
}: InvoiceToProps) => {
  const invoiceDetails: any = useContext(InvoiceDetailsContext);
  const _invoice_to_id = invoiceDetails ? invoiceDetails.supplier_cms_id : null;

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 relative">
        <div>
          <p className="mb-3 font-medium text-base">Invoice To:</p>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1">Company</p>
              <CmsSelect
                shipping_id={invoiceDetails && invoiceDetails._invoice_id}
                value={value}
                defaultValue={value}
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
        <div>
          <p className="mb-1">Vat</p>
          {renderVat}
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

export function InvoiceVatForm({
  invoice_to_id,
  onChangeValue,
  value,
}: ChildFormProps) {
  return (
    <CmsVatSelect
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
  onChangeValue?: (invoice_to_id?: any) => void;
  value?: any;
  renderAddress?: React.ReactNode;
  renderEmployee?: React.ReactNode;
  renderVat?: React.ReactNode;
  error?: any;
};
