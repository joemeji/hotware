
import * as yup from "yup";

export const cmsIndustrySchmea = yup.object({
  id: yup.string().optional(),
  cms_industry_name: yup.string().required('Field is required')
});