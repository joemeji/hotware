import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { authHeaders, baseUrl } from '@/utils/api.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, type, from, to } = req.query


  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;


  if (action === 'lists') {

    const resp = await fetch(baseUrl + `/api/users/get_roles`, {
      headers: { ...authHeaders(access_token) },
    });

    res.status(201).json(await resp.json());
  }

  if (action === 'create') {
    const resp = await fetch(baseUrl + '/api/letter/create', {
      headers: { ...authHeaders(access_token) },
      method: 'POST',
      body: req.body
    });

    res.status(201).json(await resp.json());
  }

  if (action === 'delete') {
    const resp = await fetch(baseUrl + '/api/letter/delete', {
      headers: { ...authHeaders(access_token) },
      method: 'POST',
      body: req.body
    });

    res.status(201).json(await resp.json());
  }

  if (action === 'generate-pdf') {
    const resp = await fetch(baseUrl + `/api/letter/generate-pdf?type=${type}&from=${from}&to=${to}`, {
      headers: {
        ...authHeaders(access_token),
        'Content-Type': 'application/json',
      },
    });
    const resBlob = await resp.blob();


    return res
      .setHeader('Content-Type', 'application/pdf')
      .setHeader('Content-Type', 'application/pdf; charset=UTF-8')
      .send(resBlob);
  }

  res.status(500)
}