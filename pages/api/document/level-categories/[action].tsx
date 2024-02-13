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

  const { action, id } = req.query;

  if (action == "all") {
    const response = await fetch(
      baseUrl + `/api/document/level-categories/all?document_level_id=${id}`,
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
    const response = await fetch(
      baseUrl + `/api/document/level-categories/create`,
      {
        headers: {
          ...authHeaders(access_token),
        },
        method: "POST",
        body: req.body,
      }
    );

    const json = await response.json();

    res.status(200).json(json);
  }

  if (action == "delete") {
    const response = await fetch(
      baseUrl + `/api/document/level-categories/delete`,
      {
        headers: {
          ...authHeaders(access_token),
        },
        method: "POST",
        body: req.body,
      }
    );

    const json = await response.json();

    res.status(200).json(json);
  }
}
