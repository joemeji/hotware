import * as yup from "yup";

export const roleSchema = yup.object({
  id: yup.string().optional(),
  role_name: yup.string().required("Field is required"),
  role_description: yup.string().optional(),
});

export const roleModuleSchema = yup.object({
  id: yup.string().optional(),
  role_module_id: yup.string().optional(),
  role_id: yup.number().required("Field is required"),
  module_id: yup.number().required("Field is required"),
});
