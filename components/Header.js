import styled from 'styled-components';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';
import Nav from './Nav';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Logo = styled.div`
  a {
    position: absolute;
    height: calc(100% - 20px);
    top: 10px;
    display: block;
  }
  img {
    height: 100%;
  }
`

const StyledHeader = styled.header`
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: 1fr auto;
    justify-content: space-between;
    align-items: stretch;
    background-color: ${props => props.theme.orange};
    height: 100px;
    position: relative;
    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a><img src="./static/cronkshaw-logo.webp" /></a>
        </Link>   
      </Logo>
      <Nav />
    </div>
  </StyledHeader>
);

export default Header;
