import { authHeaders, baseUrl } from "@/utils/api.config";

type Options = {
  headers: any;
};

export const getCreditNote = async (
  credit_note_id: string,
  options: Options
) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/projects/credits/${credit_note_id}`,
      {
        ...options,
      }
    );
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const previewPdf = async (_credit_note_id: any, access_token: any) => {
  const response = await fetch(
    `${baseUrl}/api/projects/credits/preview/${_credit_note_id}`,
    {
      headers: authHeaders(access_token),
    }
  );
  return response;
};
