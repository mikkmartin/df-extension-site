import { FC, useEffect, createContext, useContext } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, useAnimation } from 'framer-motion'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Close } from 'components/icons/Close'
import { media } from 'components/GlobalStyles'

type RootProps = {
  open: boolean
  children: React.ReactNode
  onOpenChange: (state: boolean) => void
}
const fast = { type: 'spring', stiffness: 2000, damping: 120, mass: 1 }

const RootContext = createContext<{ setOverlayOpacity: (progress: number) => void }>(
  undefined as any
)

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

export const Image = (props: any) => {
  return (
    <StyledImage
      {...props}
      transition={fast}
      drag="y"
      dragElastic={0.2}
      // animate={imageAnimation}
      // onDragStart={handleDragStart}
      // onDrag={handleDrag}
      // onDragEnd={handleDragEnd}
      // onUpdate={handleUpdate}
      // onTap={handleTap}
    />
  )
}

const StyledContent = styled(motion.div)`
  ${media.greaterThan('large')`
    position: fixed;
    display: flex;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    max-height: 80vh;
    flex-direction: row-reverse;
  `}
  ${media.lessThan('large')`
    display: content;
  `}
`
const StyledImage = styled(motion.img)`
  ${media.lessThan('large')`
    position: fixed;
    width: auto;
    max-width: 100%;
    max-height: 100%;
    inset: 0;
    margin: auto;
    border-radius: 8px;
  `}
  ${media.greaterThan('large')`
  `}
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
`
const Overlay = styled(motion.div)`
  background-color: rgba(50, 55, 65, 0.83);
  backdrop-filter: blur(32px) saturate(180%);
  position: fixed;
  inset: 0;
`
