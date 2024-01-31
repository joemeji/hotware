
import * as yup from "yup";

export const subcategorySchema = yup.object({
    category_id: yup.string(),
    subcategory_name: yup.string().required('Field is required'),
    subcategory_description: yup.string(),
    subcategory_name_prefix: yup.string()
})

export const updateListSubcategorySchema = yup.object({
    subcategory_name: yup.string().required('Field is required'),
    subcategory_desc: yup.string().nullable(),
    subcategory_main_id: yup.string(),
    subcategory_id: yup.string(),
    subcategory_prefix: yup.string()
})