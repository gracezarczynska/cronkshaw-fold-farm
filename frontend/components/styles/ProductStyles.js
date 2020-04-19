import styled from 'styled-components';

const Item = styled.div`
  background: ${props => props.theme.grey};
  border: 1px solid ${props => props.theme.black};
  box-shadow: ${props => props.theme.bs};
  position: relative;
  display: flex;
  flex-direction: column;
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
  h1 {
    margin-bottom: 0;
  }
  a {
      color: ${props => props.theme.orange};
  }
  p {
    font-size: 12px;
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 0 3rem;
    font-size: 1.5rem;
  }

  .verify {
    background: ${props => props.theme.orange};
    color: ${props => props.theme.black};
    width: 100%;
  }
  .buttonList {
    display: grid;
    width: 100%;
    border-top: 1px solid ${props => props.theme.black};
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1px;
    background: ${props => props.theme.black};
    & > * {
      background: ${props => props.theme.grey};
      border: 0;
      font-size: 1.3rem;
      padding: 1.3rem;
      color: ${props => props.theme.orange};
    }
  }
`;

export default Item;
