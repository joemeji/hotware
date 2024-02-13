import * as yup from "yup";

export const taskSchema = yup.object({
  task_name: yup.string().nullable(),
  task_priority_level: yup.string(),
  due_date: yup.string().nullable(),
});
