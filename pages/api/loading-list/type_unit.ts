import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { authHeaders, baseUrl } from '@/utils/api.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;

  if (req.method === 'GET') {
    const resp = await fetch(baseUrl + '/api/loading-list/type_units', {
      headers: { ...authHeaders(access_token) }
    });
  
    const json = await resp.json(); 

    res.status(200).json(json);
  }

  
}