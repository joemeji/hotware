import * as yup from "yup";

export const categorySchema = yup.object({
    category_main_category: yup.string(),
    category_name: yup.string().required('Field is required'),
    category_description: yup.string()
})

export const updateListCategorySchema = yup.object({
    category_name: yup.string().required('Field is required'),
    category_desc: yup.string().nullable(),
    category_main_id: yup.string(),
    category_is_consumable: yup.string(),
    category_id: yup.string()
})