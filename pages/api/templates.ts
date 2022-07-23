import { NextApiRequest as Req, NextApiResponse as Res } from 'next'

export const defaultTemplates: Template[] = [
  {
    name: 'Reddit card',
    slug: 'story-reddit-oixeh',
    urlpattern: '*://www.reddit.com/*/*/comments/*/*',
    selectors: {
      title: "[data-test-id='post-content'] h1",
      logo: "header button > img | attr('src')",
      author: [
        "#overlayScrollContainer [data-testid='post_author_link']",
        "[data-testid='post_author_link']",
      ],
      subreddit: "[data-testid='community-pill'] div",
      upvotes: "[data-test-id='post-content'] > div span[role='screen-reader']",
      comments: "[data-test-id='post-content'] > div:last-child span[role='screen-reader']",
      time: "[data-test-id='post-content'] [data-testid='post_timestamp']",
      body: ["[data-test-id='post-content'] p | parent | txt", null],
      image: [
        "#overlayScrollContainer [data-test-id='post-content'] [Alt='Post image'] | attr('src')",
        "#overlayScrollContainer [data-click-id='media'] video | parent | child | style('backgroundImage') | asUrl",
        "#overlayScrollContainer figure | parent | find('li[style='left: 0px;'] img') | attr('src')",
        "#overlayScrollContainer .ImageBox-image | attr('src')",
        "[data-test-id='post-content'] [Alt='Post image'] | attr('src')",
        "[data-click-id='media'] video | parent | child | style('backgroundImage') | asUrl",
        "[data-test-id='post-content'] figure | parent('ul') | find('li[style='left:0px'] img, li[style='left: 0px;'] img') | attr('src')",
        "[data-test-id='post-content'] .ImageBox-image | attr('src')",
        null,
      ],
      media: {
        video: [
          "#overlayScrollContainer [data-test-id='post-content'] [Alt='Post image'] | get",
          "#overlayScrollContainer [data-click-id='media'] video | get",
          "[data-test-id='post-content'] [Alt='Post image'] | get",
          "[data-click-id='media'] video | get",
        ],
        image: true,
      },
    },
  },
  {
    name: 'Default card template',
    slug: 'df-story-default-template-ajsxf',
    urlpattern: '*://*/*\\?*#*',
    selectors: {
      url: 'site.baseUrl',
      title: [
        "meta[property='og:title'] | attr('content')",
        "meta[name='twitter:title'] | attr('content')",
        "meta[property='twitter:title'] | attr('content')",
        'title',
        '.post-title',
        '.entry-title',
        "h1[class*='title' i] a",
        "h1[class*='title'i]",
      ],
      logo: [
        "meta[property='og:logo'] | attr('content')",
        "meta[itemprop='logo'] | attr('content')",
        "img[itemprop='logo'] | attr('src')",
        "meta[property='og:logo'] | attr('content')",
        "meta[itemprop='logo'] | attr('content')",
        "img[itemprop='logo'] | attr('src')",
        "link[rel='apple-touch-icon'] | attr('href')",
        'site.favicon',
      ],
      image: [
        "meta[property='og:image:secure_url'] | attr('content')",
        "meta[property='og:image:url'] | attr('content')",
        "meta[property='og:image'] | attr('content')",
        "meta[name='twitter:image:src'] | attr('content')",
        "meta[property='twitter:image:src'] | attr('content')",
        "meta[name='twitter:image'] | attr('content')",
        "meta[property='twitter:image'] | attr('content')",
        "meta[itemprop='image'] | attr('content')",
        "article img[src] | attr('src')",
        "#content img[src] | attr('src')",
        "img[alt*='author' i] | attr('src')",
        "img[src]:not([aria-hidden='true']) | attr('src')",
      ],
    },
  },
]

export default function handler(_: Req, res: Res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json([
    {
      name: 'Levila uudised post',
      slug: 'levila-news-post-en629',
      urlpattern: '*://www.levila.ee/uudised/*',
      selectors: {
        title: 'article h1',
        image: "meta[property='og:image'] | attr('content')",
        body: 'article p',
        date: 'time',
      },
    },
    {
      name: 'Levila Story',
      slug: 'story-levila-0e15k',
      urlpattern: '*://www.levila.ee/(tekstid|raadio|video)/*',
      selectors: {
        title: 'article h1',
        image: "meta[property='og:image'] | attr('content')",
        body: 'article p',
        media: 'main nav:nth-child(1) | txt',
      },
    },
    ...defaultTemplates,
  ])
}

type LiteralUnion<T extends U, U = string> = T | (U & { x?: never })
type Variables = 'site.baseUrl' | 'site.favicon'
type Xstring = LiteralUnion<Variables> | null

type Selector = Xstring | Xstring[]

export type Template = {
  name: string
  slug: string
  urlpattern: string
  selectors: {
    [key: string]: Selector | { [key: string]: Selector | true }
  }
}
type MaybeError<T> = { error: Error | null; data: T | null }
export type TemplateData = Omit<Template, 'selectors'> & {
  page: { [key: string]: string }
}
export type TemplateDataResponse = MaybeError<TemplateData>
