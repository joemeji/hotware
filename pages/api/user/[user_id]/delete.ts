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
  const { user_id } = req.query;

  if (req.method === "PUT") {
    const resp = await fetch(baseUrl + "/api/users/delete/" + user_id, {
      method: "PUT",
      headers: { ...authHeaders(access_token) },
    });

    const json = await resp.json();

    res.status(200).json(json);
  }
}
