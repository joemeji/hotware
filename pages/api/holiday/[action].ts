
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { authHeaders, baseUrl } from '@/utils/api.config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action, page, search, id } = req.query;

  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;

  if (action === "all") {
    const resp = await fetch(baseUrl + "/api/holiday/all", {
      headers: { ...authHeaders(access_token) },
    });

    res.status(201).json(await resp.json());
  }

  if (action == "paginate") {
    const response = await fetch(
      baseUrl + `/api/holiday/paginate?page=${page}&search=${search}`,
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
    const response = await fetch(baseUrl + `/api/holiday/create`, {
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
    const response = await fetch(baseUrl + `/api/holiday/update`, {
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
    const response = await fetch(baseUrl + `/api/holiday/info/${id}`, {
      headers: {
        ...authHeaders(access_token),
      },
    });
    const json = await response.json();

    res.status(200).json(json);
  }

  if (action == "delete") {
    const response = await fetch(baseUrl + `/api/holiday/delete`, {
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