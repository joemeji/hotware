// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { Client } from '@elastic/elasticsearch';
// import fs from 'fs';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const client = new Client({ 
  //   node: 'https://localhost:9200',
  //   auth: {
  //     username: 'elastic',
  //     'password': 'eUmMLcgWuJTbVY+SThsM',
  //   },
  //   tls: {
  //     ca: fs.readFileSync('http_ca.crt'),
  //     rejectUnauthorized: false
  //   }
  // });

  // await client.index({
  //   id: '123_1',
  //   index: 'game-of-thrones',
  //   document: {
  //     character: 'Ned Stark',
  //     quote: 'Winter is coming.'
  //   }
  // })

  // await client.index({
  //   id: '123_2',
  //   index: 'game-of-thrones',
  //   document: {
  //     character: 'Daenerys Targaryen',
  //     quote: 'I am the blood of the dragon.'
  //   }
  // })

  // await client.index({
  //   id: '123_3',
  //   index: 'game-of-thrones',
  //   refresh: true,
  //   document: {
  //     character: 'Tyrion Lannister',
  //     quote: 'A mind needs books like a sword needs a whetstone.'
  //   }
  // })

  // await client.index({
  //   id: '123_3',
  //   index: 'game-of-thrones',
  //   refresh: true,
  //   document: {
  //     character: 'Tyrion Lannister',
  //     quote: 'A mind needs books like a sword needs a whetstone.',
  //     serial_number: 'F.100.000'
  //   }
  // })

  // const result = await client.search({
  //   index: 'game-of-thrones',
  //   query: {
  //     query_string: {
  //       query: '*Tyrio*'
  //     }
  //   }
  // })

  // await client.indices.delete({ index: 'game-of-thrones' })

  // res.status(200).send('result.hits.hits')
  // res.status(200).send(result.hits.hits)
}
