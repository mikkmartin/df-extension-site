import { NextApiHandler } from 'next'
import { Document } from 'fast-wasm-scraper'
const { URLPattern } = require('urlpattern-polyfill')
import { fromJson } from '../../lib/domSelector'

const handler: NextApiHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
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

  let props = fromJson(rawHtml, {
    title: 'article h1',
    image: "meta[property='og:image'] | attr('content')",
    date: 'time',
  })

  props = Object.entries(props).reduce<typeof props>(
    (all, [key, value]) => ({ ...all, [key]: trimText(value) }),
    {} as typeof props
  )

  return res.json({ slug, props })
}

const trimText = str => {
  return str
  //if (str.startsWith('http')) return str
  const maxLength = 225
  const origitalTxt = str.replaceAll('\n', ' ')
  const trimmed = origitalTxt.substring(0, maxLength)
  if (trimmed.length < origitalTxt.length) return trimmed + '...'
  return trimmed
}

export default handler
