import { NextApiHandler } from 'next'
const { URLPattern } = require('urlpattern-polyfill')
import { scrape } from '../../lib/domSelector'

const handler: NextApiHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const url = req.query.url as string

  const [templates, rawHtml] = await Promise.all([
    getTemplates(),
    fetch(url).then(res => res.text()),
  ])

  const siteTemplates = templates.filter(({ urlpattern }) => new URLPattern(urlpattern).test(url))
  const { selectors, ...rest } = siteTemplates[0]
  const props = scrape(rawHtml, selectors)

  return res.json({ ...rest, pageData: props })
}

let templates
const getTemplates = async (): Promise<Template[]> => {
  if (templates) return templates
  const url = 'https://sdqycteblanimltlbiss.supabase.co/rest/v1/scrapers?select=*'
  const apikey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzk2ODA5MSwiZXhwIjoxOTQ5NTQ0MDkxfQ.3lcwPf4xoviCoisWUHSF7Bl7mq_q3Rbfgtb-EcXmGZo'
  const _templates = await fetch(url, { headers: { apikey } }).then(res => res.json())
  templates = _templates
  return templates
}

export default handler
