import * as yup from "yup";

export const creditSchema = yup.object({
  // Details
  credit_note_document_date: yup.date().nullable(),
  credit_note_description: yup.string().nullable(),
  credit_note_document_language: yup.string().nullable(),
  credit_note_currency: yup.number().required("Currency is required."),
  credit_note_is_exclusive_vat: yup.bool().nullable(),
  credit_note_shipping_method_id: yup.number().nullable(),
  credit_note_payment_terms_id: yup.number().nullable(),
  // Deliver to
  credit_note_delivery_id: yup
    .number()
    .required("credit_note Delivery is Required."),
  credit_note_delivery_address_id: yup.number().nullable(),
  credit_note_delivery_contact_id: yup.number().nullable(),
  // Invoice To
  credit_note_supplier_id: yup
    .number()
    .required("credit_note Invoice is Required."),
  credit_note_supplier_address_id: yup.number().nullable(),
  credit_note_supplier_contact_id: yup.number().nullable(),
  // Copy To
  credit_note_copy_id: yup.number().nullable(),
  credit_note_copy_address_id: yup.number().nullable(),
  credit_note_copy_contact_id: yup.number().nullable(),
});
