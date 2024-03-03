import * as yup from "yup";

export const LeaveCategoryFormSchema = yup.object({
  excuse_category_name: yup.string().required("Field is required"),
  excuse_category_color: yup.string().required("Field is required"),
});
export const LeaveFormSchema = yup.object({
  excuse_category: yup.string().required("Field is required"),
  country_id: yup.string().required("Field is required"),
  user_id: yup.array().optional(),
  excuse_from_date: yup.date().required("Field is required"),
  excuse_to_date: yup.date().required("Field is required"),
  excuse_reason: yup.string().required("Field is required"),
  all_technicians: yup.boolean().optional(),
});
