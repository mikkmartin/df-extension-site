import { defaultTemplates } from 'lib/defaultTemplates'
import { createNextApiHandler, CreateNextContextOptions } from '@trpc/server/adapters/next'
import { initTRPC, inferAsyncReturnType } from '@trpc/server'
const { URLPattern } = require('urlpattern-polyfill')
import { scrape } from '../../lib/domSelector'
import { z } from 'zod'

export const createContext = (opts?: CreateNextContextOptions) => ({
  req: opts?.req,
  res: opts?.res,
})

type Context = inferAsyncReturnType<typeof createContext>
const { procedure, router } = initTRPC<{ ctx: Context }>()()

const appRouter = router({
  getSiteData: procedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .query(async ({ input }) => {
      const url = input.url

      const [templates, rawHtml] = await Promise.all([
        getTemplates(),
        fetch(url).then(res => res.text()),
      ])
      const siteTemplates = templates.filter(({ urlpattern }) =>
        new URLPattern(urlpattern).test(url)
      )
      const { selectors, ...rest } = siteTemplates[0]
      const props = scrape(rawHtml, selectors)

      return { ...rest, pageData: props, selectors }
    }),
})

let remoteTemplates
const getTemplates = async (): Promise<Template[]> => {
  if (remoteTemplates) return [...remoteTemplates, ...defaultTemplates]
  const url = 'https://sdqycteblanimltlbiss.supabase.co/rest/v1/scrapers?select=*'
  const apikey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzk2ODA5MSwiZXhwIjoxOTQ5NTQ0MDkxfQ.3lcwPf4xoviCoisWUHSF7Bl7mq_q3Rbfgtb-EcXmGZo'
  const _templates = await fetch(url, { headers: { apikey } }).then(res => res.json())
  remoteTemplates = _templates
  return [...remoteTemplates, ...defaultTemplates]
}

export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
})

export type AppRouter = typeof appRouter
