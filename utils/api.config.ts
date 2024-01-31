import jwt_decode from "jwt-decode";

export const baseUrl = process.env.API_ENDPOINT || "https://api.hotwork.ag";

const URL = process.env.BASE_URL || "https://hotware.vercel.app";

export function authHeaders(token: any, fileUpload = false) {
  const headers: object | any = {};

  if (!fileUpload) {
    headers["Content-Type"] = "application/json";
  }

  if (typeof token === "string") {
    headers["Authorization"] = "Bearer " + token;
  }

  if (token && typeof token === "object") {
    headers["Authorization"] = "Bearer " + token.access_token;
  }

  return headers;
}

export async function appClientFetch({
  url,
  options = {},
  authStatus,
}: {
  url: string;
  options?: any;
  authStatus: string | any;
}) {
  if (authStatus === "loading") {
    return {
      status: "authenticating",
    };
  }
  if (authStatus === "unauthenticated") {
    return {
      status: "unauthenticated",
    };
  }
  if (options.headers && options.headers["Authorization"]) {
    const [, token] = options.headers["Authorization"].split("Bearer ");
    const decodedToken: any = jwt_decode(token);
    if (
      decodedToken &&
      decodedToken.exp &&
      Date.now() >= decodedToken.exp * 1000
    ) {
      return {
        status: "unauthorized",
      };
    }
  }
  const res = await fetch(baseUrl + url, options);
  return res;
}

export const fetchApi = async ([url, token]: any) => {
  const res = await fetch(baseUrl + url, {
    headers: { Authorization: "Bearer " + token },
  });

  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const fetcher = (url: any) => fetch(URL + url).then((res) => res.json());
