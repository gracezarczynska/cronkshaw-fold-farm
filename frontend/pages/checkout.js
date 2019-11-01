import React, { Component } from 'react';
import TakeMyMoney from '../components/TakeMyMoney';


class Checkout extends Component {
    render() {
        return (
            <TakeMyMoney>
                <button>Checkout</button>
            </TakeMyMoney>
        );
    }
}

export default Checkout;