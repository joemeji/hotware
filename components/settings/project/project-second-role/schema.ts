import * as yup from "yup";

export const projectSecondRoleSchema = yup.object({
  id: yup.string().optional(),
  project_second_role_name: yup.string().required("Field is required"),
});
