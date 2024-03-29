import {
  Root,
  Item as ItemBase,
  Header as HeaderBase,
  Trigger,
  Content as ContentBase,
} from '@radix-ui/react-accordion'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import styled from 'styled-components'

const smooth = { type: 'spring', stiffness: 500, damping: 40, mass: 1 }
const fast = { type: 'spring', stiffness: 2000, damping: 120, mass: 1 }

export const Accordion = ({ tabs, onSelect, pseudoFocus }) => {
  const [currentTab, setCurrentTab] = useState(tabs[0])

  const handleSelect = (tab, i) => {
    setCurrentTab(tab)
    onSelect && onSelect(i)
  }

  return (
    <Container type="single" value={currentTab}>
      {tabs.map((tab, i) => (
        <Item
          key={tab}
          value={tab}
          onFocus={() => handleSelect(tab, i)}
          data-pseudofocus={i === pseudoFocus ? 'true' : 'false'}>
          <Header as="div">
            <Trigger asChild>
              <input type="text" defaultValue={tab} />
            </Trigger>
          </Header>
          <AnimatePresence>
            {currentTab === tab && (
              <Content
                initial="closed"
                animate="open"
                exit="closed"
                transition={smooth}
                variants={{
                  closed: {
                    height: 0,
                  },
                  open: {
                    height: 'auto',
                  },
                }}
                key={tab}
                forceMount>
                <motion.div
                  key="a"
                  className="content"
                  transition={{
                    ...fast,
                    delayChildren: 0.01,
                    staggerChildren: 0.01,
                    opacity: { duration: 0.2 },
                  }}
                  style={{ transformOrigin: '50% 50%' }}
                  variants={{
                    closed: {
                      opacity: 0,
                      scale: 0.98,
                    },
                    open: {
                      opacity: 1,
                      scale: 1,
                    },
                  }}>
                  {[0, 1].map(i => (
                    <motion.input
                      key={i}
                      type="text"
                      transition={fast}
                      variants={{
                        closed: { opacity: 0, scale: 0.9, y: 3 },
                        open: { opacity: 1, scale: 1, y: 0 },
                      }}
                      placeholder="Some input"
                    />
                  ))}
                </motion.div>
              </Content>
            )}
          </AnimatePresence>
        </Item>
      ))}
    </Container>
  )
}

const Container = styled(Root)`
  position: sticky;
  top: 0;
  bottom: 0;
  display: grid;
  gap: 4px;
  padding-bottom: 50vh;
  h3 {
    margin: 0;
    padding: 0;
  }
`
const Item = styled(ItemBase)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  &[data-pseudofocus='true'] {
    box-shadow: 0 0 0 2px rgb(0, 119, 255);
  }
  &:focus-within {
    background: rgba(255, 255, 255, 0.2);
  }
`
const Header = styled(HeaderBase)`
  input {
    border: none;
    background: none;
    padding: 12px;
    margin-top: -8px;
    padding-top: 20px;
    outline: none;
    width: 100%;
    text-align: left;
    color: white;
    line-height: 150%;
    ::selection {
      background: rgb(0, 119, 255);
    }
  }
`
const Content = styled(motion(ContentBase))`
  overflow: hidden;
  display: grid;
  align-items: center;
  border-radius: 0px 0px 4px 4px;
  .content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  input {
    background: rgba(0, 0, 0, 0.2);
    border: none;
    padding: 3px;
    color: white;
    padding: 8px;
    border-radius: 4px;
    &:focus {
      box-shadow: 0 0 0 0.5px rgb(0, 119, 255);
    }
  }
`
