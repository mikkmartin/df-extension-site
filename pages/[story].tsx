import { ChromeWebstore } from 'components/icons/ChromeWebstore'
import styled from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { defaultTemplates } from 'data/defaultTemplates'
import { FC } from 'react'
import { GetServerSideProps } from 'next'
import { Chevron } from 'components/icons/Chevron'

const fast = { type: 'spring', stiffness: 2000, damping: 120, mass: 1 }

type Props = {
  id: string
  src: string
  name: string
  url: string
  description: string
}

const Story: FC<Props> = ({ id, src, name, url, description }) => {
  return (
    <Dialog.Content forceMount asChild>
      <Content key="content" initial="hidden" animate="shown" exit="hidden">
        <motion.div
          key="txt"
          className="txt"
          style={{ zIndex: 2 }}
          transition={{ duration: 0.2, staggerChildren: 0.025 }}
          variants={{
            hidden: { opacity: 0 },
            shown: { opacity: 1 },
          }}>
          <Dialog.Close>
            <Chevron dir="left" />
            Templates
          </Dialog.Close>
          <motion.h1
            transition={fast}
            variants={{
              hidden: { opacity: 0, y: 50 },
              shown: { opacity: 1, y: 0 },
            }}>
            {name} story
          </motion.h1>
          <motion.p
            transition={fast}
            variants={{
              hidden: { opacity: 0, y: 50 },
              shown: { opacity: 1, y: 0 },
            }}>
            {description}
          </motion.p>
          <motion.form
            transition={fast}
            variants={{
              hidden: { opacity: 0, y: 50 },
              shown: { opacity: 1, y: 0 },
            }}
            onSubmit={ev => ev.preventDefault()}>
            <input type="text" placeholder={url} />
            <button type="submit">Generate</button>
          </motion.form>
          <motion.div
            transition={fast}
            variants={{
              hidden: { opacity: 0, y: 50 },
              shown: { opacity: 1, y: 0 },
            }}>
            <ChromeWebstore />
          </motion.div>
        </motion.div>
        <motion.div
          key="frame"
          className="frame"
          layoutId={id}
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
  const props = defaultTemplates.reduceRight<any>((all, { images, name, description }) => {
    const found = images.find(({ id }) => id === path)
    if (found) return { ...found, name, description }
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
  max-height: 100%;
  width: auto;
  transform: translate(-50%, -50%);
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5vmax;
  .txt {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 1rem;
    min-width: 25rem;
    h1 {
      line-height: 100%;
      margin: 0;
    }
    p {
      margin-bottom: 2rem;
      margin: 0;
    }
    div > svg {
      height: 48px;
      width: auto;
    }
    button {
      margin-left: -8px;
    }
  }
  .frame {
    max-height: 90vh;
    height: 100%;
    position: relative;
    aspect-ratio: 1314 / 2661;
    display: grid;
    place-items: start center;
    padding: 18.75% 5.5%;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url('phone2.png');
      background-size: cover;
      z-index: -1;
      opacity: 1;
    }
    &::after {
      content: '';
      position: absolute;
      aspect-ratio: 540 / 1170;
      inset: 3.7% 5.65%;
      background-image: url('ig-overlay.png');
      background-size: cover;
      opacity: 1;
    }
    img {
      width: 100%;
      max-width: 540px;
      height: auto;
      will-change: auto;
      border-radius: 8px;
    }
  }
  form {
    display: flex;
  }
`
