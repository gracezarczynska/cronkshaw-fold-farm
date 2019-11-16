import Link from 'next/link';
import {
  NavStyles,
  MobNavStyles,
  MenuButton,
  NavMobile
} from './styles/NavStyles';
import User from './User';
import Signout from './Authorisation/Signout';

import React, { Component } from 'react';

class Nav extends Component {
  state = {
    navOpened: false
  };

  handleClick = () => {
    this.setState({ navOpened: !this.state.navOpened });
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <>
            <NavStyles>
              {!me && (
                <>
                  <Link href='/sign-in'>
                    <a>Sign in</a>
                  </Link>
                </>
              )}
              {me && <Signout>{me.name}</Signout>}
              {me && me.subscriptions.length > 0 && (
                <Link href='/my-subscriptions'>
                  <a>My Subscriptions</a>
                </Link>
              )}
              <Link href='/produce'>
                <a>Produce</a>
              </Link>
              <Link href='/farms'>
                <a>Farms</a>
              </Link>
            </NavStyles>
            <MobNavStyles>
              <MenuButton onClick={this.handleClick} color='white'>
                {this.state.navOpened ? 'Close' : 'Menu'}
              </MenuButton>
              <NavMobile className={this.state.navOpened ? '' : 'hidden'}>
                {!me && (
                  <>
                    <Link href='/sign-in'>
                      <a onClick={this.handleClick}>Sign in</a>
                    </Link>
                  </>
                )}
                {me && <Signout>{me.name}</Signout>}
                {me && me.subscriptions.length > 0 && (
                  <Link href='/my-subscriptions'>
                    <a onClick={this.handleClick}>My Subscriptions</a>
                  </Link>
                )}
                <Link href='/produce'>
                  <a onClick={this.handleClick}>Produce</a>
                </Link>
                <Link href='/farms'>
                  <a onClick={this.handleClick}>Farms</a>
                </Link>
              </NavMobile>
            </MobNavStyles>
          </>
        )}
      </User>
    );
  }
}

export default Nav;
