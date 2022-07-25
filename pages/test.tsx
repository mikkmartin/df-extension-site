import styled from 'styled-components'
import React, { useEffect, useRef, useState, FC } from 'react'
import { motion } from 'framer-motion'
import { Accordion } from '../components/temp/Accordion'
import { objectToUrlParams } from 'lib/objectToUrlParams'
import { Loader } from 'components/Loader'

export default function Test() {
  const [siteData, setSiteData] = useState(sites.map(url => ({ url })))
  const [currentFocus, setCurrentFocus] = useState(0)
  const ref = useRef(null)

  const handleFocus = i => {
    if (!ref.current) return
    ref.current.querySelectorAll('img')[i].scrollIntoView({ block: 'center' })
  }

  useEffect(() => {
    siteData.map(({ url }) => {
      fetch(`/api?url=${url}`)
        .then(res => res.json())
        .then(data => {
          setSiteData(prev =>
            prev.map(site => {
              if (site.url === url) return { ...site, ...data }
              return site
            })
          )
        })
    })
  }, [])

  return (
    <Container>
      <Accordion tabs={sites} onSelect={handleFocus} pseudoFocus={currentFocus} />
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr' }} ref={ref}>
        {siteData.map((data, i) => (
          <Image data={data} key={i} onViewportEnter={() => setCurrentFocus(i)} />
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

type Props = {
  data: TemplateData
  [key: string]: any
}

const Image: FC<Props> = ({ data, onViewportEnter }) => {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!data.slug) return
    const params = objectToUrlParams(data.pageData)
    const url = `https://dev.designfactory.app/files/${data.slug}.png${params}`
    setUrl(url)
    fetch(url)
      .then(res => res.blob())
      .then(blob => setUrl(window.URL.createObjectURL(blob)))
      .catch(err => console.log(err))
  }, [data.slug])

  if (!url)
    return (
      <LoadingBox onViewportEnter={onViewportEnter} viewport={{ amount: 'all' }}>
        <Loader />
      </LoadingBox>
    )
  return (
    <motion.img
      style={{ minWidth: 400, minHeight: 400 }}
      onViewportEnter={onViewportEnter}
      viewport={{ amount: 'all' }}
      src={url}
    />
  )
}

const LoadingBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  width: 400px;
  height: 400px;
  border-radius: 8px;
  display: grid;
  place-content: center;
`

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
