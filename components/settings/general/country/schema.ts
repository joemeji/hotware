import * as yup from "yup";

export const countrySchema = (isUpdate: boolean) => {
  const schema = {
    id: yup.string().optional(),
    country_name: yup.string().required("Field is required"),
    country_details_maximum_working_hrs_per_day: yup.string(),
    country_details_maximum_working_hrs_per_week: yup.string(),
    country_details_sunday_work_allowed: yup.boolean().optional(),
    country_details_installation_on_sunday: yup.boolean().optional(),
  };

  if (isUpdate) {
    schema.country_details_maximum_working_hrs_per_day =
      schema.country_details_maximum_working_hrs_per_day.required(
        "Field is required"
      );
    schema.country_details_maximum_working_hrs_per_week =
      schema.country_details_maximum_working_hrs_per_week.required(
        "Field is required"
      );
  }

  return yup.object(schema);
};
