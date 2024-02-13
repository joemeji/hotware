
import * as yup from "yup";

export const vatSchema = yup.object({
  id: yup.string().optional(),
  vat_code: yup.string().optional(),
  vat_description: yup.string().required("Field is requried"),
  vat_percentage: yup.number().optional(),
  vat_country: yup.string().required('Field is required'),
  vat_account: yup.string().optional(),
});