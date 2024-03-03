import * as yup from "yup";

export const administrativeReminderSchema = yup.object({
  id: yup.string().optional(),
  user_id: yup.number().required("Field is required"),
  administrative_reminder_initial: yup.string().required("Field is required"),
});
