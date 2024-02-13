
import * as yup from "yup";

export const cmsDepartmentSchema = yup.object({
  id: yup.string().optional(),
  cms_department_name: yup.string().required('Field is required')
});