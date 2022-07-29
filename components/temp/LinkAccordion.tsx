import * as Accordion from '@radix-ui/react-accordion'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash } from 'components/icons/Trash'
import { ExternalLink } from 'components/icons/ExternalLink'
import Link from 'next/link'

const smooth = { type: 'spring', stiffness: 500, damping: 40, mass: 1 }

export const LinkAccordion = ({ data, onSelect, onRemove }) => {
  const [currentTab, setCurrentTab] = useState(data[0].url)
  const nth = useRef(0)

  // const formatSubUrl = (url, hostname) => {
  //   const subUrl = url.split(hostname)[1]
  //   return Boolean(subUrl.length > 0) ? url : subUrl
  // }

  const handleFocus = (ev, url, i) => {
    //console.log(ev.target.select())
    onSelect && onSelect(i)
    setCurrentTab(url)
  }

  nth.current = -1
  return (
    <Container type="single" value={currentTab}>
      {Object.entries(groupBySite(data)).map(([hostname, data], i) => {
        return (
          <>
            <div className="header" key={i}>
              <span>{hostname.split('www.')[1] || hostname}</span>
            </div>
            {data.map((data, _i) => {
              nth.current += 1
              const _nth = nth.current
              return (
                <Item key={_i} value={data.url} onFocus={ev => handleFocus(ev, data.url, _nth)}>
                  <div className="header">
                    <Accordion.Trigger asChild>
                      <input type="text" value={data.url} />
                    </Accordion.Trigger>
                    <Link href={data.url} target="_blank">
                      <button>
                        <ExternalLink />
                      </button>
                    </Link>
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
                        {data.pageData && <ConstKeyValueList obj={data.pageData} />}
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

const Content = styled(motion(Accordion.Content))`
  overflow: hidden;
`

const ConstKeyValueList = ({ obj }: { obj: { [key: string]: string } }) => {
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
      {Object.entries(obj).map(([key, value]) => (
        <li key={key}>
          <span>{key}</span>
          <span>{value}</span>
        </li>
      ))}
    </StyledList>
  )
}

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
  }
`

const Item = styled(Accordion.Item)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  :focus-within {
    box-shadow: inset 0 0 0 1px rgb(0, 119, 255), 0 0 0 2px rgb(0, 119, 255, 0.2);
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
    button {
      opacity: 0;
      background: none;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        height: 16px;
        width: auto;
      }
      &:hover,
      &:focus {
        background: #ffffff1e;
      }
    }
    &:hover,
    &:focus-within {
      button {
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
