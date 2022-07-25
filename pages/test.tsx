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

  return (
    <Container>
      <Accordion tabs={sites} onSelect={handleFocus} pseudoFocus={currentFocus} />
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr' }} ref={ref}>
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
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    fetch(`/api?url=${url}`)
      .then(res => res.json())
      .then(data => {
        const params = objectToUrlParams(data.pageData)
        const _url = `https://dev.designfactory.app/files/${data.slug}.png${params}`
        console.log(_url)
        setImageUrl(_url)
      })
  }, [url])

  return (
    <motion.img
      style={{ minWidth: 200, minHeight: 200 }}
      onViewportEnter={onViewportEnter}
      viewport={{ amount: 'all' }}
      src={imageUrl ? imageUrl : 'https://placekitten.com/600/500'}
    />
  )
}

const sites = [
  'https://www.facebook.com',
  'https://www.levila.ee/tekstid/see-oli-kuuditamine',
  'https://www.levila.ee/tekstid/levilas-hakkas-ilmuma-raamat-kersti-kaljulaidist',
  'https://www.levila.ee/raadio/usu-voim',
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
