import React, { Component } from 'react';

import { ButtonStyles } from '../styles/ButtonStyles';
import { PopUpStyles } from '../styles/PopUpStyles';

class PopUp extends Component {
    render() {
        const {day, subscription, overrideStartDate, overrideEndDate, quantity, popUpFunctions } = this.props
        const values = { subscriptionId: subscription.id, overrideStartDate, overrideEndDate, quantity: quantity || this.props.subscription.quantity};
        return (
            <>
                <PopUpStyles>
                    <ButtonStyles onClick={(e) => popUpFunctions.requestToAddDelivery(day)}> 
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