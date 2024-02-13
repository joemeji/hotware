import * as yup from "yup";

export const countrySchema = () => {
  return yup.object({
    id: yup.string().optional(),
    holiday_name: yup.string().required("Field is required"),
    holiday_every_year: yup.number(),
    countries: yup.array(),
    holiday_date: yup.string(),
    country_all: yup.boolean()
  });
};
