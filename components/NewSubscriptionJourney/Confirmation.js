import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ButtonStyles } from '../styles/ButtonStyles';
import Error from '../ErrorMessage';
import User from '../User';

const ADD_INFO_USER = gql`
    mutation ADD_INFO_MUTATION($id: ID!, $address1: String!, $address2: String, $postcode: String!, $city: String!, $housePicture: String, $dropOffPicture: String, $productId: ID!, $subscriptionFrequency: String!, $subscriptionStartDate: DateTime!, $deliveryInstructions: String, $quantity: Int!) {
        updateUser(id: $id, address1: $address1, address2: $address2, postcode: $postcode, city: $city, housePicture: $housePicture, dropOffPicture: $dropOffPicture, deliveryInstructions: $deliveryInstructions) {
            id
            email
            name
        }
        createEnrollment(id: $productId, subscriptionFrequency: $subscriptionFrequency, subscriptionStartDate: $subscriptionStartDate, quantity: $quantity) {
            user {
                subscriptions {
                    id
                }
            }
        }
    }
`;

class Confirmation extends Component {
    render() {
        return (
            <User>
                {({ data: { me } }) => (
                me && 
                    <Mutation mutation={ADD_INFO_USER} variables={{ id: me.id, ...this.props.values, productId: this.props.produceId } } >
                        {(edit, { error, loading, called }) => (
                            <>
                            <Error error={error} />
                            <ButtonStyles onClick={async e => {
                                e.preventDefault();
                                await edit();
                                this.props.nextStep();
                            }}>Subscribe!</ButtonStyles>
                            </>
                        )}
                    </Mutation>
                )}
            </User>
        );
    }
}

export default Confirmation;