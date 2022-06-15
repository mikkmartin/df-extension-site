import { ChromeWebstore } from 'components/icons/ChromeWebstore'
import styled from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { defaultTemplates } from 'data/defaultTemplates'
import { FC } from 'react'
import { GetServerSideProps } from 'next'
import { Chevron } from 'components/icons/Chevron'
import * as Modal from 'components/PreviewModal'

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
    <Modal.Content>
      <Modal.Image layoutId={id} src={src} />
      <Modal.Panel title={name} description={description} placeholder={url} />
    </Modal.Content>
  )
}

// const Story: FC<Props> = ({ id, src, name, url, description }) => {
//   const { setOverlayOpacity } = useModal()

//   const isDragging = useRef(true)
//   const showPanel = useRef(true)
//   const [anticipateClose, setAnticipateClose] = useState(false)
//   const imageAnimation = useAnimation()
//   const panelAnimation = useAnimation()
//   const opacity = useMotionValue(0)
//   const duration = 0.1

//   const router = useRouter()
//   const isOpen = router.asPath !== '/'

//   const setIsOpen = (state: boolean) => {
//     if (!state) router.push('/', undefined, { scroll: false })
//   }

//   useEffect(() => {
//     if (isOpen) {
//       imageAnimation.start('visible')
//       panelAnimation.start('visible')
//     }
//   }, [isOpen])

//   const handleDragStart = () => {
//     panelAnimation.start('hidden')
//     isDragging.current = true
//   }

//   const handleDrag = (_, info: PanInfo) => {
//     const { offset } = info
//     const shouldClose = offset.y > 75 || offset.y < -75
//     if (shouldClose && !anticipateClose) setAnticipateClose(true)
//     else if (!shouldClose && anticipateClose) setAnticipateClose(false)
//     if (isOpen) updateOverlay(offset.y)
//   }

//   useEffect(() => {
//     if (anticipateClose) imageAnimation.start({ scale: 0.8 })
//     else imageAnimation.start({ scale: 1 })
//   }, [anticipateClose])

//   const handleUpdate = pos => {
//     if (isOpen) updateOverlay(pos.y)
//   }

//   const handleDragEnd = (_, info: PanInfo) => {
//     setTimeout(() => (isDragging.current = false), 1)
//     const { velocity, offset } = info
//     const shouldClose = velocity.y > 20 || velocity.y < -20 || offset.y > 200 || offset.y < -200
//     if (shouldClose) {
//       setIsOpen(false)
//     } else {
//       imageAnimation.start({ y: 0 })
//       panelAnimation.start('visible')
//     }
//   }

//   const updateOverlay = y => {
//     y = Math.abs(y)
//     const opacity = transform(y, [0, window.innerHeight / 4], [1, 0])
//     setOverlayOpacity(opacity)
//   }

//   const handleTap = (ev, info) => {
//     if (isDragging.current) return
//     if (showPanel.current) {
//       panelAnimation.start('hidden')
//       showPanel.current = false
//     } else {
//       panelAnimation.start('visible')
//       showPanel.current = true
//     }
//   }

//   return (
//     <Content forceMount asChild>
//       <motion.div>
//         <motion.img
//           transition={fast}
//           layoutId={id}
//           src={src}
//           drag="y"
//           dragElastic={0.2}
//           animate={imageAnimation}
//           onDragStart={handleDragStart}
//           onDrag={handleDrag}
//           onDragEnd={handleDragEnd}
//           onUpdate={handleUpdate}
//           onTap={handleTap}
//           variants={{
//             default: { scale: 1 },
//             anticipateClose: { scale: 0.7 },
//           }}
//           style={{ borderRadius: 8 }}
//         />
//         <motion.div
//           className="panel-bottom"
//           transition={{ duration: 0.1 }}
//           initial="hidden"
//           animate={panelAnimation}
//           exit="hidden"
//           variants={{
//             visible: { opacity: 1, y: 0 },
//             hidden: { opacity: 0, y: 20 },
//           }}>
//           <Dialog.Title>{name}</Dialog.Title>
//           <Dialog.Close className="close">
//             <Close />
//           </Dialog.Close>
//           <div className="inputs">
//             <input type="text" placeholder={url} />
//             <button className="cta">Generate</button>
//           </div>
//         </motion.div>
//       </motion.div>
//     </Content>
//   )
// }

// const Content = styled(Dialog.Content)`
//   --border-radius: 99rem;

//   img {
//     position: fixed;
//     width: auto;
//     max-width: 100%;
//     max-height: calc(100% - 8px);
//     inset: 0;
//     margin: 0 auto;
//     border-radius: 8px;
//   }
//   .panel-bottom {
//     position: fixed;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background: rgba(0, 0, 0, 0.65);
//     color: white;
//     width: 100%;
//     padding: 12px 16px 16px;
//     display: grid;
//     grid-template-columns: 1fr auto;
//     grid-template-areas: 'title close' 'input input';
//     flex-direction: column;
//     gap: 6px 4px;
//     backdrop-filter: blur(42px) saturate(160%);
//     opacity: 0.5;
//     h2 {
//       font-size: 24px;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       overflow: hidden;
//       width: 100%;
//       font-weight: 600;
//       margin-bottom: 8px;
//       grid-area: title;
//       place-self: end start;
//     }
//     button.close {
//       width: 40px;
//       height: 40px;
//       transform: translate(4px, -4px);
//       border-radius: 99rem;
//       border: none;
//       font-size: 14px;
//       background: rgba(255, 255, 255, 0);
//       color: white;
//       display: grid;
//       place-items: center;
//       opacity: 0.5;
//       svg {
//         width: 20px;
//       }
//       &:focus {
//         outline: none;
//       }
//       &:active {
//         background: white;
//         color: black;
//         opacity: 1;
//       }
//     }
//     .inputs {
//       grid-area: input;
//       display: flex;
//       width: 100%;
//       background-color: rgba(0, 0, 0, 0.2);
//       border-radius: 99rem;
//       //box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
//       padding: 4px;
//       margin: -4px;
//       backdrop-filter: blur(42px) saturate(160%);
//       input {
//         height: 42px;
//         min-width: 100px;
//         flex-grow: 1;
//         padding-left: 16px;
//         text-overflow: ellipsis;
//         border-radius: var(--border-radius);
//         border: none;
//         background: none;
//         font-size: 16px;
//         &:focus {
//           outline: none;
//           color: white;
//         }
//         ::placeholder {
//           color: rgba(255, 255, 255, 0.4);
//         }
//       }
//       button.cta {
//         flex-grow: auto;
//         background: white;
//         padding: 0 24px;
//         color: black;
//         border: none;
//         border-radius: var(--border-radius);
//         font-size: 14px;
//         text-transform: uppercase;
//         font-weight: bold;
//         user-select: none;
//       }
//     }
//   }
// `

const StoryDesktop: FC<Props> = ({ id, src, name, url, description }) => {
  return (
    <Dialog.Content forceMount asChild>
      <ContentDesktop key="content" initial="hidden" animate="shown" exit="hidden">
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
      </ContentDesktop>
    </Dialog.Content>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
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

const ContentDesktop = styled(motion.div)`
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
    display: grid;
    place-items: start center;
    aspect-ratio: 1314 / 2661;
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
