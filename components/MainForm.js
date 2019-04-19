import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import dateFns from "date-fns";
const moment = require('moment');
require('moment-recur');

import Error from './ErrorMessage';
import UserDetails from './UserDetails';
import Confirmation from './Confirmation';
import Success from './Success';
import SubscriptionSetup from './SubscriptionSetup';
import SubscriptionDetails from './SubscriptionDetails';

let flag = true;

const SINGLE_FARM_QUERY = gql`
    query SINGLE_FARM_QUERY($id: ID!) {
        product(where: { id: $id }) {
            name
            image
            id
            deliveryDays
            deliveryFrequency
            startDate
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
        subscriptionStartDate: dateFns.startOfToday(),
        deliveryDays: '',
        weeklyOcurrence: '',
        biweeklyOcurrence: '',
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
            <Query query={SINGLE_FARM_QUERY} variables={{ id: this.props.produceId }}>
                {({error, loading, data}) => {
                    if(error) return <Error error={error} />;
                    if(loading) return <p>Loading...</p>;
                    if(!data.product) return <p>No Item Found</p>;
                    return (
                        <div>
                            <h2>You are ordering a subscription of {data.product.name} from {data.product.farm.name}</h2>
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
                                                deliveryDays={data.product.deliveryDays}
                                                deliveryFrequency={data.product.deliveryFrequency}
                                                startDate={data.product.startDate}
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

export default MainForm;

