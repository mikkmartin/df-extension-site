import * as trpcNext from '@trpc/server/adapters/next'
import { supabase } from 'data/supabase'
import { defaultTemplates } from 'lib/defaultTemplates'
import { procedure, router } from 'server/trpc'
import { z } from 'zod'
import { scrape } from '../../lib/domSelector'
const { URLPattern } = require('urlpattern-polyfill')

const appRouter = router({
  getSiteData: procedure
    .input(
      z.object({
        urls: z.string().array(),
      })
    )
    .query(async ({ input }) => {
      const urls = input.urls
      const [templates, ...sitesRawHtml] = await Promise.all([
        getTemplates(),
        ...urls.map(url => fetch(url).then(res => res.text())),
      ])

      const siteTemplateArray = urls.map(url =>
        templates.filter(({ urlpattern }) => new URLPattern(urlpattern).test(url))
      )

      return siteTemplateArray.map((siteTemplates, i) => {
        const { selectors, ...rest } = siteTemplates[0]
        const props = scrape(sitesRawHtml[i], selectors)
        return { ...rest, pageData: props, selectors }
      })
    }),
})

let remoteTemplates: Template[]
const getTemplates = async (): Promise<Template[]> => {
  if (remoteTemplates) return [...remoteTemplates, ...defaultTemplates]
  const { data } = await supabase.from('scrapers').select('*')
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

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
})
