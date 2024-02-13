import * as yup from "yup";

export const taskSchema = yup.object({
  id: yup.string().optional(),
  task_category: yup.string().required("Please select a category"),
  task_name: yup.string().required("Field is required"),
  task_description: yup.string().optional(),
  task_priority_level: yup.string().optional(),
  due_date: yup.string().optional(),
});

export const taskTriggerSchema = yup.object({
  id: yup.string().optional(),
  user_id: yup.array().optional(),
  trigger_id: yup.array().optional(),
});
