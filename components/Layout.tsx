import { ChromeWebstore } from './icons/ChromeWebstore'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FC, useRef } from 'react'

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
        <h4>DesignFactory</h4>
        <h1>Story templates</h1>
        <ChromeWebstore />
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
        <TempalateRow
          key="d"
          site="Reddit.com"
          images={['story-reddit-1.png', 'story-reddit-1.png', 'story-reddit-1.png']}
        />
        <TempalateRow
          key="a"
          site="Edasi.ee"
          images={['edasi-1.png', 'edasi-2.png', 'edasi-3.png']}
        />
        <TempalateRow
          key="b"
          site="Levila.ee"
          images={['story-levila-1.png', 'story-levila-2.png', 'story-levila-3.png']}
        />
        <TempalateRow
          key="c"
          site="Muurileht.ee"
          images={['muurileht-1.png', 'muurileht-2.png', 'muurileht-3.png']}
        />
      </Dialog.Root>
    </Container>
  )
}

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 0 1rem 6vh 1rem;
  .header {
    display: grid;
    justify-content: space-between;
    grid-template-areas:
      'title chrome'
      'subtitle chrome';
    padding: 3vh 0;
    h1,
    h4 {
      line-height: 100%;
      margin: 0;
      padding: 0;
    }
    h4 {
      place-self: end start;
      opacity: 0.5;
    }
    svg {
      grid-area: chrome;
      height: 56px;
      width: auto;
      margin: auto;
      @media (max-width: 768px) {
        height: 42px;
      }
    }
  }
`

const animations = {
  whileHover: { scale: 1.03 },
}
type Props = {
  site: string
  images: string[]
}
const TempalateRow: FC<Props> = ({ site, images }) => {
  return (
    <TempalateRowGrid>
      <h4>{site}</h4>
      {images.map((image, i) => (
        <Link key={i} href={`${site}-${i}`} scroll={false}>
          <a>
            <Dialog.Trigger key={i} asChild>
              <motion.div className="frame" transition={fast} layoutId={`${site}-${i}`}>
                <motion.img {...animations} src={image} alt="" />
              </motion.div>
            </Dialog.Trigger>
          </a>
        </Link>
      ))}
    </TempalateRowGrid>
  )
}

const TempalateRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: 'title title title';
  grid-gap: 1rem;
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
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(16px) saturate(180%);
  position: fixed;
  inset: 0;
`
