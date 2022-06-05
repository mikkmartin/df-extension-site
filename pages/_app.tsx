import type { AppProps } from 'next/app'
import { GlobalStyles } from 'components/GlobalStyles'
import Head from 'next/head'
import { Layout } from 'components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{process.env.NODE_ENV === 'development' ? '🚧 ' : ''}DesignFactory story generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalStyles />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
