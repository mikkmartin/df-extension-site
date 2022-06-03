import styled from 'styled-components'
import { Layout } from 'components/Layout'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <Layout>
      <Container>
        <TempalateRow site="Levila.ee" />
        <TempalateRow site="Muurileht.ee" />
        <TempalateRow site="Idaidaida.net" />
      </Container>
    </Layout>
  )
}

const animations = {
  whileHover: { scale: 1.03 },
}
const TempalateRow = ({ site = 'Reddit.com' }) => {
  return (
    <TempalateRowGrid>
      <h4>{site}</h4>
      <motion.img {...animations} src="story-reddit-1.png" alt="" />
      <motion.img {...animations} src="story-reddit-1.png" alt="" />
      <motion.img {...animations} src="story-reddit-1.png" alt="" />
    </TempalateRowGrid>
  )
}

const TempalateRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: 'title title title';
  grid-gap: 1rem;
  h4 {
    grid-area: title;
  }
  img {
    max-width: 100%;
    border-radius: 1rem;
    transition: filter 0.2s ease-in-out;
    &:hover {
      filter: brightness(1.1);
    }
  }
`
const Container = styled.div``
