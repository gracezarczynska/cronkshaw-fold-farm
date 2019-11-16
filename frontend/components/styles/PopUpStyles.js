import styled from 'styled-components';

export const PopUpStyles = styled.div`
  position: absolute;
  z-index: 1;
  background-color: ${props => props.theme.grey};
  left: calc(100% + 7px);
  width: 300px;

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;

    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid ${props => props.theme.grey};
    left: -8px;

    top: 7px;
  }

  button {
    border: 0;
    font-size: 2rem;
    padding: 0.5rem 1.2rem;
    width: 100%;
    max-width: 250px;
    margin: 10px 10px;
  }
`;
