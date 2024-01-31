import * as yup from "yup";

export const deliverySchema = yup.object({
  // Details
  delivery_note_document_date: yup.date().nullable(),
  delivery_note_description: yup.string().nullable(),
  delivery_note_document_language: yup.string().nullable(),
  delivery_note_currency: yup.number().required("Currency is required."),
  delivery_note_is_exclusive_vat: yup.bool().nullable(),
  delivery_note_automatic_weight_calculation: yup.bool().nullable(),
  delivery_note_shipping_method_id: yup.number().nullable(),
  delivery_note_industry_id: yup.number().nullable(),
  delivery_note_payment_terms_id: yup.number().nullable(),
  delivery_note_net_weight: yup.number().nullable(),
  delivery_note_total_weight: yup.number().nullable(),
  // Other Deatils
  delivery_note_type: yup.string().nullable(),
  delivery_note_document_link: yup.string().nullable(),
  delivery_note_is_not_project: yup.bool().nullable(),
  delivery_note_start_date: yup.date().nullable(),
  delivery_note_end_date: yup
    .date()
    .nullable()
    .when("delivery_note_start_date", (dates: any, schema: any) => {
      const startDate = dates[0];
      if (startDate) {
        const dayAfter = new Date(startDate.getTime());
        return schema.min(dayAfter, "End date has to be after than start date");
      }
      return schema;
    }),
  // Deliver to
  delivery_note_delivery_id: yup.number().required("Delivery To is required."),
  delivery_note_delivery_address_id: yup.number().nullable(),
  delivery_note_delivery_contact_id: yup.number().nullable(),
  // Invoice To
  delivery_note_supplier_id: yup.number().required("Invoice To is required."),
  delivery_note_supplier_address_id: yup.number().nullable(),
  delivery_note_supplier_contact_id: yup.number().nullable(),
  // Copy To
  delivery_note_copy_id: yup.number().nullable(),
  delivery_note_copy_address_id: yup.number().nullable(),
  delivery_note_copy_contact_id: yup.number().nullable(),
});
