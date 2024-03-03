import * as yup from "yup";

export const RequirementSchema = yup.object({
  id: yup.string().optional(),
  document_type_id: yup.string().optional(),
  document_category_name: yup.string().required("Field is required"),
});
