import { NextApiRequest, NextApiResponse } from 'next'
import { load } from 'cheerio'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url =
    'https://www.reddit.com/r/ukraine/comments/wc47s0/rmoscow_has_been_overtaken_by_2russophobic4u_your/'
  const html = await fetch(url).then(res => res.text())
  const $ = load(html)
  const obj = {
    test: 'test',
    logo: $('header [data-testid="community-pill-text"] > img').attr('src'),
  }
  res.json(obj)
}
