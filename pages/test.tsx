import styled from 'styled-components'
import React, { useEffect, useRef, useState, FC } from 'react'
import { motion } from 'framer-motion'
import { objectToUrlParams } from 'lib/objectToUrlParams'
import { Loader } from 'components/Loader'
import { LinkAccordion } from 'components/temp/LinkAccordion'
import { useSites } from 'data/useSites'

export default function Test() {
  const { sitesData, handleAdd, handleRemove } = useSites()
  const [focusIndex, setFocusIndex] = useState(0)
  const ref = useRef(null)

  const handleFocus = i => {
    if (!ref.current) return
    const img = ref.current.querySelectorAll('img')
    if (img) img[i]?.scrollIntoView({ block: 'center' })
  }

  return (
    <Container>
      <div className="sidebar">
        <AddNew onSubmit={handleAdd}>
          <input type="text" placeholder="Add url..." />
          <button type="submit">Add</button>
        </AddNew>
        {sitesData.length && (
          <LinkAccordion
            data={sitesData}
            focusIndex={focusIndex}
            onSelect={handleFocus}
            onRemove={handleRemove}
          />
        )}
      </div>
      <div className="images" ref={ref}>
        {sitesData.map((data, i) => (
          <Image data={data} key={i} onViewportEnter={() => setFocusIndex(i)} />
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!data.slug) return
    const params = objectToUrlParams(data.pageData)
    const url = `https://dev.designfactory.app/files/${data.slug}.png${params}`
    setUrl(url)
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        setLoading(false)
        setUrl(window.URL.createObjectURL(blob))
      })
      .catch(err => console.log(err))
  }, [data.slug])

  if (!url || loading)
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
