import * as yup from "yup";

export const itemStockSchema = yup.object({
  id: yup.string().optional(),
  user_id: yup.number().required("Field is required"),
});
