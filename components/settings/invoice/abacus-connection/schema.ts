import * as yup from "yup";

export const AbacusConnectionSchema = yup.object({
  id: yup.string().optional(),
  company_id: yup.number().required("Field is required"),
  is_abacus_number: yup.string().required("Field is required"),
  company_base_currency: yup.number().required("Field is required"),
});
