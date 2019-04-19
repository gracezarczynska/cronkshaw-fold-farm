import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ButtonStyles, NumberInput } from './styles/ButtonStyles';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';

const Center = styled.div`
    display: flex;
    justify-content: center;
`;

const SubscriptionDetailsStyles = styled.div`
    display: flex;
    flex-basis: 50%;

    div {
        flex-basis: 50%;
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
            farm {
                id
                name
            }
        }
    }
`;

class SubscriptionDetails extends Component {
    saveAndContinue = (e) => {
        e.preventDefault()
        this.props.nextStep()
    }

    buildOptions(availableStock, unit) {
        var arr = [];
        for (let i = 1; i <= availableStock; i++) {
            arr.push(<option key={i} value={i}>{i} of {unit}</option>)
        }

        return arr; 
    }

    render() {
        const { values } = this.props;
        console.log(this.props);
        return (
            <>
                <Query query={SINGLE_PRODUCE_QUERY} variables={{ id: this.props.produceId }}>
                    {({error, loading, data}) => {
                        if(error) return <Error error={error} />;
                        if(loading) return <p>Loading...</p>;
                        if(!data.product) return <p>No Item Found</p>;
                        const product = data.product;
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
                                        <NumberInput onChange={this.props.handleChange('quantity')}>
                                            {this.buildOptions(product.availableStock, product.unit)}
                                        </NumberInput>
                                    </div>
                                </div>
                                <div>
                                    <img src={product.image} />
                                </div>
                            </SubscriptionDetailsStyles>
                        )
                    }}
                </Query>
                <Center>
                    <ButtonStyles onClick={this.saveAndContinue}>Save and continue </ButtonStyles>
                </Center>
            </>
        );
    }
}

export default SubscriptionDetails;