import { defaultTemplates } from 'lib/defaultTemplates'
import { createNextApiHandler, CreateNextContextOptions } from '@trpc/server/adapters/next'
import { initTRPC, inferAsyncReturnType } from '@trpc/server'
const { URLPattern } = require('urlpattern-polyfill')
import { scrape } from '../../lib/domSelector'
import { supabase, Scrapers } from 'data/supabase'
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

let remoteTemplates: Template[]
const getTemplates = async (): Promise<Template[]> => {
  if (remoteTemplates) return [...remoteTemplates, ...defaultTemplates]
  const { data } = await supabase.from<Scrapers>('scrapers').select('*')
  if (data) {
    remoteTemplates = data.map(({ title, figma_id, figma_frame, slug, selectors, urlpattern }) => ({
      name: title,
      slug,
      figma: {
        file: figma_id,
        frame: figma_frame as Template['figma']['frame'],
      },
      selectors: selectors as Template['selectors'],
      urlpattern,
    }))
  } else {
    throw new Error('Failed to fetch scrapers')
  }
  return [...remoteTemplates, ...defaultTemplates]
}

export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
})

export type AppRouter = typeof appRouter
