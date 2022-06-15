import { defaultTemplates } from 'data/defaultTemplates'
import { FC } from 'react'
import { GetServerSideProps } from 'next'
import * as Modal from 'components/PreviewModal'

type Props = {
  id: string
  src: string
  name: string
  url: string
  description: string
}

const Preview: FC<Props> = ({ id, src, name, url, description }) => {
  return (
    <Modal.Content>
      <Modal.Image layoutId={id} src={src} />
      <Modal.Panel title={name} description={description} placeholder={url} />
    </Modal.Content>
  )
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
