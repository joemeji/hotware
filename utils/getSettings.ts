import { authHeaders, baseUrl } from "./api.config";

export async function getSettings(access_token: any) {
  const response = await fetch(baseUrl + '/api/setting', {
    headers: { 
      ...authHeaders(access_token),
    }
  });
  return await response.json();
}