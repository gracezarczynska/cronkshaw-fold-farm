import React, { Component } from 'react';
import { Query } from 'react-apollo';
const moment = require('moment');
import gql from 'graphql-tag';
import { ButtonStyles, NumberInput } from '../styles/ButtonStyles';
import styled from 'styled-components';
import formatMoney from '../../lib/formatMoney';
import { nextSubscriptionDay } from '../../lib/subscriptionDates';
import { buildDropdown } from '../../lib/buildDropdown';

const Center = styled.div`
    display: flex;
    justify-content: center;
`;

const SubscriptionDetailsStyles = styled.div`
    display: flex;
    flex-basis: 50%;

    div {
        flex-basis: 50%;

        img {
            width: 100%;
        }
    }
`;

const SINGLE_PRODUCE_QUERY = gql`
    query SINGLE_PRODUCE_QUERY($id: ID!) {
        product(where: { id: $id }) {
            id
            name
            image
            description
            price
            unit
            availableStock
            deliveryDays
            farm {
                id
                name
            }
        }
    }
`;

class SubscriptionDetails extends Component {
    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    }

    amendSubscription = (e) => {
        e.preventDefault();
        this.props.nextStep(1);
    }

    render() {
        return (
            <>
                <Query query={SINGLE_PRODUCE_QUERY} variables={{ id: this.props.produceId }}>
                    {({error, loading, data}) => {
                        if(error) return <Error error={error} />;
                        if(loading) return <p>Loading...</p>;
                        if(!data.product) return <p>No Item Found</p>;
                        const product = data.product;
                        let nextDelivery;
                        this.props.subscription ? nextDelivery = nextSubscriptionDay(this.props.subscription.subscriptionFrequency, this.props.subscription.subscriptionStartDate, product.deliveryDays) : nextDelivery = '';
                        return (
                            <SubscriptionDetailsStyles>
                                <div>
                                    <div>
                                        <h2>{product.name}</h2>
                                        <p>{product.description}</p>
                                        { this.props.isManage && this.props.subscription && (
                                            <div>
                                                <p>Your delivery frequency is {this.props.subscription.subscriptionFrequency}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p>Price: {formatMoney(product.price)} per {product.unit}</p>
                                        { this.props.isManage && this.props.subscription &&
                                            <>
                                                <p>Your delivery quantity is {this.props.subscription.quantity} {this.props.subscription.quantity > 1 ? this.props.subscription.product.pluralUnit || this.props.subscription.product.unit  :  this.props.subscription.product.unit}</p>
                                                <p>Your next delivery is {nextDelivery.map(deliveryDay => <span>{moment(deliveryDay).format("Do MMM YYYY")}</span>)}</p>
                                            </>
                                        } 
                                        { !this.props.isManage &&
                                            <NumberInput onChange={this.props.handleChange('quantity')}>
                                                {buildDropdown(product.availableStock, product.unit)}
                                            </NumberInput>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <img src={product.image} />
                                </div>
                            </SubscriptionDetailsStyles>
                        )
                    }}
                </Query>
                { !this.props.isManage &&
                    <Center>
                        <ButtonStyles onClick={this.saveAndContinue}>Save and continue </ButtonStyles>
                    </Center>
                }
                { this.props.isManage &&
                    <Center>
                        <ButtonStyles onClick={this.cancelSubscription}>Cancel Subscription</ButtonStyles>
                        <ButtonStyles onClick={this.amendSubscription}>Amend Subscription</ButtonStyles>
                    </Center>
                }
            </>
        );
    }
}

export default SubscriptionDetails;