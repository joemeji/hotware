import * as yup from "yup";

export const offerSchema = yup.object({
  // Details
  offer_document_date: yup.date().nullable(),
  offer_description: yup.string().nullable(),
  offer_document_language: yup.string().nullable(),
  offer_currency: yup.number().required("Currency is required."),
  offer_is_exclusive_vat: yup.bool().nullable(),
  offer_shipping_method_id: yup.number().nullable(),
  offer_industry_id: yup.number().nullable(),
  offer_payment_terms_id: yup.number().nullable(),
  offer_order_probability: yup.number().nullable(),
  // Other Deatils
  offer_type: yup.string().nullable(),
  offer_document_link: yup.string().nullable(),
  offer_is_not_project: yup.bool().nullable(),
  offer_start_date: yup.date().nullable(),
  offer_end_date: yup
    .date()
    .nullable()
    .when("offer_start_date", (dates: any, schema: any) => {
      const startDate = dates[0];
      if (startDate) {
        const dayAfter = new Date(startDate.getTime());
        return schema.min(dayAfter, "End date has to be after than start date");
      }
      return schema;
    }),
  // Deliver to
  offer_delivery_id: yup.number().required("Offer Delivery is Required."),
  offer_delivery_address_id: yup.number().nullable(),
  offer_delivery_contact_id: yup.number().nullable(),
  // Invoice To
  offer_supplier_id: yup.number().required("Offer Invoice is Required."),
  offer_supplier_address_id: yup.number().nullable(),
  offer_supplier_contact_id: yup.number().nullable(),
  // Copy To
  offer_copy_id: yup.number().nullable(),
  offer_copy_address_id: yup.number().nullable(),
  offer_copy_contact_id: yup.number().nullable(),
});
