import * as yup from "yup";

export const projectTypeSchema = yup.object({
  id: yup.string().optional(),
  project_type_name: yup.string().required("Field is required"),
});
