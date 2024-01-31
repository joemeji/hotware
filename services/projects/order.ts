import { authHeaders, baseUrl } from "@/utils/api.config";

type Options = {
  headers: any;
};

export const getOrderConfirmation = async (
  order_confirmation_id: string,
  options: Options
) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/projects/orders/${order_confirmation_id}`,
      {
        ...options,
      }
    );
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const previewPdf = async (_oc_id: any, access_token: any) => {
  const response = await fetch(
    `${baseUrl}/api/projects/orders/preview_pdf/${_oc_id}`,
    {
      headers: authHeaders(access_token),
    }
  );
  return response;
};
