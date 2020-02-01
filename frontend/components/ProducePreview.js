import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ProductStyles from './styles/ProductStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import User from './User';

export default class ProducePreview extends Component {
    static propTypes = {
        product: PropTypes.object.isRequired,
    }

    render() {
        const { product } = this.props;
        return (
            <User>
            {({ data: { me } }) => {
                let subscription = [];
                const alreadySubscribed = me && me.subscriptions && me.subscriptions.filter(existingSubscription => existingSubscription.product.id === product.id).length > 0;
                if (alreadySubscribed) {
                    subscription = me.subscriptions.filter(existingSubscription => existingSubscription.product.id === product.id);
                }
                return (
            <ProductStyles>
                <Link href={{
                    pathname: alreadySubscribed ? 'manage' : 'subscribe',
                    query: alreadySubscribed ? { id: subscription[0].id } : { id: product.id },
                }}>
                    {product.image && <img src={product.image} alt ={product.name} />}
                </Link>
                <h1>
                    <Link href={{
                        pathname: alreadySubscribed ? 'manage' : 'subscribe',
                        query: alreadySubscribed ? { id: subscription[0].id } : { id: product.id },
                    }}>
                        <a>{product.name}</a>
                    </Link>
                </h1>
                <PriceTag>{formatMoney(product.price)} per {product.unit}</PriceTag>
                <p>{product.description}</p>
                <div className="buttonList">
                    {!me && (
                        <Link href="/sign-in">
                        <a>Register to Subscribe</a>
                        </Link>
                    )}
                    {me && alreadySubscribed && (
                        <Link href={{
                            pathname:"manage",
                            query: { id: subscription[0].id }
                        }}>
                            <a>Manage your subscription</a>
                        </Link>
                    )}
                    {me && !alreadySubscribed && (
                        <Link href={{
                            pathname:"subscribe",
                            query: { id: product.id }
                        }}>
                            <a>Subscribe</a>
                        </Link>
                    )}
                    <Link href={{
                        pathname:"farm",
                        query: { id: product.farm.id }
                    }}>
                        <a>About the Farm</a>
                    </Link>
                </div>
            </ProductStyles>
                    );
                }}
            </User>
        )
    }
}