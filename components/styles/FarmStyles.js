import styled from 'styled-components';

const FarmStyles = styled.div`
  background: ${props => props.theme.grey};
  border: 1px solid ${props => props.theme.black};
  box-shadow: ${props => props.theme.bs};
  position: relative;
  display: flex;
  flex-direction: column;
  color: white;
  h1 {
    margin-bottom: 0;
  }
  a {
      color: ${props => props.theme.orange};
  }
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
  p {
    font-size: 12px;
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 0 3rem;
    font-size: 1.5rem;
  }
`;

export default FarmStyles;
