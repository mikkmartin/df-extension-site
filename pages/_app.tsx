import { AppProps } from 'next/app'
import { GlobalStyles } from 'components/GlobalStyles'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{process.env.NODE_ENV === 'development' ? '🚧 ' : ''}next-ts-starter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  )
}
