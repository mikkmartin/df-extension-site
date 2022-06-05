import styled from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { defaultTemplates } from 'data/defaultTemplates'
import { FC } from 'react'
import { GetServerSideProps } from 'next'

const fast = { type: 'spring', stiffness: 2000, damping: 120, mass: 1 }

type Props = {
  id: string
  src: string
}

const Story: FC<Props> = ({ id, src }) => {
  return (
    <Dialog.Content forceMount asChild>
      <Content key="content">
        <motion.div
          key="txt"
          className="txt"
          initial="hidden"
          animate="shown"
          exit="hidden"
          style={{ zIndex: 2 }}
          transition={{ duration: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            shown: { opacity: 1 },
          }}>
          <h1>Template title</h1>
          <button>Create story</button>
        </motion.div>
        <motion.div
          key="frame"
          className="frame"
          layoutId={id}
          initial="hidden"
          animate="shown"
          exit="hidden"
          transition={{ default: fast, opacity: { duration: 0 } }}
          variants={{
            hidden: { opacity: 0 },
            shown: { opacity: 1 },
          }}>
          <motion.img src={src} alt="" />
        </motion.div>
      </Content>
    </Dialog.Content>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const path = query.story as string
  if (!path) return { notFound: true }
  const props = defaultTemplates.reduceRight<any>((all, template) => {
    const found = template.images.find(({ id }) => id === path)
    if (found) return found
    return all
  }, undefined)
  if (!props) return { notFound: true }
  return { props }
}

export default Story

const Content = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  color: white;
  &:focus {
    outline: none;
  }
  .txt {
    width: 20vw;
  }
  .frame {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      margin: -8rem -2rem;
      padding: 8rem 2rem;
      background-image: url('phone.png');
      background-size: cover;
      z-index: -1;
      opacity: 1;
    }
    img {
      max-width: 540px;
      height: auto;
      will-change: auto;
    }
  }
`