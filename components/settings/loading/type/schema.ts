import * as yup from "yup";

export const loadingTypeSchema = yup.object({
  id: yup.string().optional(),
  loading_type_name: yup.string().required("Field is required"),
});
