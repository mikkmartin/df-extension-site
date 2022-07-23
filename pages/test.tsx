import * as RadioGroup from '@radix-ui/react-radio-group'
import styled from 'styled-components'
import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Accordion } from '../components/temp/Accordion'

export default function Test() {
  const ref = useRef(null)
  const [currentFocus, setCurrentFocus] = useState(0)

  const handleFocus = i => {
    if (!ref.current) return
    ref.current.querySelectorAll('img')[i].scrollIntoView({ block: 'center' })
  }

  return (
    <Container>
      <Accordion tabs={sites} onSelect={handleFocus} pseudoFocus={currentFocus} />
      <div ref={ref}>
        {sites.map((site, i) => (
          <Image url={site} onViewportEnter={() => setCurrentFocus(i)} />
        ))}
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 5rem;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  img {
    max-height: 80vh;
  }
`

const Image = ({ url, onViewportEnter }) => {
  return (
    <motion.img
      onViewportEnter={onViewportEnter}
      viewport={{ amount: 'all' }}
      src="https://placekitten.com/600/600"
    />
  )
}

const sites = [
  'https://www.google.com',
  'https://www.facebook.com',
  'https://www.youtube.com',
  'https://www.instagram.com',
  'https://www.twitter.com',
  'https://www.reddit.com',
  'https://www.linkedin.com',
  'https://www.pinterest.com',
  'https://www.tumblr.com',
  'https://www.quora.com',
  'https://www.flickr.com',
  'https://www.github.com',
  'https://www.codepen.io',
  'https://www.dribbble.com',
  'https://www.behance.net',
  'https://www.deviantart.com',
  'https://www.500px.com',
]