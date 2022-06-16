import { NextApiHandler } from 'next'
import { Document } from 'fast-wasm-scraper'
const { URLPattern } = require('urlpattern-polyfill')

const handler: NextApiHandler = async (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
  const url = req.query.url as string

  const [templates, rawHtml] = await Promise.all([
    fetch(`${baseUrl}/api/templates`).then(res => res.json()),
    fetch(url).then(res => res.text()),
  ])

  const siteTemplates = templates.filter(({ urlpattern }) => new URLPattern(urlpattern).test(url))
  const { urlpattern, selectors, name, slug } = siteTemplates[0]
  const entries = Object.entries(selectors)

  const doc = new Document(rawHtml)
  const $ = (q: string) => doc.root.query(q)

  const parsed = {
    title: $('article h1')[0].text()[0],
    image: $("meta[property='og:image']")[0].attributes.get('content'),
    body: $('article p')[0].text()[0],
    media: $('main nav:nth-child(1)')[0].text()[0],
  }

  return res.json({ parsed, siteTemplates: siteTemplates[0] })
}

export default handler
