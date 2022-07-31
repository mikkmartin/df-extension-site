import * as Accordion from '@radix-ui/react-accordion'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash } from 'components/icons/Trash'
import { ExternalLink } from 'components/icons/ExternalLink'
import * as Tooltip from '@radix-ui/react-tooltip'

const smooth = { type: 'spring', stiffness: 500, damping: 40, mass: 1 }

export const LinkAccordion = ({ data, onSelect, focusIndex, onRemove }) => {
  const [currentTab, setCurrentTab] = useState(data[0].url)
  const containerEl = useRef<HTMLDivElement>(null)
  const nth = useRef(0)

  useEffect(() => {
    setCurrentTab(data[focusIndex].url)
  }, [focusIndex])

  const handleFocus = (_, url, i) => {
    onSelect && onSelect(i)
    setCurrentTab(url)
  }

  nth.current = -1
  return (
    <Container type="single" value={currentTab} ref={containerEl}>
      {Object.entries(groupBySite(data)).map(([hostname, data], i) => {
        return (
          <>
            <div className="header" key={i}>
              <span>{hostname.split('www.')[1] || hostname}</span>
            </div>
            {data.map((data, _i) => {
              nth.current += 1
              const _nth = nth.current
              const hasMissingValues =
                data.selectors && !missingValues(data.selectors, data.pageData)
              return (
                <Item
                  key={_i}
                  value={data.url}
                  className={hasMissingValues ? 'error' : ''}
                  onFocus={ev => handleFocus(ev, data.url, _nth)}>
                  <div className="header">
                    <Accordion.Trigger asChild>
                      <input type="text" value={data.url} />
                    </Accordion.Trigger>
                    <a className="button" href={data.url} target="_blank">
                      <ExternalLink />
                    </a>
                    <button onClick={() => onRemove(data.url)}>
                      <Trash />
                    </button>
                  </div>
                  <AnimatePresence>
                    {currentTab === data.url && (
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
                        key={data.url}
                        forceMount>
                        {data.pageData && (
                          <KeyValueList selectors={data.selectors} obj={data.pageData} />
                        )}
                      </Content>
                    )}
                  </AnimatePresence>
                </Item>
              )
            })}
          </>
        )
      })}
    </Container>
  )
}

const missingValues = (selectors, obj) =>
  Object.entries(selectors).every(([key]) => {
    if (!obj[key]) {
      return false
    } else {
      return true
    }
  })

const Content = styled(motion(Accordion.Content))`
  overflow: hidden;
`

const KeyValueList = ({
  selectors,
  obj,
}: {
  selectors: { [key: string]: any }
  obj: { [key: string]: string }
}) => {
  return (
    <StyledList
      initial="closed"
      animate="open"
      exit="closed"
      transition={smooth}
      variants={{
        closed: {
          opacity: 0,
          y: -20,
        },
        open: {
          opacity: 1,
          y: 0,
        },
      }}>
      {Object.entries(selectors).map(([key, value]) => (
        <li key={key} className={obj[key] ? '' : 'missing'}>
          <span>{key}</span>
          <ToolTip value={value}>
            <span>{obj[key]?.toString() || '---'}</span>
          </ToolTip>
        </li>
      ))}
    </StyledList>
  )
}

const ToolTip = ({ children, value }) => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <StyledToolTop sideOffset={20} side="right">
          <small>{value}</small>
          <Tooltip.Arrow />
        </StyledToolTop>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
)

const StyledToolTop = styled(Tooltip.Content)`
  background: black;
  padding: 6px 8px;
  border-radius: 4px;
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 90%;
`

const Container = styled(Accordion.Root)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  > .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 16px;
    span {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.5;
    }
    > button {
      all: none;
    }
  }
`

const StyledList = styled(motion.ul)`
  list-style: none;
  padding-bottom: 4px;
  font-size: 10px;
  li {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;
    gap: 16px;
    position: relative;
    &:after {
      content: ' ';
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      top: 0;
      right: 0;
      left: 16px;
      height: 1px;
    }
    span:nth-child(2) {
      opacity: 0.5;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.missing {
      span {
        color: red;
      }
    }
  }
`

const Item = styled(Accordion.Item)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  position: relative;
  :focus-within {
    box-shadow: inset 0 0 0 1px rgb(0, 119, 255), 0 0 0 2px rgb(0, 119, 255, 0.2);
  }
  &.error {
    &:not(:focus-within) {
      &:after {
        content: ' ';
        position: absolute;
        right: 8px;
        top: 8px;
        width: 4px;
        height: 4px;
        background: red;
        border-radius: 3px;
      }
    }
    :focus-within {
      box-shadow: inset 0 0 0 1px rgb(255, 0, 0), 0 0 0 2px rgb(255, 0, 0, 0.2);
    }
  }
  > .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    input {
      border: none;
      background: none;
      padding: 12px;
      padding-left: 16px;
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
    button,
    .button {
      flex-shrink: 0;
      opacity: 0;
      background: none;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      svg {
        height: 16px;
        width: auto;
      }
      &:hover,
      &:focus {
        background: #ffffff1e;
      }
    }
    .button {
      border-radius: 50%;
      width: 28px;
      height: 28px;
      svg {
        height: 14px;
        margin-top: -1px;
      }
    }
    &:hover,
    &:focus-within {
      button,
      .button {
        opacity: 1;
      }
    }
  }
`

const groupBySite = siteData => {
  const groups: { [key: string]: TemplateData[] } = {}
  siteData.forEach(site => {
    const hostname = new URL(site.url).hostname
    if (!groups[hostname]) groups[hostname] = []
    groups[hostname].push(site)
  })
  return groups
}
