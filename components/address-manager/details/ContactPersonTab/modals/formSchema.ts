import * as yup from "yup";

export const yupSchema = yup.object({
  cms_address_id: yup.string().required("Location is required"),
  cms_employee_firstname: yup.string(),
  cms_employee_lastname: yup.string(),
  cms_employee_email: yup.string(),
  cms_employee_phone_number: yup.string(),
  cms_employee_mobile_number: yup.string(),
  cms_position_id: yup.mixed(),
  cms_department_id: yup.mixed(),
  cms_employee_christmas: yup.mixed(),
  cms_employee_exhibition: yup.mixed(),
  cms_employee_decision: yup.mixed(),
});
