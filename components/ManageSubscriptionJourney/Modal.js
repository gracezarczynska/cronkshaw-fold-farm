import React, { Component } from 'react';
import dateFns from 'date-fns';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../ErrorMessage';

import { NumberInput, ButtonStyles } from '../styles/ButtonStyles';
import { buildDropdown } from '../../lib/buildDropdown';

const ModalStyles = styled.div`
    padding: 120px 30px 30px;
`;

const DateInput = styled.input`
    margin-right: 1em;
    background-color: transparent;
    padding: 10px;
    border: ${props => props.theme.orange} 1px solid;
    border-radius: unset;
    color: ${props => props.theme.orange};
    height: 40px;
    font-size: 1em;
    font-family: Arial, Helvetica, sans-serif;
`;

const DatesLayout = styled.div`
    label {
        display: block;
        padding: 10px 0 0;
    }
`;

const NEW_OVERRIDE = gql`
    mutation ADD_NEW_OVERRIDE($subscriptionId: ID!, $overrideStartDate: DateTime!, $overrideEndDate: DateTime, $quantity: Int!) {
        createEnrollment(susbcriptionId: $subscriptionId, overrideStartDate: $overrideStartDate, overrideEndDate: $overrideEndDate, quantity: $quantity) {
            user {
                subscriptions {
                    id
                }
            }
        }
    }
`;


class Modal extends Component {
    state = {
        overrideStartDate: '',
        overrideEndDate: '',
        quantity: ''
    }

    handleChange = input => event => {
        this.setState({ [input] : event.target.value });
        console.log(this.state);
    }

    render() {
        const {day, subscription} = this.props
        const { overrideStartDate, overrideEndDate, quantity } = this.state;
        const values = { overrideStartDate: overrideStartDate || day, overrideEndDate: overrideEndDate || day, quantity: quantity || this.props.subscription.quantity};
        return (
            <Mutation mutation={NEW_OVERRIDE} variables={{ subscriptionId: subscription.id, ...values } } >
                {(create, { error, loading, called }) => (
                    <>
                    <Error error={error} />
                    <ModalStyles>
                        <h3>You are editing your delivery on the {dateFns.format(day, 'DD MMM YYYY')}</h3>
                        <NumberInput defaultValue={subscription.quantity} onChange={this.handleChange('quantity')}>
                            {buildDropdown(subscription.product.availableStock, subscription.product.unit, true)}
                        </NumberInput>
                        <DatesLayout>
                            <div>
                                <label>Start Date</label>
                                <DateInput defaultValue={dateFns.format(day, 'YYYY-MM-DD')} onChange={this.handleChange('overrideStartDate')} type="date" placeholder="Starting date" />
                            </div>
                            <div>
                                <label>End Date</label>
                                <DateInput defaultValue={dateFns.format(day, 'YYYY-MM-DD')} onChange={this.handleChange('overrideEndDate')} type="date" placeholder="End date" />
                            </div>
                        </DatesLayout>
                        <ButtonStyles
                            onClick={async e => {
                                e.preventDefault();
                                await create();
                            }}>
                            Amend your subscription
                        </ButtonStyles>
                    </ModalStyles>
                    </>
                )}
            </Mutation>
        );
    }
}

export default Modal;