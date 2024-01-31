import { authHeaders, baseUrl } from "@/utils/api.config";

type Options = {
  headers: any;
};

export const getDeliveryNote = async (
  delivery_note_id: string,
  options: Options
) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/projects/deliveries/${delivery_note_id}`,
      {
        ...options,
      }
    );
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const previewPdf = async (_delivery_id: any, access_token: any) => {
  const response = await fetch(
    `${baseUrl}/api/projects/deliveries/preview/${_delivery_id}`,
    {
      headers: authHeaders(access_token),
    }
  );
  return response;
};
