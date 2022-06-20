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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const props = {
    name: 'Levila.ee',
    description: 'Loe. Kuula. Vaata. Levila artiklitest story piltide looja.',
    id: 'pk20o',
    src: 'story-levila-4.mp4',
    url: 'https://www.levila.ee/tekstid/kirjutan-teile-ukrainast',
  }
  if (!props) return { notFound: true }
  return { props }
}

export default Preview
