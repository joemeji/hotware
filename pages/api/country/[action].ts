import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { authHeaders, baseUrl } from "@/utils/api.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action, page, search, id } = req.query;

  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;

  if (action === "all") {
    const resp = await fetch(baseUrl + `/api/country/all?search=${search}`, {
      headers: { ...authHeaders(access_token) },
    });
    const json = await resp.json();
    res.json(json);
  }

  if (action == "paginate") {
    const response = await fetch(
      baseUrl + `/api/country/paginate?page=${page}&search=${search}`,
      {
        headers: {
          ...authHeaders(access_token),
        },
      }
    );
    const json = await response.json();

    res.status(200).json(json);
  }

  if (action == "create") {
    const response = await fetch(baseUrl + `/api/country/create`, {
      headers: {
        ...authHeaders(access_token),
      },
      method: "POST",
      body: req.body,
    });

    const json = await response.json();

    res.status(200).json(json);
  }

  if (action == "update") {
    const response = await fetch(baseUrl + `/api/country/update`, {
      headers: {
        ...authHeaders(access_token),
      },
      method: "POST",
      body: req.body,
    });

    const json = await response.json();

    res.status(200).json(json);
  }

  if (action == "info") {
    const response = await fetch(baseUrl + `/api/country/info/${id}`, {
      headers: {
        ...authHeaders(access_token),
      },
    });
    const json = await response.json();

    res.status(200).json(json);
  }

  if (action == "delete") {
    const response = await fetch(baseUrl + `/api/country/delete`, {
      headers: {
        ...authHeaders(access_token),
      },
      method: "POST",
      body: req.body,
    });

    const json = await response.json();

    res.status(200).json(json);
  }
}
