import * as yup from "yup";

export const textBlockSchema = yup.object({
  id: yup.string().optional(),
  text_block_title: yup.string().required("Field is required"),
  text_block_text: yup.string().optional(),
  text_block_extra_text: yup.string().optional(),
});

export const addVatDocument = yup.object({
  company_vat_type: yup.string().optional(),
});
