import * as yup from "yup";

export const loadingWorkSchema = yup.object({
  id: yup.string().optional(),
  loading_work_name: yup.string().required("Field is required"),
});
