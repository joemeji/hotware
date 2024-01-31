import { authHeaders, baseUrl } from "@/utils/api.config";

type Options = {
  headers: any;
};

export const getInvoice = async (invoice_id: string, options: Options) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/projects/invoices/${invoice_id}`,
      {
        ...options,
      }
    );
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const previewPdf = async (_invoice_id: any, access_token: any) => {
  console.log(`invoices:` + _invoice_id);
  const response = await fetch(
    `${baseUrl}/api/projects/invoices/preview/${_invoice_id}`,
    {
      headers: authHeaders(access_token),
    }
  );
  return response;
};
