import * as yup from "yup";

export const projectRoleSchema = yup.object({
  id: yup.string().optional(),
  project_role_name: yup.string().required("Field is required"),
});

export const projectRoleDocument = yup.object({
  project_role_id: yup.string(),
  ptdl_id: yup.array().required(),
});
