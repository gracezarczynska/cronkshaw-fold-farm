import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import StripeCheckout from 'react-stripe-checkout';
import calculateTotal from '../../lib/calcTotalPrice';
import formatMoney from '../../lib/formatMoney';
import { ButtonStyles } from '../styles/ButtonStyles';
import Error from '../ErrorMessage';
import User from '../User';

const ADD_INFO_USER = gql`
  mutation ADD_INFO_MUTATION(
    $id: ID!
    $address1: String!
    $address2: String
    $postcode: String!
    $city: String!
    $housePicture: String
    $dropOffPicture: String
    $productId: ID!
    $subscriptionFrequency: String!
    $subscriptionStartDate: DateTime!
    $deliveryInstructions: String
    $quantity: Int!
  ) {
    updateUser(
      id: $id
      address1: $address1
      address2: $address2
      postcode: $postcode
      city: $city
      housePicture: $housePicture
      dropOffPicture: $dropOffPicture
      deliveryInstructions: $deliveryInstructions
    ) {
      id
      email
      name
    }
    createEnrollment(
      id: $productId
      subscriptionFrequency: $subscriptionFrequency
      subscriptionStartDate: $subscriptionStartDate
      quantity: $quantity
    ) {
      user {
        subscriptions {
          id
        }
      }
    }
  }
`;

class Confirmation extends Component {
  onToken = async (res, createEnrollment, nextStep) => {
    console.log('On Token Called!');
    console.log(res.id);
    // manually call the mutation once we have the stripe token
    await createEnrollment({
      variables: {
        token: res.id
      }
    }).catch(err => {
      throw err;
    });

    nextStep();
  };
  goBack = e => {
    e.preventDefault();
    this.props.prevStep();
  };
  render() {
    const { subscriptionFrequency, quantity } = this.props.values;
    const { price, unit, pluralUnit, name } = this.props.product;
    return (
      <>
        <h2>Almost there!</h2>
        <h3>{name} are on the way</h3>
        <p>
          You have chosen a {subscriptionFrequency} subscription of {quantity}{' '}
          {quantity > 1 ? pluralUnit : unit}
        </p>
        {subscriptionFrequency === 'weekly' ||
        subscriptionFrequency === 'biweekly' ? (
          <p>
            Your monthly payment will differ based on amount of weeks in a
            month. This can be between{' '}
            {subscriptionFrequency === 'weekly'
              ? `${formatMoney(4 * quantity * price)} and ${formatMoney(
                  5 * quantity * price
                )}`
              : `${formatMoney(2 * quantity * price)} and ${formatMoney(
                  3 * quantity * price
                )}`}
          </p>
        ) : (
          <p>
            Your monthly payment will be {formatMoney(1 * quantity * price)}
          </p>
        )}
        <ButtonStyles onClick={this.goBack}>Go Back to Edit</ButtonStyles>
        <User>
          {({ data: { me } }) =>
            me && (
              <Mutation
                mutation={ADD_INFO_USER}
                variables={{
                  id: me.id,
                  ...this.props.values,
                  productId: this.props.produceId
                }}
              >
                {(createEnrollment, { error }) => (
                  <>
                    <Error error={error} />
                    <StripeCheckout
                      amount={calculateTotal(this.props.values)}
                      name='Cronkshaw Fold Farm'
                      description={`Your subscription order`}
                      stripeKey='pk_test_nCjbZkTimFUKFlBgY0H6ZDD300OOIX13Z4'
                      currency='GBP'
                      email={me.email}
                      token={res =>
                        this.onToken(res, createEnrollment, this.props.nextStep)
                      }
                    >
                      <ButtonStyles>Subscribe!</ButtonStyles>
                    </StripeCheckout>
                  </>
                )}
              </Mutation>
            )
          }
        </User>
      </>
    );
  }
}

export default Confirmation;
