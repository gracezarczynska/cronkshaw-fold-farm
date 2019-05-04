import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import dateFns from "date-fns";

import Error from '../ErrorMessage';
import Confirmation from '../NewSubscriptionJourney/Confirmation';
import Success from '../NewSubscriptionJourney/Success';
import AmendCalendar from './AmendCalendar';
import SubscriptionDetails from '../NewSubscriptionJourney/SubscriptionDetails';

const SINGLE_SUBSCRIPTION_QUERY = gql`
    query SINGLE_SUBSCRIPTION_QUERY($id: ID!) {
        enrollment(where: { id: $id }) {
            product {
                id
                name
                price
                description
                unit
                image
                deliveryDays
                deliveryFrequency
                availableStock
                farm {
                    id
                    name
                }
            }
            quantity
            subscriptionFrequency
            subscriptionStartDate
        }
    }
`;

class SubscriptionManagement extends Component {
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
        subscriptionStartDate: dateFns.startOfToday()
    }

    nextStep = (value = 1) => {
        const { step } = this.state
        this.setState({
            step : step + value
        })
    }

    prevStep = (value = 1) => {
        const { step } = this.state
        this.setState({
            step : step - value
        })
    }

    handleChange = input => event => {
        this.setState({ [input] : event.target.value })
    }
    
    handleImage = (value, src) => {
        this.setState({ [value]: src })
    }

    render(){
        const { step } = this.state;
        const { address1, address2, postcode, city, phone, housePicture, dropOffPicture, subscriptionFrequency, subscriptionStartDate, deliveryInstructions, quantity } = this.state;
        const values = { address1, address2, postcode, city, phone, housePicture, dropOffPicture, subscriptionFrequency, subscriptionStartDate, deliveryInstructions, quantity };
        return (
            <Query query={SINGLE_SUBSCRIPTION_QUERY} variables={{ id: this.props.enrollment }}>
                {({error, loading, data}) => {
                    if(error) return <Error error={error} />;
                    if(loading) return <p>Loading...</p>;
                    if(!data) return <p>No Item Found</p>;
                    return (
                        <div>
                            <h2>You are amending a subscription of {data.enrollment.product.name} from {data.enrollment.product.farm.name}</h2>
                            {(() => {
                                switch(step) {
                                    case 1: 
                                        return <SubscriptionDetails
                                                nextStep = {this.nextStep}
                                                handleChange = {this.handleChange}
                                                values = {values}
                                                produceId={data.enrollment.product.id}
                                                subscription={data.enrollment}
                                                isManage
                                                />
                                    case 2:
                                        return <AmendCalendar
                                                nextStep={this.nextStep}
                                                prevStep={this.prevStep}
                                                handleChange = {this.handleChange}
                                                values={values}
                                                produceId={this.props.produceId}
                                                deliveryDays={data.enrollment.product.deliveryDays}
                                                deliveryFrequency={data.enrollment.product.deliveryFrequency}
                                                startDate={data.enrollment.product.startDate}
                                                subscription={data.enrollment}
                                                />
                                    case 4:
                                        return <Confirmation 
                                                nextStep={this.nextStep}
                                                prevStep={this.prevStep}
                                                values={values}
                                                produceId={this.props.produceId}
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

export default SubscriptionManagement;

