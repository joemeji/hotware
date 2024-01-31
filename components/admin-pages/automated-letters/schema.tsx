import * as yup from "yup";

export const automatedLetterSchema = yup.object({
  signatory: yup.string(),
  letter_type: yup.string(),
  employee: yup.string(),
  employee_type: yup.string(),
  designation: yup.string(),
  identity: yup.string(),
  language: yup.string(),
  client: yup.string(),
  client_location: yup.string(),
  start_date: yup.date(),
  return_date: yup.date(),
  purpose: yup.string(),
  job: yup.string(),
  embassy: yup.string(),
  country: yup.string(),
  letter_date_from: yup.date(),
  letter_date_to: yup.date(),
  salary_reduct_from: yup.date(),
  salary_reduct_to: yup.date(),
  date_from: yup.date(),
  date_to: yup.date()
})