import React, { Component } from 'react';
import { Mutation, compose, graphql } from "react-apollo";
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Error from '../ErrorMessage';
import { ButtonStyles } from '../styles/ButtonStyles';
import Link from 'next/link';
import { CURRENT_USER_QUERY } from '../User';

const VERIFY_EMAIL_MUTATION = gql`
  mutation VERIFY_EMAIL_MUTATION($activationToken: String!) {
    verifyEmail(activationToken: $activationToken) {
      message
    }
  }
`;

class CallVerify extends Component {
  componentDidMount() {
    this.props.verify();
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

class Activate extends Component {
  static propTypes = {
    activationToken: PropTypes.string.isRequired,
  };

  render() {
    const { activationToken } = this.props;
    return (
      <Mutation mutation={VERIFY_EMAIL_MUTATION} variables={{ activationToken }} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(verify, { data, error }) => (
        <>
          <CallVerify verify={verify}>
            <div>
              <Error error={error} />
              { data && (
                <>
                  <p>{data.verifyEmail.message}</p>
                  <ButtonStyles><Link href='/produce'>Go find some delish produce</Link></ButtonStyles>
                </>
                )
               }
            </div>
          </CallVerify>
        </>
        )}
      </Mutation>    
    );
  }
}

export default Activate;