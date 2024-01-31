import { baseUrl } from "@/utils/api.config";

type Options = {
  headers: any;
};

export const getPurchaseOrder = async (po_id: string, options: Options) => {
  try {
    const response = await fetch(`${baseUrl}/api/purchases/${po_id}`, {
      ...options,
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};
