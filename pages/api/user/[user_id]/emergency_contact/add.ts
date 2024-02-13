import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;
  const { user_id } = req.query;

  if (req.method === "POST") {
    const resp = await fetch(
      baseUrl + "/api/users/emergency_contact/add/" + user_id,
      {
        method: "POST",
        headers: { ...authHeaders(access_token) },
        body: req.body,
      }
    );

    const json = await resp.json();

    res.status(200).json(json);
  }
}
