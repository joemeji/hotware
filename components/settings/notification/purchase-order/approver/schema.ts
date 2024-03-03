import * as yup from "yup";

export const purchaseOrderApproverSchema = yup.object({
  id: yup.string().optional(),
  user_id: yup.number().required("Field is required"),
  is_default: yup.boolean().optional(),
});