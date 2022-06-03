import { AppProps } from 'next/app'
import { GlobalStyles } from 'components/GlobalStyles'
import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'
import { Layout } from 'components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{process.env.NODE_ENV === 'development' ? '🚧 ' : ''}next-ts-starter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout />
      <GlobalStyles />
      <AnimatePresence>
        <Component {...pageProps} />
      </AnimatePresence>
    </>
  )
}
