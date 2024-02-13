
import * as yup from "yup";

export const paymentTermsSchema = yup.object({
  id: yup.string().optional(),
  payment_terms_name: yup.string().required('Field is required'),
  payment_terms_days: yup.number().optional(),
  payment_terms_is_month_end: yup.boolean()
});