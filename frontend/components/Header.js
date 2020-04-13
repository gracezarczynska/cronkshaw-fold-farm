import styled from 'styled-components';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';
import Nav from './Nav';
import User from './User';
import React, { Component } from 'react';


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
    height: calc(80% - 20px);
    padding-left: 20px;
    top: 10px;
    display: block;
  }
  img {
    height: 100%;
  }
  @media (min-width: 860px) {
    a {
      height: calc(100% - 20px);
    }
    img {
      height: 100%;
    }
  }
`

const StyledHeader = styled.header`
  .bar {
    -webkit-box-shadow: 0px 10px 12px -1px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 10px 12px -1px rgba(0,0,0,0.75);
    box-shadow: 0px 10px 12px -1px rgba(0,0,0,0.75);
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

const StyledSubheader = styled.div`
    background-color: ${props => props.theme.orange};
    color: ${props => props.theme.black};
    width: 100%;
    text-align: center;
    padding: 10px;
    position: relative;
    top: -10px;
`;

class Header extends Component {
  render () {
    return (
      <User>
      {({ data: { me } }) => (
        <>
      <StyledHeader>
        <div className="bar">
          <Logo>
            <Link href="/">
              <a><img src="./static/cronkshaw-logo.webp" /></a>
            </Link>   
          </Logo>
          <Nav me={me}/>
        </div>
      </StyledHeader>
        { me && !me.active &&
          <StyledSubheader>
            Please verify your email before subscribing to our services.
          </StyledSubheader> 
        }
      </>
      )}
    </User>
    )
  }
};

export default Header;
