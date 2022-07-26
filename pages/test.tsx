import styled from 'styled-components'
import React, { useEffect, useRef, useState, FC } from 'react'
import { motion } from 'framer-motion'
import { objectToUrlParams } from 'lib/objectToUrlParams'
import { Loader } from 'components/Loader'
import { LinkAccordion } from 'components/temp/LinkAccordion'

export default function Test() {
  const [siteData, setSiteData] = useState(sites.map(url => ({ url })))
  const [currentFocus, setCurrentFocus] = useState(0)
  const ref = useRef(null)

  const handleFocus = i => {
    if (!ref.current) return
    ref.current.querySelectorAll('img')[i].scrollIntoView({ block: 'center' })
  }

  useEffect(() => {
    siteData.map(({ url }) => getData(url))
  }, [])

  const getData = (url: string) => {
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
  }

  const handleAdd = ev => {
    ev.preventDefault()
    const input = ev.target.querySelector('input')
    if (!input) return
    const value = input.value
    const isUrl = isValidHttpUrl(input.value)
    if (!isUrl) return
    setSiteData(prev => [...prev, { url: value }])
    getData(value)
    input.value = ''
  }

  return (
    <Container>
      <div className="sidebar">
        <AddNew onSubmit={handleAdd}>
          <input type="text" placeholder="Add url..." />
          <button type="submit">Add</button>
        </AddNew>
        <LinkAccordion data={siteData} onSelect={handleFocus} />
      </div>
      <div className="images" ref={ref}>
        {siteData.map((data, i) => (
          <Image data={data} key={i} onViewportEnter={() => setCurrentFocus(i)} />
        ))}
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr;
  > div {
    overflow-y: auto;
    height: 100vh;
  }
  .sidebar {
    padding: 72px;
  }
  .images {
    display: grid;
    padding: 72px;
    gap: 36px;
    place-items: center;
    img {
      width: auto;
      display: block;
      position: relative;
      padding: 2rem;
      &::after {
        inset: 0;
        position: absolute;
        content: ' ';
        display: block;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        display: grid;
        place-content: center;
      }
    }
  }
`
const AddNew = styled.form`
  display: flex;
  width: 100%;
  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  button {
    background: var(--highlight) !important;
    &:focus {
      background: #3697ff !important;
      outline: 2px solid rgba(0, 122, 255, 1);
      outline-offset: 1px;
    }
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
      style={{ maxWidth: 540 }}
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
  'https://www.levila.ee/tekstid/see-oli-kuuditamine',
  'https://www.levila.ee/tekstid/levilas-hakkas-ilmuma-raamat-kersti-kaljulaidist',
  'https://www.levila.ee/raadio/usu-voim',
  'https://www.levila.ee/uudised/eesti-gaas-ostab-maailmast-gaasi-kokku',
  'https://www.reddit.com/r/ukraine/comments/w85z14/the_armed_forces_of_ukraine_attacked_an_oil_depot/',
  'https://www.reddit.com/r/ukraine/comments/w7tsvy/little_bits_of_tenderness_in_a_brutal_world/',
  'https://www.reddit.com/r/ukraine/comments/w7y1c7/ukrainians_are_returning_to_the_ukrainian/',
  'https://www.reddit.com/r/ukraine/comments/w82tl1/russia_has_made_it_clear_putins_goal_is_to/',
  'https://www.facebook.com',
  'https://www.youtube.com',
  'https://www.twitter.com',
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

function isValidHttpUrl(string) {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}
