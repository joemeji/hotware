import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authHeaders, baseUrl } from '@/utils/api.config';
import { toStringUrlSearchQuery } from '@/utils/toStringUrlSearchQuery';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;

  const {page, search} = req.query
  
  const response = await fetch(baseUrl + `/api/categories/paginate?page=${page}&search=${search}`, {
    headers: { 
      ...authHeaders(access_token),
    }
  });

  const json = await response.json();

  res.status(200).json(json);
}