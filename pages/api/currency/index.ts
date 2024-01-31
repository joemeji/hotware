import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authHeaders, baseUrl } from '@/utils/api.config';
import { authOptions } from '../auth/[...nextauth]';
import { toStringUrlSearchQuery } from '@/utils/toStringUrlSearchQuery';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;

  const searchQuery = toStringUrlSearchQuery(req.url);

  const response = await fetch(baseUrl + '/api/currency' + searchQuery, {
    headers: { 
      ...authHeaders(access_token),
    }
  });
  const json = await response.json();

  res.status(200).json(json);
}