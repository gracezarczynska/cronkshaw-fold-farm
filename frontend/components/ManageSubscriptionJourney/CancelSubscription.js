import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from '../User';
import gql from 'graphql-tag';
import { ButtonStyles } from '../styles/ButtonStyles';
import Error from '../ErrorMessage';

const DELETE_SUBSCRIPTION_MUTATION = gql`
  mutation DELETE_SUBSCRIPTION_QUERY($id: ID!) {
    deleteEnrollment(id: $id) {
      id
    }
  }
`;

class CancelSubscription extends Component {
  render() {
    return (
      <>
        <h2>Please don't leeeeaave!</h2>
        <h3>
          But if you really want to, that's ok. We will work on getting better
          in the hope of winning back your affections in the future. 😉
        </h3>
        <Mutation
          mutation={DELETE_SUBSCRIPTION_MUTATION}
          variables={{ id: this.props.id }}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {(deleteItem, { called, loading, data, error, client }) => (
            <>
              <Error error={error} />
              {!error && !loading && called && <p>Success! Goodbye...</p>}
              {!called && (
                <ButtonStyles
                  disabled={loading}
                  onClick={() => {
                    deleteItem();
                  }}
                >
                  Cancel your subscription
                </ButtonStyles>
              )}
            </>
          )}
        </Mutation>
      </>
    );
  }
}

export default CancelSubscription;
