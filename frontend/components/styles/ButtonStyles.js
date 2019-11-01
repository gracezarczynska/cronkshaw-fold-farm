import styled from 'styled-components';

export const ButtonStyles = styled.button`
    width: auto;
    background: ${props => props.theme.orange};
    color: ${props => props.theme.black};
    border: 0;
    font-size: 2rem;
    padding: 0.5rem 1.2rem;
    width: 100%;
    max-width: 250px;
    margin: 20px 10px;

    &:active {
      outline: none;
      background-color: ${props => props.theme.grey};
      color: ${props => props.theme.orange};
    }

    &:focus {
      outline: none;
    }
`;

export const NumberInput = styled.select`
  background-color: ${props => props.theme.grey};
  border: 1px solid ${props => props.theme.orange};
  padding: 10px;
  color: white;
`;
