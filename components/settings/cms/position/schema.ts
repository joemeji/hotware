
import * as yup from "yup";

export const cmsPositionSchema = yup.object({
  id: yup.string().optional(),
  cms_position_name: yup.string().required('Field is required')
});