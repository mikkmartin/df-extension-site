import { defaultTemplates } from 'data/defaultTemplates'
import { FC, useState } from 'react'
import { GetServerSideProps } from 'next'
import * as Modal from 'components/PreviewModal'
import { objectToUrlParams } from 'lib/objectToUrlParams'

type Props = {
  id: string
  src: string
  name: string
  url: string
  description: string
}

const Preview: FC<Props> = ({ id, src: defaultSrc, name, url, description }) => {
  const [loading, setLoading] = useState(false)
  const [src, setSrc] = useState(defaultSrc)

  const handleInputChange = async (str: string) => {
    //regex url test
    var isUrl = isValidHttpUrl(str)
    if (isUrl) {
      setLoading(true)
      const { slug, props } = await fetch(`/api?url=${str}`).then(res => res.json())
      const params = objectToUrlParams(props)
      setSrc(`https://dev.designfactory.app/files/${slug}.png${params}`)
    }
  }

  return (
    <Modal.Content>
      <Modal.Image layoutId={id} src={src} onLoad={() => setLoading(false)} loading={loading} />
      <Modal.Panel
        title={name}
        description={description}
        placeholder={url}
        onInputChange={handleInputChange}
        loading={loading}
      />
    </Modal.Content>
  )
}

function isValidHttpUrl(string) {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const path = query.preview as string
  if (!path) return { notFound: true }
  const props = defaultTemplates.reduceRight<any>((all, { images, name, description }) => {
    const found = images.find(({ id }) => id === path)
    if (found) return { ...found, name, description }
    return all
  }, undefined)
  if (!props) return { notFound: true }
  return { props }
}

export default Preview
