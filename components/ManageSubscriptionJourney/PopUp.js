import React, { Component } from 'react';
import dateFns from 'date-fns';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../ErrorMessage';

import { NumberInput, ButtonStyles } from '../styles/ButtonStyles';
import { buildDropdown } from '../../lib/buildDropdown';

const PopUpStyles = styled.div`
    position: absolute;
    z-index: 1;
    background-color: ${props => props.theme.grey};
    left: calc(100% + 7px);
    width: 300px;

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

    button {
        border: 0;
        font-size: 2rem;
        padding: 0.5rem 1.2rem;
        width: 100%;
        max-width: 250px;
        margin: 10px 10px;
    }
`;

class PopUp extends Component {
    render() {
        const {day, subscription, overrideStartDate, overrideEndDate, quantity, popUpFunctions } = this.props
        const values = { subscriptionId: subscription.id, overrideStartDate, overrideEndDate, quantity: quantity || this.props.subscription.quantity};
        return (
            <>
                <PopUpStyles>
                    <ButtonStyles onClick={(e) => popUpFunctions.requestToAddDelivery(e, day)}> 
                        <span>Request to add to your usual delivery</span>
                    </ButtonStyles>
                    <ButtonStyles onClick={(e) => popUpFunctions.cancelDelivery(e, day)}> 
                        <span>Cancel this delivery</span>
                    </ButtonStyles>                   
                    <ButtonStyles onClick={(e) => popUpFunctions.cancelBetweenDates(day)}> 
                        <span>Cancel between dates</span>
                    </ButtonStyles>
                </PopUpStyles>
            </>
        );
    }
}

export default PopUp;