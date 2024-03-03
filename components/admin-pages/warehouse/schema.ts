import * as yup from "yup";

export const WarehouseFormSchema = yup.object({
  id: yup.string().optional(),
  company_id: yup.string().optional(),
  warehouse_name: yup.string().required('Field is required'),
  warehouse_location: yup.string().required('Field is required'),
  warehouse_country: yup.string().optional(),
});

export interface WarehouseSchema {
    warehouse_id: any;
    company_id: string;
    company_name: string;
    warehouse_name: string;
    warehouse_location: string;
    warehouse_country: string;
};
