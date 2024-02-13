import * as yup from "yup";

export const reqLevelSchema = yup.object({
  id: yup.string().optional(),
  document_level_name: yup.string().required("Field is required"),
});

export const addDocumentSchema = yup.object({
  id: yup.string().optional(),
  document_level_id: yup.string().optional(),
  document_type: yup.string().required("Please select a Document Type"),
  document_level_category_id: yup.array().required("Field is required"),
});
