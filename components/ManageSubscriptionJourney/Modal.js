import React, { Component } from 'react';
import dateFns from 'date-fns';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../ErrorMessage';

import { NumberInput, ButtonStyles } from '../styles/ButtonStyles';
import { buildDropdown } from '../../lib/buildDropdown';

const ModalStyles = styled.div`
    width: 100%;
    position: absolute;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: ${props => props.theme.transparentGrey};
    display: flex;
    justify-content: center;
    align-items: center;

    .modal {
        &__container {
            max-width: 350px;
            height: auto;
            background-color: ${props => props.theme.darkgrey};
            padding: 40px;
            position: relative;
        }
        &__close-button {
            position: absolute;
            right: 5px;
            top: 20px;
            width: 30px;
            height: 30px;
            -webkit-appearance: none;
            -moz-appearance: none;
            border: none;
            background-color: transparent;
            color: ${props => props.theme.orange};
            font-size: 2em;
            line-height: 0;
            font-family: 'Helvetica';

            &:focus {
                outline: none;
            }
        }
    }


    &::after {
        content:'';
        display:block;
        width:0;
        height:0;
        position:absolute;

        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right:8px solid ${props => props.theme.grey};
        left:-8px;

        top:7px;
    }
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
        createOverride(subscriptionId: $subscriptionId, startDate: $overrideStartDate, endDate: $overrideEndDate, quantity: $quantity) {
            id
            status
        }
    }
`;


class Modal extends Component {
    render() {
        const {day, subscription, overrideStartDate, overrideEndDate, quantity, handleChange, variant } = this.props
        const values = { subscriptionId: subscription.id, overrideStartDate, overrideEndDate, quantity: quantity || this.props.subscription.quantity};
        return (
            <Mutation mutation={NEW_OVERRIDE} variables={values} >
                {(create, { error, loading, data, called }) => (
                    <ModalStyles>
                        <div className="modal__container">
                            <button className="modal__close-button" onClick={() => this.props.amendFunctions.closeModal()}>x</button>
                            { data && data.createOverride.status === 'pending' && 
                                <p>Because you requested more items than your current subscription, the change needs to be reviewed by the Farmer, you should get an email in the next 24 hours</p>
                            } 
                            {
                                data && data.createOverride.status === 'approved' && 
                                <p>Your request has been approved!</p>
                            }
                            <Error error={error} />
                            { variant === 'cancel' ? <h3>You are canceling your delivery between dates</h3> : <h3>You are editing your delivery on the {dateFns.format(day, 'DD MMM YYYY')}</h3>}
                            {/* <NumberInput value={quantity} onChange={handleChange('quantity')}>
                                {buildDropdown(subscription.product.availableStock, subscription.product.unit, true)}
                            </NumberInput> */}
                            <DatesLayout>
                                <div>
                                    <label>Start Date</label>
                                    <DateInput onChange={handleChange('overrideStartDate')} value={dateFns.format(overrideStartDate, 'YYYY-MM-DD')} type="date" placeholder="Starting date" />
                                </div>
                                <div>
                                    <label>End Date</label>
                                    <DateInput onChange={handleChange('overrideEndDate')} value={dateFns.format(overrideEndDate, 'YYYY-MM-DD')} min={dateFns.format(overrideStartDate, 'YYYY-MM-DD')} type="date" placeholder="End date" />
                                </div>
                            </DatesLayout>
                            <ButtonStyles
                                onClick={async e => {
                                    e.preventDefault();
                                    await create();
                                }}>
                                { quantity > this.props.subscription.quantity ?
                                    <span>Request to add to your usual delivery</span>
                                    : <span>Cancel your subscription between selected dates</span>
                                } 
                                
                            </ButtonStyles>
                        </div>
                    </ModalStyles>
                )}
            </Mutation>
        );
    }
}

export default Modal;