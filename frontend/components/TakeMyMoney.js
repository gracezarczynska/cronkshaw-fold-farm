import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
    }
  }
`;

class TakeMyMoney extends React.Component {
  onToken = (res, createOrder) => {
    console.log('On Token Called!');
    console.log(res.id);
    // manually call the mutation once we have the stripe token
    createOrder({
      variables: {
        token: res.id,
      },
    }).catch(err => {
      alert(err.message);
    });
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                amount={1000}
                name="Cronkshaw Fold Farm"
                description={`Order of 1 items!`}
                image={'https://hips.hearstapps.com/del.h-cdn.co/assets/18/08/2048x1024/landscape-1519321899-hard-boiled-eggs-horizontal.jpg?resize=480:*'}
                stripeKey="pk_test_nCjbZkTimFUKFlBgY0H6ZDD300OOIX13Z4"
                currency="GBP"
                email={'m.zarczynska@gmail.com'}
                token={res => this.onToken(res, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
