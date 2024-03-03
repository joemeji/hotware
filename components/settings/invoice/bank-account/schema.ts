import * as yup from "yup";

export const bankAccountSchema = yup.object({
  id: yup.string().optional(),
  ba_bank_name: yup.string().required("Field is required"),
  ba_account_name: yup.string().required("Field is required"),
  ba_account_number: yup.string().required("Field is required"),
  ba_bank_code: yup.string().optional(),
});
