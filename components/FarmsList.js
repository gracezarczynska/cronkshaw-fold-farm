import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import FarmPreview from './FarmPreview';
import { perPage } from '../config';
import styled from 'styled-components';

const ALL_FARMS_QUERY = gql`
    query ALL_FARMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
        farms(first: $first, skip: $skip, orderBy: createdAt_DESC) {
            id
            name
            address
            postcode
            image
            description
        }
    }
`;

const Center = styled.div`
    text-align: center;
`;

const FarmList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
`;

class FarmsList extends Component {
    render() {
        return (
            <Center>
                <p> Farms </p>
                <Query query={ALL_FARMS_QUERY}>
                    {({ data, error, loading }) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Error: {error.message}</p>
                        return <FarmList>
                            {data.farms.map(farm => <FarmPreview farm={farm} key={farm.id}></FarmPreview>)}
                        </FarmList>
                    }}
                </Query>
            </Center>
        )
    }
}

export default FarmsList;