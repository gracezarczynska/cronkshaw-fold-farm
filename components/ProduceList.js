import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ProducePreview from './ProducePreview';
import { perPage } from '../config';
import styled from 'styled-components';

const ALL_PRODUCE_QUERY = gql`
    query ALL_PRODUCE_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
        products(first: $first, skip: $skip, orderBy: createdAt_DESC) {
            id
            name
            image
            description
            price
            unit
            farm {
                id
                name
            }
        }
    }
`;

const Center = styled.div`
    text-align: center;
`;

const ProduceListStyles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
`;

class ProduceList extends Component {
    render() {
        return (
            <Center>
                <h2> Produce </h2>
                <Query query={ALL_PRODUCE_QUERY}>
                    {({ data, error, loading }) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Error: {error.message}</p>
                        return <ProduceListStyles>
                            {data.products.map(product => <ProducePreview product={product} key={product.id}></ProducePreview>)}
                        </ProduceListStyles>
                    }}
                </Query>
            </Center>
        )
    }
}

export default ProduceList;