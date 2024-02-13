import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;

  const { action, page, search, id } = req.query;

  if (action == "paginate") {
    const response = await fetch(
      baseUrl + `/api/project/task/paginate?page=${page}&search=${search}`,
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
    const response = await fetch(baseUrl + `/api/project/task/create`, {
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
    const response = await fetch(baseUrl + `/api/project/task/update`, {
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
    const response = await fetch(baseUrl + `/api/project/task/info/${id}`, {
      headers: {
        ...authHeaders(access_token),
      },
    });
    const json = await response.json();

    res.status(200).json(json);
  }

  if (action == "archives") {
    const response = await fetch(baseUrl + `/api/project/task/archives`, {
      headers: {
        ...authHeaders(access_token),
      },
    });
    const json = await response.json();

    res.status(200).json(json);
  }

  if (action == "delete") {
    const response = await fetch(baseUrl + `/api/project/task/delete`, {
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
