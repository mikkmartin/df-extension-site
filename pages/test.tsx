import * as RadioGroup from '@radix-ui/react-radio-group'
import styled from 'styled-components'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Accordion } from '../components/temp/Accordion'
import { objectToUrlParams } from 'lib/objectToUrlParams'

export default function Test() {
  const ref = useRef(null)
  const [currentFocus, setCurrentFocus] = useState(0)

  const handleFocus = i => {
    if (!ref.current) return
    ref.current.querySelectorAll('img')[i].scrollIntoView({ block: 'center' })
  }

  useEffect(() => {
    const url = 'https://www.google.com'
    fetch(`/api?url=${url}`)
      .then(res => res.json())
      .then(console.log)
    // const params = objectToUrlParams(props)
    // setSrc(`https://dev.designfactory.app/files/${slug}.png${params}`)
  }, [])

  return (
    <Container>
      <Accordion tabs={sites} onSelect={handleFocus} pseudoFocus={currentFocus} />
      <div ref={ref}>
        {sites.map((site, i) => (
          <Image url={site} key={i} i={i} onViewportEnter={() => setCurrentFocus(i)} />
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

const Image = ({ url, onViewportEnter, i }) => {
  return (
    <motion.img
      onViewportEnter={onViewportEnter}
      viewport={{ amount: 'all' }}
      src={i % 2 ? 'https://placekitten.com/600/600' : 'https://placekitten.com/600/500'}
    />
  )
}

const sites = [
  'https://www.facebook.com',
  'https://www.levila.ee/uudised/eesti-gaas-ostab-maailmast-gaasi-kokku',
  'https://www.youtube.com',
  'https://www.twitter.com',
  'https://www.reddit.com',
  'https://www.linkedin.com',
  'https://www.pinterest.com',
  'https://www.tumblr.com',
  'https://www.quora.com',
  'https://www.flickr.com',
  'https://www.github.com',
  'https://www.dribbble.com',
  'https://www.behance.net',
  'https://www.500px.com',
]

// export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {

//   return { props }
// }
