export const defaultTemplates: Template[] = [
  {
    name: 'IMDB story',
    slug: 'df-story-imdb-rlxrx',
    urlpattern: '*://www.imdb.com/title/*/*\\?*#*',
    figma: {
      file: 'RHLpVm8YD2wMZvZ9i2Jk6T',
      frame: '126:68',
    },
    selectors: {
      type: 'div.sc-94726ce4-2.khmuXj ul > li:nth-child(1) span',
      title: 'h1',
      image: ".ipc-media--slate-16x9 img | attr('src')",
      body: "[data-testid='plot-xl']",
      'creator-label': "[data-testid='title-pc-principal-credit'] span",
      creator: "[data-testid='title-pc-principal-credit'] ul",
      score: "[data-testid='hero-rating-bar__aggregate-rating__score'] span",
      votecount: '.sc-db8c1937-0 .sc-7ab21ed2-3',
    },
  },
  {
    name: 'Reddit card',
    slug: 'story-reddit-oixeh',
    figma: {
      file: 'uhifEQPClI8AdGz3vX667v',
      frame: '79:3',
    },
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
    figma: {
      file: 'Rk2vMi1FzFHqpO8UuGTVHt',
      frame: '1:2',
    },
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