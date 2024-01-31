// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { authHeaders, baseUrl } from '@/utils/api.config';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = await getServerSession(req, res, authOptions);
  const access_token = user ? user.access_token : null;
  const { index: _category_id } = req.query;
  const form = formidable({});

  const [fields, files] = await form.parse(req);

  const formData = new FormData();
  formData.append('qrcode', files.qrcode);
  
 
  const response = await fetch(baseUrl + `/api/decode_qrcode`, {
    headers: { 
      ...authHeaders(access_token),
    },
    method: 'POST',
    body: formData
  });
  const json = await response.json();

  

  res.status(200).json(json);
}
