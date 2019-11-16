import styled from 'styled-components';

export const MobNavStyles = styled.div`
  height: 100%;
  margin: 0;
  padding: 0;
`;

export const MenuButton = styled.button`
  position: absolute;
  top: 3.5rem;
  right: 3rem;
  font-size: 2rem;
  z-index: 4;

  @media (min-width: 860px) {
    display: none;
  }
`;

export const NavMobile = styled.div`
  height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.orange};
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 3;
  top: 0;
  padding-top: 20%;

  a {
    &:first-child {
      margin-top: 120px;
    }
    text-align: center;
  }

  &.hidden {
    display: none;
  }
`;

export const NavStyles = styled.ul`
  display: none;
  margin: 0;
  padding: 0;
  justify-self: end;
  font-size: 2rem;
  p {
    color: ${props => props.theme.black};
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 400;
    font-size: 1em;
  }
  a,
  button {
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 400;
    font-size: 1em;
    background: none;
    border: 0;
    cursor: pointer;
    color: ${props => props.theme.black};
    @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    }
    &:after {
      height: 2px;
      background: black;
      content: '';
      width: 0;
      position: absolute;
      transform: translateX(-50%);
      transition: width 0.4s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
      left: 50%;
      margin-top: 2rem;
    }
    &:hover,
    &:focus {
      outline: none;
      &:after {
        width: calc(100% - 60px);
      }
    }
  }
  @media (max-width: 1300px) {
    width: 100%;
    justify-content: flex-end;
    font-size: 1.5rem;
  }
  @media (min-width: 860px) {
    display: flex;
  }
`;

export default NavStyles;
