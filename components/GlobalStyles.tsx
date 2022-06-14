import { createGlobalStyle } from 'styled-components'
import * as _media from 'styled-media-query'
import { useWindowSize } from 'react-use'

const defaultBreakpoints = {
  huge: 1440,
  large: 1170,
  medium: 768,
  small: 450,
}

type Point = keyof typeof defaultBreakpoints
type UseMedia = () => {
  lessThan: (p: Point) => boolean
  greaterThan: (p: Point) => boolean
  between: (p1: Point, p2: Point) => boolean
}

export const useMedia: UseMedia = () => {
  const { width } = useWindowSize()
  return {
    lessThan: (p: Point) => width < defaultBreakpoints[p],
    greaterThan: (p: Point) => width > defaultBreakpoints[p],
    between: (p1: Point, p2: Point) =>
      width > defaultBreakpoints[p1] && width < defaultBreakpoints[p2],
  }
}

export const media = _media.default

export const fontStack =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";'

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
  }
  :root {
    font-family: ${fontStack};
    font-size: 100%; /*16px*/
    --highlight: 0, 122, 255;
    --background: #282C34;
    --background-l2: #32363E;
    --error: #fa755a;
    --input-border-radius: 4px;
    line-height: 1.75;
  }
  body, #__next {
    background: var(--background);
    color: white;
  }
  h1, h2, h3, h4, h5 {
    margin: 3rem 0 1.38rem;
    font-weight: 600;
    line-height: 1.3;
  }
  h1 {
    margin-top: 0;
    font-size: 4.209rem;
  }
  h2 {font-size: 3.157rem;}
  h3 {font-size: 2.369rem;}
  h4 {font-size: 1.777rem;}
  h5 {font-size: 1.333rem;}
  small, .text_small {font-size: 0.75rem;}
  @media (max-width: 768px) {
    :root {
      font-size: 87.5%; /*14px*/
      line-height: 1.5;
    }
    h1, h2, h3, h4, h5 {
      margin: 3rem 0 1.38rem;
      line-height: 1.3;
    }
    h1 {
      margin-top: 0;
      font-size: 1.383rem;
    }
    h2 {font-size: 1.296rem;}
    h3 {font-size: 1.215rem;}
    h4 {font-size: 1.138rem;}
    h5 {font-size: 1.067rem;}
    small, .text_small {font-size: 0.937rem;}
  }

  button {
    border: none;
    background: rgba(255, 255, 255, 0.05);
    color: inherit;
    padding: .5rem 1rem;
    border-radius: 99rem;
    font-family: inherit;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: .5rem;
    line-height: 1.5rem;
    cursor: pointer;
    &:hover, &:focus {
      background: rgba(255, 255, 255, 0.1);
      outline: none;
    }
    &:active {
      background: white;
      color: black;
    }
    svg {
      margin-left: -.5rem;
    }
  }
  form {
    display: flex;
    gap: 4px;
    input {
      height: 3rem;
      padding: 0 1rem 0 1rem;
      border: none;
      border-radius: var(--input-border-radius);
      display: flex;
      gap: 4px;
      width: 15rem;
      font-family: inherit;
      font-size: 1rem;
      text-overflow: ellipsis;
      &:focus {
        outline: none;
      }
    }
    button[type=submit] {
      background: rgba(var(--highlight), 1);
      border-radius: var(--input-border-radius);
      height: 3rem;
      padding: 0 1.5rem;
      font-weight: 600;
    }
  }
`
