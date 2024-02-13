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

  const { action } = req.query;

  if (action == "all") {
    const response = await fetch(baseUrl + `/api/document/type/all`, {
      headers: {
        ...authHeaders(access_token),
      },
    });
    const json = await response.json();

    res.status(200).json(json);
  }
}
