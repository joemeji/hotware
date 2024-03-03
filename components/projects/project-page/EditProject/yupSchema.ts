import * as yup from "yup";

export default yup.object({
  project_name: yup.string().required("Project name is required."),
  project_offer_number: yup.string(),
  project_offer_date: yup.string(),
  project_po_number: yup.string(),
  project_po_date: yup.string(),
  project_type_id: yup.string(),
  project_man_power: yup.string(),
  project_origin_of_equipment: yup.string(),
  project_factory_place: yup.string(),
  document_link: yup.string(),
  requirementsLevel: yup.mixed(),
  cms_id1: yup.string(),
  cms_address_id1: yup.string(),
  cms_employee_id1: yup.string(),
  cms_id2: yup.string(),
  cms_address_id2: yup.string(),
  cms_employee_id2: yup.string(),
  project_travelling_date: yup.string(),
  project_travelling_days: yup
    .number()
    .typeError("")
    .integer()
    .nullable()
    .moreThan(-1, "Days must be a positive number."),
  project_installation_date: yup.string(),
  project_installation_days: yup
    .number()
    .typeError("")
    .integer()
    .nullable()
    .moreThan(-1, "Days must be a positive number."),
  project_dismantling_date: yup.string(),
  project_dismantling_days: yup
    .number()
    .typeError("")
    .integer()
    .nullable()
    .moreThan(-1, "Days must be a positive number."),
  project_travelling_back_date: yup.string(),
  project_travelling_back_days: yup
    .number()
    .typeError("")
    .integer()
    .nullable()
    .moreThan(-1, "Days must be a positive number."),
  project_working_days: yup
    .number()
    .typeError("")
    .integer()
    .nullable()
    .moreThan(-1, "Days must be a positive number."),
  project_start_date: yup.string(),
  project_end_date: yup.string(),
  scopes: yup.mixed(),
  contacts: yup.mixed(),
  project_additional_notes: yup.string(),
});
