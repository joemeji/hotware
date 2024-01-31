import * as yup from "yup";

export const orderSchema = yup.object({
  // Details
  order_confirmation_document_date: yup.date().nullable(),
  order_confirmation_description: yup.string().nullable(),
  order_confirmation_document_language: yup.string().nullable(),
  order_confirmation_currency: yup.number().required("Currency is required."),
  order_confirmation_is_exclusive_vat: yup.bool().nullable(),
  order_confirmation_with_delivery_date: yup.bool().nullable(),
  order_confirmation_delivery_date: yup.date().nullable(),
  order_confirmation_shipping_method_id: yup.number().nullable(),
  order_confirmation_industry_id: yup.number().nullable(),
  order_confirmation_payment_terms_id: yup.number().nullable(),
  order_confirmation_purchase_order_number: yup
    .string()
    .required("Purchase order number is required."),
  order_confirmation_purchase_order_date: yup
    .date()
    .required("Document Date is required."),
  order_confirmation_purchase_order_file: yup.mixed().nullable(),
  // Other Deatils
  order_confirmation_type: yup.string().nullable(),
  order_confirmation_document_link: yup.string().nullable(),
  order_confirmation_is_not_project: yup.bool().nullable(),
  order_confirmation_start_date: yup.date().nullable(),
  order_confirmation_end_date: yup
    .date()
    .nullable()
    .when("order_confirmation_start_date", (dates: any, schema: any) => {
      const startDate = dates[0];
      if (startDate) {
        const dayAfter = new Date(startDate.getTime());
        return schema.min(dayAfter, "End date has to be after than start date");
      }
      return schema;
    }),
  // Deliver to
  order_confirmation_delivery_id: yup
    .number()
    .required("Delivery To is required."),
  order_confirmation_delivery_address_id: yup.number().nullable(),
  order_confirmation_delivery_contact_id: yup.number().nullable(),
  // Invoice To
  order_confirmation_supplier_id: yup
    .number()
    .required("Invoice To is required."),
  order_confirmation_supplier_address_id: yup.number().nullable(),
  order_confirmation_supplier_contact_id: yup.number().nullable(),
  order_confirmation_supplier_vat_id: yup.number().nullable(),
  // Copy To
  order_confirmation_copy_id: yup.number().nullable(),
  order_confirmation_copy_address_id: yup.number().nullable(),
  order_confirmation_copy_contact_id: yup.number().nullable(),
});
