import { NextApiHandler } from 'next'
import { Document } from 'fast-wasm-scraper'

const handler: NextApiHandler = async (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
  const url = req.query.url as string

  const [templates, rawHtml] = await Promise.all([
    fetch(`${baseUrl}/api/templates`).then(res => res.json()),
    fetch(url).then(res => res.text()),
  ])

  const doc = new Document(rawHtml)

  const parsed = {
    title: doc.root.query('article h1')[0].text()[0],
    image: doc.root.query("meta[property='og:image']")[0].attributes.get('content'),
    body: doc.root.query('article p')[0].text()[0],
    media: doc.root.query('main nav:nth-child(1)')[0].text()[0],
  }

  console.log(parsed)

  return res.json({ templates, parsed })
}

export default handler
