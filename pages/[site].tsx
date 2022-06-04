import styled from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

const fast = { type: 'spring', stiffness: 2000, damping: 120, mass: 1 }

export default function Site() {
  const { query, back } = useRouter()

  return (
    <Dialog.Content forceMount asChild>
      <Content key="content">
        <motion.div
          key="txt"
          className="txt"
          initial="hidden"
          animate="shown"
          exit="hidden"
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
          layoutId={query.site as string}
          initial="hidden"
          animate="shown"
          exit="hidden"
          transition={{ default: fast, opacity: { duration: 0 } }}
          variants={{
            hidden: { opacity: 0 },
            shown: { opacity: 1 },
          }}>
          <motion.img src="story-reddit-1.png" alt="" />
        </motion.div>
      </Content>
    </Dialog.Content>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 400px 400px 400px;
  gap: 8px;
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
      opacity: 0;
    }
    img {
      width: 400px;
      border-radius: 16px;
    }
  }
`

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
