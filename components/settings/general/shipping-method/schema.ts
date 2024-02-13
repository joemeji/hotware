
import * as yup from "yup";

export const shippingMethodSchema = yup.object({
  id: yup.string().optional(),
  shipping_method_name: yup.string().required('Field is required')
});