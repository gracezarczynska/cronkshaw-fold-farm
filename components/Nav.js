import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = () => (
      <NavStyles>
        <Link href="/sign-up">
          <a>Sign up</a>
        </Link>
        <Link href="/sign-in">
          <a>Sign in</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="farms">
          <a>Farms</a>
        </Link>
      </NavStyles>
);

export default Nav;
