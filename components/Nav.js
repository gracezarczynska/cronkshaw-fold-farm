import Link from 'next/link';

const Nav = () => (
      <div>
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
      </div>
);

export default Nav;
