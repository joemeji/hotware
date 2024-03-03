import * as yup from "yup";

export default yup.object({
  item_main_category_id: yup.string().required("This field is required"),
  item_category_id: yup.string().required("This field is required"),
  item_sub_category_id: yup.string().required("This field is required"),
  item_name: yup.string().required("This field is required"),
  item_description: yup.string(),
  item_unit: yup.string(),
  item_weight: yup
    .number()
    .typeError("Weight must be a number")
    .min(0, "Weight must be a positive number."),
  item_height: yup
    .number()
    .typeError("Height must be a number")
    .min(0, "Height must be a positive number."),
  item_length: yup
    .number()
    .typeError("Length must be a number")
    .min(0, "Length must be a positive number."),
  item_width: yup
    .number()
    .typeError("Width must be a number")
    .min(0, "Width must be a positive number."),
  item_used_value: yup
    .number()
    .typeError("Value must be a number")
    .min(0, "Value must be a positive number."),
  item_new_value: yup
    .number()
    .typeError("Value must be a number")
    .min(0, "Value must be a positive number."),
  item_hs_code: yup.string(),
  has_serial_number: yup.boolean(),
  equipment_category: yup.boolean(),
  item_quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .min(0, "Quantity must be a positive number."),
  item_warehouse: yup.string().required("This field is required"),
  item_origin: yup.string(),
});
