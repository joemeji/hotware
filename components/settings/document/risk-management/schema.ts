import * as yup from "yup";

export const riskManagementSchema = yup.object({
  id: yup.string().optional(),
  risk_management_name: yup.string().required("Field is required"),
});
