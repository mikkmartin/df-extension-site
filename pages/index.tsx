import styled from 'styled-components'
import Image from 'next/image'

const myLoader = ({ src, width, quality }: any) => {
  return `https://dev.designfactory.app/files/${src}.png`
}

export default function Home() {
  const slug = 'photography-blog-og'
  return (
    <Container>
      My page
      <Image loader={myLoader} src={slug} width={800} height={418} />
    </Container>
  )
}

const Container = styled.div`
  padding: 2rem;
  font-size: 50px;
`
