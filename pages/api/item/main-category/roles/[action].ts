import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authHeaders, baseUrl } from '@/utils/api.config';
import { toStringUrlSearchQuery } from '@/utils/toStringUrlSearchQuery';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;
  const {action, categoryId} = req.query

  
  if (action === "create") {
    const response = await fetch(
      baseUrl + `/api/main_categories/roles/create`,
      {
        method: "POST",
        body: req.body,
        headers: {
          ...authHeaders(access_token),
        },
      }
    );

    const json = await response.json();

    res.status(200).json(json);
  }

  if (action === "lists") {
    const response = await fetch(
      baseUrl + `/api/main_categories/roles/lists/${categoryId}`,
      {
        headers: {
          ...authHeaders(access_token),
        },
      }
    );

    const json = await response.json();

    res.status(200).json(json);
  }

 if (action === "delete") {
   const response = await fetch(baseUrl + `/api/main_categories/roles/delete/${categoryId}`, {
     method: "POST",
     headers: {
       ...authHeaders(access_token),
     },
   });

   const json = await response.json();

   res.status(200).json(json);
 }

}