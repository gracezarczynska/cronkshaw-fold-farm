import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from '../User';
import styled from 'styled-components';

const Button = styled.button`
  font-family: Helvetica, sans-serif;
  font-size: 1em;
`;
const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = props => (
  <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {signout => <Button onClick={signout}>Sign Out {props.children}</Button>}
  </Mutation>
);

export default Signout;
