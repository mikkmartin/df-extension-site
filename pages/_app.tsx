import type { AppProps } from 'next/app'
import { GlobalStyles } from 'components/GlobalStyles'
import { Layout } from 'components/Layout'
import Head from 'next/head'

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>
          {process.env.NODE_ENV === 'development' ? '🚧 ' : ''}DesignFactory story generator
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalStyles />
      {router.pathname !== '/test' ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  )
}
