import styled from 'styled-components'
import { ChromeWebstore } from './icons/ChromeWebstore'

export const Layout = ({ children }) => {
  return (
    <Container>
      <div className="header">
        <h4>DesignFactory</h4>
        <h1>Story templates</h1>
        <ChromeWebstore />
      </div>
      {children}
    </Container>
  )
}

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 0 1rem 6vh 1rem;
  .header {
		display: grid;
    justify-content: space-between;
    grid-template-areas:
		'title chrome'
		'subtitle chrome';
		padding: 3vh 0;
    h1,
    h4 {
      line-height: 100%;
      margin: 0;
      padding: 0;
    }
    h4 {
      place-self: end start;
      opacity: 0.5;
    }
    svg {
      grid-area: chrome;
      height: 56px;
      width: auto;
			margin: auto;
			@media (max-width: 768px) {
				height: 42px;
			}
    }
  }
`
