import { createGlobalStyle } from 'styled-components'

export const fontStack =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";'

export const breakpoints = {
  xs: '0px',
  sm: '576px',
}

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :root {
    font-family: ${fontStack};
    font-size: 16px;
    --highlight: 0, 122, 255;
    --background: #282C34;
    --background-l2: #32363E;
    --error: #fa755a;
    --input-border-radius: 2px;
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
    font-size: 3.052rem;
  }
  h2 {font-size: 2.441rem;}
  h3 {font-size: 1.953rem;}
  h4 {font-size: 1.563rem;}
  h5 {font-size: 1.25rem;}
  small, .text_small {font-size: 0.8rem;}
  @media (max-width: 768px) {
    &:root {
      font-size: 75%;
    }
    h1 {
      margin-top: 0;
      font-size: 1.802rem;
    }
    h2 {font-size: 1.602rem;}
    h3 {font-size: 1.424rem;}
    h4 {font-size: 1.266rem;}
    h5 {font-size: 1.125rem;}
    small, .text_small {font-size: 0.889rem;}
  }
`
