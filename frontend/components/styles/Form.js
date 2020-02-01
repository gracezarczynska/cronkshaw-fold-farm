import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`;

const Form = styled.form`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid ${props => props.theme.black};
  padding: 20px;
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;

  &.request-reset { 
    max-width: 400px;
    margin: 0 auto;
    min-height: 300px;
  }

  a {
    color: white;
  }
  
  fieldset {
    display: flex;
  }
  h2 {
    text-align: center;
  }
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    font-size: 1rem;
    padding: 10px;
    margin: 4px 0 8px;
    border: 1px solid black;
    border: 1px solid ${props => props.theme.orange};
    color: white;
    background-color: transparent;

    &:focus {
      outline: 0;
      border-color: ${props => props.theme.orange};
    }
  }
  button,
  input[type='submit'] {
    width: auto;
    background: ${props => props.theme.orange};
    color: ${props => props.theme.black};
    border: 0;
    font-size: 2rem;
    padding: 0.5rem 1.2rem;
    width: 100%;
    max-width: 250px;
    margin: 20px auto;

    &:focus {
      outline: none;
      background-color: ${props => props.theme.black};
      color: ${props => props.theme.orange};
    }
  }
  fieldset {
    border: 0;
    padding: 0;

    &[disabled] {
      opacity: 0.5;
    }
    &[aria-busy='true']::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
  textarea {
    min-height: 75px;
  }
`;

export default Form;
