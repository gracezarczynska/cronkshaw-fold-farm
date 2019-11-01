import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  border: 1px solid ${props => props.theme.black};
  thead {
    font-size: 15px;
  }
  td,
  th {
    border-bottom: 1px solid ${props => props.theme.black};
    border-right: 1px solid ${props => props.theme.black};
    padding: 5px;
    position: relative;
    text-align: center;
    &:last-child {
      border-right: none;
      width: 150px;
      button {
        width: 100%;
      }
    }
    label {
      padding: 10px 5px;
      display: block;
    }
    button {
      margin: 20px 0;
    }
    textarea {
      &:focus {
        outline: none;
      }
    }
  }
  tr {
    &:hover {
      background: ${props => props.theme.black};
    }
  }
`;

export default Table;
