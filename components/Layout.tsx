import { ChromeWebstore } from './icons/ChromeWebstore'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

const fast = { type: 'spring', stiffness: 2000, damping: 120, mass: 1 }

export const Layout = ({ children }) => {
  const ref = useRef(null)
  const router = useRouter()
  const isOpen = router.asPath !== '/'
  console.log({ isOpen })

  const handleOpenChange = state => {
    if (!state) router.back()
  }

  return (
    <Container ref={ref}>
      <div className="header">
        <h4>DesignFactory</h4>
        <h1>Story templates</h1>
        <ChromeWebstore />
      </div>
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <TempalateRow key="a" site="Levila.ee" />
        <TempalateRow key="b" site="Muurileht.ee" />
        <TempalateRow key="c" site="Idaidaida.net" />
        <Dialog.Portal forceMount container={ref.current}>
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
        </Dialog.Portal>
      </Dialog.Root>
    </Container>
  )
}

const Container = styled.div`
  max-width: 1200px;
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
const TempalateRow = ({ site }) => {
  return (
    <TempalateRowGrid>
      <h4>{site}</h4>
      {[...Array(3)].map((_, i) => (
        <Link key={i} href={`${site}-${i}`} scroll={false}>
          <a>
            <Dialog.Trigger key={i} asChild>
              <motion.div
                className="frame"
                transition={{ default: fast, opacity: { duration: 0 } }}
                layoutId={`${site}-${i}`}>
                <motion.img {...animations} src="story-reddit-1.png" alt="" />
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
    border-radius: 1rem;
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
