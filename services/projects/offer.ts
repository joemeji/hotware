import { authHeaders, baseUrl } from "@/utils/api.config";

type Options = {
  headers: any;
};

export const getOffer = async (offer_id: string, options: Options) => {
  try {
    const response = await fetch(`${baseUrl}/api/projects/offers/${offer_id}`, {
      ...options,
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const previewPdf = async (_offer_id: any, access_token: any) => {
  const response = await fetch(
    `${baseUrl}/api/projects/offers/preview/${_offer_id}`,
    {
      headers: authHeaders(access_token),
    }
  );
  return response;
};
