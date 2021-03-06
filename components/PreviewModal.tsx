import { FC, useEffect, createContext, useContext, ReactEventHandler, useState } from 'react'
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
import { Chevron } from 'components/icons/Chevron'
import { media } from 'components/GlobalStyles'
import { useMedia } from 'components/GlobalStyles'
import { fast } from 'lib/transitions'
import { ChromeWebstore } from 'components/icons/ChromeWebstore'
import { Loader } from 'components/Loader'

type RootProps = {
  open: boolean
  children: React.ReactNode
  onOpenChange: (state: boolean) => void
}

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
    <Dialog.Content forceMount asChild onOpenAutoFocus={ev => ev.preventDefault()}>
      <StyledContent>{children}</StyledContent>
    </Dialog.Content>
  )
}

type PanelProps = {
  title: string
  description: string
  placeholder: string
  loading: boolean
  onInputChange: (val: string) => void
}

export const Panel: FC<PanelProps> = ({
  title,
  description,
  placeholder,
  loading,
  onInputChange,
}) => {
  const isMobile = useMedia().lessThan('large')
  const panelAnimation = useAnimation()

  return (
    <StyledPanel
      transition={fast}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: isMobile ? '120%' : '10%' },
      }}>
      <Dialog.Close className="close">
        <Chevron dir="left" />
        templates
      </Dialog.Close>
      <Dialog.Title>Story template for {title}</Dialog.Title>
      <p>
        Template for generating stories from articles. Copy a {title.toLowerCase()} link to the
        field below to create it automatically or download the browser extension to create from
        webpage a directly.
      </p>
      <div className="inputs">
        <input
          type="text"
          placeholder={placeholder}
          disabled={loading}
          onChange={ev => onInputChange(ev.target.value)}
        />
        <button className="cta" disabled={loading}>
          {loading ? <Loader /> : 'Paste link'}
        </button>
      </div>
      <a
        href="https://chrome.google.com/webstore/detail/designfactory-story-gener/glbablocmmdpnbcpkbpgioednikkldkp"
        target="_blank">
        <ChromeWebstore />
      </a>
    </StyledPanel>
  )
}

const isBrowser = typeof window !== 'undefined'

type ImageProps = {
  layoutId: string
  loading: boolean
  src: string
  onLoad: ReactEventHandler<HTMLImageElement>
}

export const Image: FC<ImageProps> = ({ layoutId, src, loading, onLoad }) => {
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
    const opacity = transform(y, [0, threshold, threshold + 0.1], [1, 0.8, 0.35])
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

  const isImage = src.includes('png')
  const [muted, setMuted] = useState(true)

  return (
    <ImageContainer
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
      {isImage ? (
        <motion.img src={src} onLoad={onLoad} />
      ) : (
        <video src={src} playsInline autoPlay loop muted={muted} onClick={() => setMuted(!muted)} />
      )}
      {loading && <LoadingOverlay />}
    </ImageContainer>
  )
}

const LoadingOverlay = () => {
  return (
    <StyledLoadingOverlay>
      <Loader />
    </StyledLoadingOverlay>
  )
}

const StyledLoadingOverlay = styled.div`
  position: absolute;
  background-color: rgba(40, 40, 40, 0.7);
  backdrop-filter: blur(42px) saturate(160%);
  inset: 0;
  border-radius: 8px;
  display: grid;
  place-items: center;
  svg {
    width: 56px;
    height: 56px;
  }
`

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
    gap: 10vw;
    button.close > svg {
      margin-left: -0.5rem;
    }
  `}
`
const ImageContainer = styled(motion.div)`
  z-index: 3;
  max-width: calc(100% - 16px);
  max-height: calc(100% - 8px);
  video {
    aspect-ratio: 1080 / 1920;
  }
  ${media.lessThan('large')`
    position: fixed;
    width: auto;
    inset: 0;
    margin: auto;
    aspect-ratio: 1080 / 1920;
    img, video {
      width: 100%;
      height: 100%;
    }
  `}
  ${media.greaterThan('large')`
    position: relative;
    margin-top: -5%;
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
    img, video {
      object-fit: contain;
      max-height: 75vh;
      height: 50rem;
      width: auto;
    }
  `}
  img {
    border-radius: 8px;
  }
`
const StyledPanel = styled(motion.div)`
  .inputs {
    grid-area: 2 / 1 / span 1 / span 2;
    display: flex;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 3px;
    backdrop-filter: blur(42px) saturate(160%);
    input {
      height: 48px;
      min-width: 100px;
      flex-grow: 1;
      padding-left: 16px;
      /* text-overflow: ellipsis; */
      border: none;
      background: none;
      font-size: 16px;
      color: white;
      &:focus {
        outline: none;
      }
      ::placeholder {
        color: rgba(255, 255, 255, 0.2);
      }
    }
    button.cta {
      flex-grow: auto;
      background: var(--highlight);
      padding: 0 24px;
      color: white;
      border-radius: 4px;
      border: none;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: bold;
      user-select: none;
      &:disabled {
        background: #424242;
      }
    }
  }
  ${media.lessThan('large')`
    z-index: 3;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    .inputs {
      background-color: rgba(235, 235, 235, 0.85);
      padding: 2px;
      box-shadow: 0px 8px 32px -4px rgba(0, 0, 0, 0.5), inset 0 0 0 0.5px rgba(0, 0, 0, 0.05);
      border-radius: 11px;
      input {
        &::placeholder {
          color: rgba(0, 0, 0, 0.35);
        }
      }
      button.cta {
        border-radius: 9px;
      }
    }
    h2, p, button.close, svg {
      display: none;
    }
  `}
  ${media.greaterThan('large')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 30vw;
    width: 30rem;
    gap: 1rem;
    h2 {
      margin: 0;
      line-height: 100%;
    }
    p {
      color: rgba(255, 255, 255, 0.5);
    }
    > button {
      margin-left: -.2rem;
      place-self: flex-start;
    }
    .inputs {
      flex-grow: 0;
    }
    > svg {
      place-self: flex-start;
      height: 48px;
    }
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
