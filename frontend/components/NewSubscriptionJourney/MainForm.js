import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { startOfToday } from "date-fns";

import Error from '../ErrorMessage';
import UserDetails from './UserDetails';
import Confirmation from './Confirmation';
import Success from './Success';
import SubscriptionSetup from './SubscriptionSetup';
import SubscriptionDetails from './SubscriptionDetails';

const SINGLE_PRODUCT_SUBSCRIPTION_QUERY = gql`
    query SINGLE_PRODUCT_SUBSCRIPTION_QUERY($id: ID!) {
        productSubscription(where: { id: $id }) {
            name
            image
            id
            deliveryDays
            deliveryFrequency
            startDate
            price
            unit
            pluralUnit
            farm {
                name
                id
            }
        }
    }
`;

class MainForm extends Component {
    state = {
        step: 1,
        address1: '',
        address2: '',
        postcode: '',
        city: '',
        phone: '',
        housePicture: '',
        dropOffPicture: '',
        deliveryFrequency: '',
        startDate: '',
        deliveryInstructions: '',
        quantity: 1,
        subscriptionFrequency: '',
        subscriptionStartDate: startOfToday(),
        deliveryDays: '',
        weeklyOcurrence: '',
        biweeklyOcurrence: ''
    }

    nextStep = () => {
        const { step } = this.state
        this.setState({
            step : step + 1
        })
    }

    prevStep = () => {
        const { step } = this.state
        this.setState({
            step : step - 1
        })
    }

    handleChange = input => event => {
        this.setState({ [input] : event.target.value });
    }
    
    handleImage = (value, src) => {
        this.setState({ [value]: src })
    }

    render(){
        const { step } = this.state;
        const { address1, address2, postcode, city, phone, housePicture, dropOffPicture, subscriptionFrequency, subscriptionStartDate, deliveryInstructions, quantity } = this.state;
        const values = { address1, address2, postcode, city, phone, housePicture, dropOffPicture, subscriptionFrequency, subscriptionStartDate, deliveryInstructions, quantity };
        return (
            <Query query={SINGLE_PRODUCT_SUBSCRIPTION_QUERY} variables={{ id: this.props.produceId }}>
                {({error, loading, data}) => {
                    if(error) return <Error error={error} />;
                    if(loading) return <p>Loading...</p>;
                    if(!data.productSubscription) return <p>No Item Found</p>;
                    const product = data.productSubscription
                    return (
                        <div>
                            <h2>You are ordering a subscription of {product.name} from {product.farm.name}</h2>
                            {(() => {
                                switch(step) {
                                    case 1: 
                                        return <SubscriptionDetails
                                                nextStep = {this.nextStep}
                                                handleChange = {this.handleChange}
                                                values = {values}
                                                produceId={this.props.produceId}
                                                />
                                    case 2:
                                        return <UserDetails 
                                                nextStep={this.nextStep}
                                                prevStep={this.prevStep}
                                                handleChange = {this.handleChange}
                                                handleImage = {this.handleImage}
                                                values={values}
                                                />
                                    case 3:
                                        return <SubscriptionSetup
                                                nextStep={this.nextStep}
                                                prevStep={this.prevStep}
                                                handleChange = {this.handleChange}
                                                values={values}
                                                produceId={this.props.produceId}
                                                deliveryDays={product.deliveryDays}
                                                deliveryFrequency={product.deliveryFrequency}
                                                startDate={product.startDate}
                                                />
                                    case 4:
                                        return <Confirmation 
                                                nextStep={this.nextStep}
                                                prevStep={this.prevStep}
                                                values={values}
                                                produceId={this.props.produceId}
                                                product={product}
                                                />
                                    case 5:
                                        return <Success />
                                }
                            })()}
                        </div>
                    )
                    
                }}
            </Query>
        )
    }
}

export default MainForm;

