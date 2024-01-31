import * as yup from "yup";

export const invoiceSchema = yup.object({
  // Details
  invoice_document_date: yup.date().nullable(),
  invoice_description: yup.string().nullable(),
  invoice_purchase_order_number: yup
    .string()
    .required("PO Number is required."),
  invoice_purchase_order_number_file: yup.mixed().nullable(),
  invoice_document_language: yup.string().nullable(),
  invoice_currency: yup.number().required("Currency is required."),
  invoice_is_exclusive_vat: yup.bool().nullable(),
  invoice_goods_from_germany: yup.bool().nullable(),
  invoice_shipping_method_id: yup.number().nullable(),
  invoice_industry_id: yup.number().nullable(),
  invoice_payment_terms_id: yup.number().nullable(),
  // Other Deatils
  invoice_type: yup.string().nullable(),
  invoice_document_link: yup.string().nullable(),
  invoice_is_not_project: yup.bool().nullable(),
  invoice_start_date: yup.date().nullable(),
  invoice_end_date: yup
    .date()
    .nullable()
    .when("invoice_start_date", (dates: any, schema: any) => {
      const startDate = dates[0];
      if (startDate) {
        const dayAfter = new Date(startDate.getTime());
        return schema.min(dayAfter, "End date has to be after than start date");
      }
      return schema;
    }),
  // Deliver to
  invoice_delivery_id: yup.number().required("invoice Delivery is Required."),
  invoice_delivery_address_id: yup.number().nullable(),
  invoice_delivery_contact_id: yup.number().nullable(),
  // Invoice To
  invoice_supplier_id: yup.number().required("invoice Invoice is Required."),
  invoice_supplier_address_id: yup.number().nullable(),
  invoice_supplier_contact_id: yup.number().nullable(),
  invoice_supplier_vat_id: yup.number().nullable(),
  // Copy To
  invoice_copy_id: yup.number().nullable(),
  invoice_copy_address_id: yup.number().nullable(),
  invoice_copy_contact_id: yup.number().nullable(),
});
