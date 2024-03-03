import * as yup from "yup";

export const dueInvoicesSchema = yup.object({
  id: yup.string().optional(),
  user_id: yup.number().required("Field is required"),
});
