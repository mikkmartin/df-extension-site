import styled from 'styled-components'
import { ChromeWebstore } from './icons/ChromeWebstore'
import { motion } from 'framer-motion'

export const Layout = () => {
  return (
    <Container>
      <div className="header">
        <h4>DesignFactory</h4>
        <h1>Story templates</h1>
        <ChromeWebstore />
      </div>
      <TempalateRow site="Levila.ee" />
      <TempalateRow site="Muurileht.ee" />
      <TempalateRow site="Idaidaida.net" />
    </Container>
  )
}

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 0 1rem 6vh 1rem;
  .header {
    display: grid;
    justify-content: space-between;
    grid-template-areas:
      'title chrome'
      'subtitle chrome';
    padding: 3vh 0;
    h1,
    h4 {
      line-height: 100%;
      margin: 0;
      padding: 0;
    }
    h4 {
      place-self: end start;
      opacity: 0.5;
    }
    svg {
      grid-area: chrome;
      height: 56px;
      width: auto;
      margin: auto;
      @media (max-width: 768px) {
        height: 42px;
      }
    }
  }
`

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
