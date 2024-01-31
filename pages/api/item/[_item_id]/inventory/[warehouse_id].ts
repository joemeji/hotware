import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authHeaders, baseUrl } from '@/utils/api.config';
import { toStringUrlSearchQuery } from '@/utils/toStringUrlSearchQuery';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;
  const { _item_id, warehouse_id } = req.query;

  const searchQuery = toStringUrlSearchQuery(req.url);

  const response = await fetch(baseUrl + `/api/items/${_item_id}/inventory/${warehouse_id}` + searchQuery, {
    headers: { 
      ...authHeaders(access_token),
    },
  });
  const json = await response.json();

  res.status(200).json(json);
}