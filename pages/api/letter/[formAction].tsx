
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { authHeaders, baseUrl } from '@/utils/api.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { formAction, type, from, to } = req.query


  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;


  if (formAction === 'lists') {

    const resp = await fetch(baseUrl + `/api/letter/lists/${type}?from=${from}&to=${to}`, {
      headers: { ...authHeaders(access_token) },
      // method: 'POST',
      // body: JSON.stringify({
      //   from: from,
      //   to: to
      // })
    });

    res.status(201).json(await resp.json());
  }

  if (formAction === 'create') {
    const resp = await fetch(baseUrl + '/api/letter/create', {
      headers: { ...authHeaders(access_token) },
      method: 'POST',
      body: req.body
    });

    res.status(201).json(await resp.json());
  }

  if (formAction === 'delete') {
    const resp = await fetch(baseUrl + '/api/letter/delete', {
      headers: { ...authHeaders(access_token) },
      method: 'POST',
      body: req.body
    });

    res.status(201).json(await resp.json());
  }

  if (formAction === 'generate-pdf') {
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