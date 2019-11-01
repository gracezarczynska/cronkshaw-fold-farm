import styled from 'styled-components';

const FormStyles = styled.form`
  fieldset {
    border: none;
    display: flex;
    h2 {
      text-align: center;
    }
    label {
      max-width: 300px;
      margin: 0 auto;
    }
    input {
      width: 100%;
      border: 1px solid ${props => props.theme.orange};
      padding: 10px;
      margin: 4px 0 8px;
      color: white;
      background-color: transparent;
    }
    button {
      margin: 20px 10px;
    }
    button[type='submit'] {
      width: 100%;
      max-width: 250px;
      padding: 8px;
      font-size: 1.2em;
      margin: 20px auto;
      border: none;
      background-color: ${props => props.theme.orange};
      color: ${props => props.theme.black};

      &:focus {
        outline: none;
        background-color: ${props => props.theme.grey};
        color: ${props => props.theme.orange};
      }
    }
    textarea {
      min-height: 75px;
    }
  }
`;

export default FormStyles;
