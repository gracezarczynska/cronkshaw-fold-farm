import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Authorisation/Signout';

const Nav = () => (
    <User>
      {({ data: { me } }) => (
        <NavStyles>
          {!me && (
            <>
              <Link href="/sign-in">
                <a>Sign in</a>
              </Link>
            </>
          )}
          {me && (
            <Signout>{me.name}</Signout>
          )}
          { me && me.subscriptions.length > 0 && (
            <Link href="/my-subscriptions">
              <a>My Subscriptions</a>
            </Link>
          )}
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/produce">
            <a>Produce</a>
          </Link>
          <Link href="/farms">
            <a>Farms</a>
          </Link>
        </NavStyles>
      )}
    </User>

);

export default Nav;
