import styled from 'styled-components'
import Image from 'next/image'
import { Layout } from 'components/Layout'

const myLoader = ({ src, width, quality }: any) => {
  return `https://dev.designfactory.app/files/${src}.png`
}

export default function Home() {
  const slug = 'photography-blog-og'
  return (
    <Layout>
      <Container>
        <Image loader={myLoader} src={slug} width={800} height={418} />
      </Container>
    </Layout>
  )
}

const Container = styled.div`
`
