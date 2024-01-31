import * as yup from "yup";

export const purchaseSchema = yup.object({
  // Details
  po_document_date: yup.date().nullable(),
  po_description: yup.string().nullable(),
  po_document_language: yup.string().nullable(),
  po_currency: yup.number().required("Currency is required."),
  po_is_exclusive_vat: yup.bool().nullable(),
  po_shipping_method_id: yup.number().nullable(),
  po_payment_terms_id: yup.number().nullable(),
  po_project_id: yup.number().nullable(),
  po_approver_id: yup.number().nullable(),
  po_remarks: yup.string().nullable(),
  po_delivery_date: yup.date().nullable(),
  po_reference_number: yup.string().nullable(),
  // Deliver to
  po_delivery_id: yup.number().required("Delivery To is required."),
  po_delivery_address_id: yup.number().nullable(),
  po_delivery_contact_id: yup.number().nullable(),
  // Invoice To
  po_supplier_id: yup.number().required("Invoice To is required."),
  po_supplier_address_id: yup.number().nullable(),
  po_supplier_contact_id: yup.number().nullable(),
  // Copy To
  po_copy_id: yup.number().nullable(),
  po_copy_address_id: yup.number().nullable(),
  po_copy_contact_id: yup.number().nullable(),
});
