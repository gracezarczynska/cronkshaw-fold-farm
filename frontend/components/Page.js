import React, { Component } from 'react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import Header from './Header';
import Meta from './Meta';

const theme = {
  orange: '#f29d12',
  black: '#222222',
  grey: '#2f2e2e',
  lightgrey: '#E1E1E1',
  darkgrey: '#202020',
  transparentGrey: 'rgba(47, 46, 46, 0.5)',
  offWhite: '#EDEDED',
  maxWidth: '1200px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)'
};

const StyledPage = styled.div`
  background-color: ${props => props.theme.grey};
  color: ${props => props.theme.offWhite};
  font-family: 'Helvetica';
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

injectGlobal`
  html {
    box-sizing: border-box;
    font-size: 10px;
    background-color: ${theme.grey};
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: Helvetica, sans-serif;
  }
  a {
    text-decoration: none;
    color: ${theme.black};
  }
  button {  font-family: Helvetica, sans-serif; }
`;

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <Header />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;
