import * as yup from "yup";

export const mainCategorySchema = yup.object({
    category_name: yup.string().required('Field is required'),
    category_desc: yup.string(),
    category_roles: yup.array(),
    category_with_prefix: yup.boolean()
})

export const updateMainCategorySchema = yup.object({
    category_name: yup.string().required('Field is required'),
    category_desc: yup.string(),
    category_roles: yup.array(),
    category_id: yup.string()
})