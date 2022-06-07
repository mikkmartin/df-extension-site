import { ChromeWebstore } from './icons/ChromeWebstore'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FC } from 'react'
import { defaultTemplates } from 'data/defaultTemplates'
import { usePrevious } from 'react-use'

const fast = { type: 'spring', stiffness: 2000, damping: 120, mass: 1 }

export const Layout = ({ children }) => {
  const router = useRouter()
  const isOpen = router.asPath !== '/'

  const handleOpenChange = state => {
    if (!state) router.push('/', undefined, { scroll: false })
  }

  return (
    <Container>
      <div className="header">
        <h5>DesignFactory</h5>
        <h1>Story generator</h1>
        <a
          href="https://chrome.google.com/webstore/detail/designfactory-story-gener/glbablocmmdpnbcpkbpgioednikkldkp"
          target="_blank">
          <ChromeWebstore />
        </a>
        <img src="arrow.svg" />
        <p>
          Create stories from websites. Download the extension for chrome and create images for your
          social media with a single click. Designs are imported from figma.
        </p>
      </div>
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <AnimatePresence initial={false}>
          {isOpen && (
            <Dialog.Overlay key="o" forceMount asChild>
              <Overlay
                key="overlay"
                initial="hidden"
                animate="shown"
                exit="hidden"
                transition={{ duration: 0.2 }}
                variants={{
                  hidden: { opacity: 0 },
                  shown: { opacity: 1 },
                }}
              />
            </Dialog.Overlay>
          )}
          {children}
        </AnimatePresence>
        {defaultTemplates.map(({ name, images }, i) => (
          <TempalateRow key={i} site={name} images={images} />
        ))}
      </Dialog.Root>
    </Container>
  )
}

const Container = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 0 1rem 6vh 1rem;
  .header {
    display: grid;
    justify-content: space-between;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'title chrome'
      'subtitle chrome'
      'description arrow';
    padding: 3vw 0 0;
    h1,
    h5 {
      line-height: 100%;
      margin: 0;
    }
    h5 {
      place-self: end start;
      opacity: 0.5;
      margin-bottom: 3px;
    }
    a {
      grid-area: chrome;
      height: 56px;
      place-self: end;
      svg {
        height: 100%;
        width: auto;
      }
      @media (max-width: 768px) {
        height: 40px;
      }
    }
    p {
      margin-top: 1rem;
      max-width: 30rem;
      opacity: 0.65;
      grid-area: 3 / 1 span 2;
      @media (max-width: 768px) {
        grid-column-start: 1;
        grid-column-end: 3;
      }
    }
    img {
      margin-top: 1rem;
      grid-area: arrow;
      margin-left: auto;
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
`

const animations = {
  whileHover: { scale: 1.03 },
}
type Props = {
  site: string
  images: {
    id: string
    src: string
    url: string
  }[]
}
const TempalateRow: FC<Props> = ({ site, images }) => {
  const router = useRouter()
  const query = router.query.story as string
  const previousQuery = usePrevious(query)

  return (
    <TempalateRowGrid>
      <h4>{site}</h4>
      {images.map(({ src, id }, i) => {
        const zIndex = id === previousQuery || id === query ? 1 : 'initial'

        return (
          <Link key={i} href={id} scroll={false}>
            <a>
              <Dialog.Trigger key={i} asChild>
                <motion.div className="frame" transition={fast} layoutId={id} style={{ zIndex }}>
                  <motion.img {...animations} src={src} alt="" />
                </motion.div>
              </Dialog.Trigger>
            </a>
          </Link>
        )
      })}
    </TempalateRowGrid>
  )
}

const TempalateRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: 'title title title';
  grid-gap: 0.5rem;
  h4 {
    grid-area: title;
  }
  img {
    cursor: pointer;
    max-width: 100%;
    border-radius: 0.5rem;
    transition: filter 0.2s ease-in-out;
    &:hover {
      filter: brightness(1.1);
    }
  }
`

const Overlay = styled(motion.div)`
  background-color: rgba(50, 55, 65, 0.83);
  backdrop-filter: blur(32px) saturate(180%);
  position: fixed;
  inset: 0;
`
