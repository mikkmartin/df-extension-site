export {}

type LiteralUnion<T extends U, U = string> = T | (U & { x?: never })
type Variables = 'site.baseUrl' | 'site.favicon'
type Xstring = LiteralUnion<Variables>
type Selector = Xstring | Xstring[] | null

declare global {
  interface Template {
    name: string
    slug: string
    urlpattern: string
    figma: {
      file: string
      frame: `${string}:${string}`
    }
    selectors: {
      [key: string]: Selector | { [key: string]: Selector | true }
    }
  }
}
