import { Loader } from 'components/Loader'
import { LinkAccordion } from 'components/temp/LinkAccordion'
import { api } from 'data/server'
import { motion } from 'framer-motion'
import { objectToUrlParams } from 'lib/objectToUrlParams'
import { FC, useEffect, useRef, useState } from 'react'
import { useNoclip } from 'react-noclip'
import { useLocalStorage } from 'react-use'
import styled from 'styled-components'

export default function Test() {
  const [urls, setUrls, remove] = useLocalStorage<{ [key: string]: string[] }>('urls', {
    defaults: seedUrls,
  })

  const [selectedUrls, setSelectedUrls] = useState(urls?.[Object.keys(urls)[0]] ?? seedUrls)

  const actions = urls
    ? Object.keys(urls).reduce(
        (all, key) => ({
          ...all,
          [key]: () => setSelectedUrls(urls[key]),
        }),
        {}
      )
    : {}

  function isUrlArray(str) {
    try {
      const json = JSON.parse(str)
      return (
        Array.isArray(json) &&
        json.every(line => line.startsWith('http') || line.startsWith('https'))
      )
    } catch (e) {
      return false
    }
  }

  function isUrlList(str) {
    return str.split('\n').every(line => line.startsWith('http') || line.startsWith('https'))
  }

  useNoclip({
    ...actions,
    clearLocalStorage: () => remove(),
    addUrlList: {
      title: 'text-input',
      content: 'text-area',
      onSubmit: (data: any) => {
        const urlArray = isUrlArray(data.content)
          ? JSON.parse(data.content)
          : isUrlList(data.content)
          ? data.content.split('\n')
          : null
        if (urlArray === null) return
        setUrls({
          ...urls,
          [data.title]: urlArray,
        })
        console.log(urlArray)
        setSelectedUrls(urlArray)
      },
    },
  })

  const [focusIndex, setFocusIndex] = useState(0)
  const ref = useRef(null)

  const handleFocus = i => {
    if (!ref.current) return
    const img = ref.current.querySelectorAll('img')
    if (img) img[i]?.scrollIntoView({ block: 'center' })
  }

  const [urlState, setUrlsState] = useState<SitesState[]>(
    selectedUrls.map(url => ({ url, loading: true }))
  )

  useEffect(() => {
    setUrlsState(selectedUrls.map(url => ({ url, loading: true })))
    selectedUrls.map(async (url, i) => {
      const data = await api.getSiteData.query({ url })
      setUrlsState(prev => {
        const newState = [...prev]
        newState[i] = { url, ...data, loading: false }
        return newState
      })
    })
  }, [selectedUrls])

  function handleRemove(url) {
    setUrlsState(urlState.filter(state => state.url !== url))
    setUrls({
      ...urls,
      [Object.keys(urls)[0]]: selectedUrls.filter(u => u !== url),
    })
  }

  return (
    <Container>
      <div className="sidebar">
        {/* <AddNew onSubmit={handleAdd}>
          <input type="text" placeholder="Add url..." />
          <button type="submit">Add</button>
        </AddNew> */}
        {selectedUrls.length && (
          <LinkAccordion
            data={urlState}
            focusIndex={focusIndex}
            onSelect={handleFocus}
            onRemove={handleRemove}
          />
        )}
      </div>
      {/* <div className="images" ref={ref}>
        {urlState.map((data, i) => (
          <Image data={data} key={data.url} onViewportEnter={() => setFocusIndex(i)} />
        ))}
      </div> */}
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

type SitesState =
  | Partial<Awaited<ReturnType<typeof api.getSiteData.query>>>
  | {
      url: string
      loading?: boolean
    }

const seedUrls = [
  'https://www.reddit.com/r/ukraine/comments/w85z14/the_armed_forces_of_ukraine_attacked_an_oil_depot/',
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
