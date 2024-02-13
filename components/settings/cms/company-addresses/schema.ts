import * as yup from "yup";

export const addCmsOwner = yup.object({
  cms_id: yup.string(),
});
