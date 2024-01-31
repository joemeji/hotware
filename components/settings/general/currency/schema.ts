
import * as yup from "yup";

export const currencySchema = yup.object({
  id: yup.string().optional(),
  currency: yup.string().required('Field is required'),
  currency_name: yup.string().required('Field is required'),
  currency_sign: yup.string().required('Field is required'),
  chf_value: yup.number().required('Field is required'),
})