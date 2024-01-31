
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { authHeaders, baseUrl } from '@/utils/api.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { formAction, signatoryId } = req.query


  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;


  if (formAction === 'lists') {
    const resp = await fetch(baseUrl + '/api/letter-category/lists', {
      headers: { ...authHeaders(access_token) }
    });

    res.status(201).json(await resp.json());
  }

  if (formAction === 'delete') {
    const resp = await fetch(baseUrl + '/api/letter-category/delete', {
      headers: { ...authHeaders(access_token) },
      method: 'POST',
      body: req.body
    });

    res.status(201).json(await resp.json());
  }
}