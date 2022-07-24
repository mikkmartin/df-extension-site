import { NextApiHandler } from 'next'
const { URLPattern } = require('urlpattern-polyfill')
import { fromJson } from '../../lib/domSelector'

const handler: NextApiHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const url = req.query.url as string

  const [templates, rawHtml] = await Promise.all([
    getTemplates(),
    fetch(url).then(res => res.text()),
  ])

  const siteTemplates = templates.filter(({ urlpattern }) => new URLPattern(urlpattern).test(url))
  const { urlpattern, selectors, name, slug } = siteTemplates[0]
  // const entries = Object.entries(selectors)

  const props = fromJson(rawHtml, selectors)

  // props = Object.entries(props).reduce<typeof props>(
  //   (all, [key, value]) => ({ ...all, [key]: trimText(value) }),
  //   {} as typeof props
  // )

  return res.json({ slug, props, siteTemplates })
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

let templates
const getTemplates = async () => {
  if (templates) return templates
  const url = 'https://sdqycteblanimltlbiss.supabase.co/rest/v1/scrapers?select=*'
  const apikey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzk2ODA5MSwiZXhwIjoxOTQ5NTQ0MDkxfQ.3lcwPf4xoviCoisWUHSF7Bl7mq_q3Rbfgtb-EcXmGZo'
  const _templates = await fetch(url, { headers: { apikey } }).then(res => res.json())
  templates = _templates
  return templates
}

export default handler
