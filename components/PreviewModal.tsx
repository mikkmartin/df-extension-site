import { FC, useEffect, createContext, useContext, useState, Dispatch, SetStateAction } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
  transform,
} from 'framer-motion'
import styled from 'styled-components'
import { motion, PanInfo } from 'framer-motion'
import { Close } from 'components/icons/Close'
import { media } from 'components/GlobalStyles'
import { useMedia } from 'components/GlobalStyles'

type RootProps = {
  open: boolean
  children: React.ReactNode
  onOpenChange: (state: boolean) => void
}
const fast = { type: 'spring', stiffness: 2000, damping: 120, mass: 1 }
// const fast = { duration: 1 }

const RootContext = createContext<{
  setOverlayOpacity: (progress: number) => void
  setOpen: (state: boolean) => void
  open: boolean
}>(undefined as any)

export const Root: FC<RootProps> = ({ children, open, onOpenChange }) => {
  const overlayOpacity = useAnimation()

  useEffect(() => {
    if (open) overlayOpacity.start('shown')
    overlayOpacity.set({ opacity: 1 })
  }, [open])

  const setOverlayOpacity = (opacity: number) => overlayOpacity.set({ opacity })

  return (
    <RootContext.Provider
      value={{
        setOverlayOpacity,
        setOpen: state => onOpenChange(state),
        open,
      }}>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence initial={false}>
          {open && (
            <Dialog.Overlay key="o" forceMount asChild>
              <Overlay
                key="overlay"
                initial="hidden"
                animate={overlayOpacity}
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
      </Dialog.Root>
    </RootContext.Provider>
  )
}

export const useModal = () => useContext(RootContext)

type ContentProps = {
  children: React.ReactNode
}

export const Content: FC<ContentProps> = ({ children }) => {
  return (
    <Dialog.Content forceMount asChild>
      <StyledContent>{children}</StyledContent>
    </Dialog.Content>
  )
}

type PanelProps = {
  title: string
  description: string
  placeholder: string
}

export const Panel: FC<PanelProps> = ({ title, description, placeholder }) => {
  const {} = useModal()
  const panelAnimation = useAnimation()

  return (
    <StyledPanel
      transition={{ duration: 0.1 }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 },
      }}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Close className="close">
        <Close />
      </Dialog.Close>
      <div className="inputs">
        <input type="text" placeholder={placeholder} />
        <button className="cta">Generate</button>
      </div>
    </StyledPanel>
  )
}

const isBrowser = typeof window !== 'undefined'

type ImageProps = {
  layoutId: string
  src: string
}

export const Image: FC<ImageProps> = ({ layoutId, src }) => {
  const threshold = isBrowser ? window.innerHeight / 8 : 200
  const imageAnimation = useAnimation()
  const y = useMotionValue(0)
  const isMobile = useMedia().lessThan('large')
  const _scale = useTransform(
    y,
    [-threshold * 4, -threshold - 0.1, -threshold, 0, threshold, threshold + 0.1, threshold * 4],
    [0.25, 0.75, 0.9, 1, 0.9, 0.75, 0.25]
  )
  const scale = useSpring(_scale, { stiffness: 2000, damping: 70, mass: 1 })
  const { setOverlayOpacity, setOpen, open } = useModal()

  useEffect(() => {
    if (!isMobile) imageAnimation.set({ y: 0 })
  }, [imageAnimation, isMobile])

  const handleDragStart = () => {
    //panelAnimation.start('hidden')
    //isDragging.current = true
  }

  const handleDrag = (_, info: PanInfo) => {
    const { offset } = info
    const shouldClose = offset.y > threshold || offset.y < -threshold
    //if (isOpen) updateOverlay(offset.y)
  }

  const handleUpdate = pos => {
    updateOverlay(pos.y)
    if (open) updateOverlay(pos.y)
  }

  const updateOverlay = y => {
    y = Math.abs(y)
    const opacity = transform(y, [0, threshold, threshold + 0.1], [1, 0.5, 0.25])
    setOverlayOpacity(opacity)
  }

  const handleDragEnd = (_, info: PanInfo) => {
    //setTimeout(() => (isDragging.current = false), 1)
    const { velocity, offset } = info
    const shouldClose = Math.abs(velocity.y) > 20 || Math.abs(offset.y) > threshold
    if (shouldClose) {
      console.log('should close')
      setOpen(false)
    } else {
      imageAnimation.start({ y: 0 })
      //panelAnimation.start('visible')
    }
  }

  const handleTap = (ev, info) => {
    // if (isDragging.current) return
    // if (showPanel.current) {
    //   panelAnimation.start('hidden')
    //   showPanel.current = false
    // } else {
    //   panelAnimation.start('visible')
    //   showPanel.current = true
    // }
  }

  return (
    <StyledImage
      layoutId={layoutId}
      transition={fast}
      drag={isMobile ? true : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      animate={imageAnimation}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onUpdate={handleUpdate}
      onTap={handleTap}
      style={{ y, scale }}>
      <motion.img src={src} />
    </StyledImage>
  )
}

const StyledContent = styled(motion.div)`
  z-index: 3;
  ${media.lessThan('large')`
    display: content;
  `}
  ${media.greaterThan('large')`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 80vh;
    flex-direction: row-reverse;
    gap: 5rem;
  `}
`
const StyledImage = styled(motion.div)`
  z-index: 3;
  ${media.lessThan('large')`
    position: fixed;
    max-width: 100%;
    max-height: calc(100% - 8px);
    width: auto;
    inset: 0;
    margin: auto;
    img {
      width: 100%;
      height: 100%;
    }
  `}
  ${media.greaterThan('large')`
    position: relative;
    &::before {
      content: '';
      z-index: -1;
      position: absolute;
      aspect-ratio: 1314 / 2661;
      top: -10%;
      left: -5%;
      width: 110%;
      background-image: url('phone2.png');
      background-size: cover;
    }
    &::after {
      content: '';
      z-index: 2;
      position: absolute;
      aspect-ratio: 540 / 1170;
      inset: -7.3% 0%;
      background-image: url('ig-overlay.png');
      background-size: cover;
      opacity: 1;
      pointer-events: none;
    }
    img {
      object-fit: contain;
      max-height: 80vh;
      height: 50rem;
      width: auto;
    }
  `}
  img {
    border-radius: 8px;
  }
`
const StyledPanel = styled(motion.div)`
  ${media.lessThan('large')`
    background: white;
    border-radius: 24px 24px 0 0;
    box-shadow: 0 200px 0 rgba(255, 255, 255, 1), 0 0 32px rgba(0, 0, 0, 0.1);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px 16px;
    display: grid;
    grid-template-columns: 1fr auto;
    color: black;
    h2 {
      font-size: 24px;
      margin: 0;
    }
    button.close {
      width: 40px;
      height: 40px;
      transform: translate(4px, -4px);
      border-radius: 99rem;
      border: none;
      font-size: 14px;
      background: rgba(255, 255, 255, 0);
      display: grid;
      place-items: center;
      opacity: 0.5;
      svg {
        width: 20px;
      }
      &:focus {
        outline: none;
      }
      &:active {
        background: white;
        color: black;
        opacity: 1;
      }
    }
    .inputs {
      grid-area: 2 / 1 / span 1 / span 2;
      display: flex;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.07);
      border-radius: 4px;
      //box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
      padding: 3px;
      margin: -4px;
      backdrop-filter: blur(42px) saturate(160%);
      input {
        height: 42px;
        min-width: 100px;
        flex-grow: 1;
        padding-left: 16px;
        text-overflow: ellipsis;
        border-radius: var(--border-radius);
        border: none;
        background: none;
        font-size: 16px;
        &:focus {
          outline: none;
          color: white;
        }
        &:placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      }
      button.cta {
        flex-grow: auto;
        background: blue;
        padding: 0 24px;
        color: white;
        border-radius: 4px;
        border: none;
        font-size: 14px;
        text-transform: uppercase;
        font-weight: bold;
        user-select: none;
      }
    }
  `}
  ${media.greaterThan('large')`
    width: 20vw;
  `}
`
const Overlay = styled(motion.div)`
  z-index: 1;
  position: fixed;
  inset: 0;
  background-color: #282c34;
  ${media.greaterThan('large')`
    background-color: rgba(50, 55, 65, 0.83);
    backdrop-filter: blur(32px) saturate(180%);
  `}
`
