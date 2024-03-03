import * as yup from "yup";

export const itemStatusSchema = yup.object({
  id: yup.string().optional(),
  user_id: yup.number().required("Field is required"),
});
