import * as yup from "yup";

export const documentLanguageSchema = yup.object({
  id: yup.string().optional(),
  document_language_name: yup.string().required("Field is required"),
});
