import { authHeaders, baseUrl } from "@/utils/api.config";

export const previewPdf = async (_po_id: any, access_token: any) => {
  const response = await fetch(`${baseUrl}/api/purchases/preview/${_po_id}`, {
    headers: authHeaders(access_token),
  });
  return response;
};
