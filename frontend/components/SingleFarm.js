import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head';
import ProducePreview from './ProducePreview'

const SingleFarmStyles = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    box-shadow: ${props => props.theme.bs};
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .details {
        margin: 3rem;
        font-size: 3rem;

        h2 {
            color: ${props => props.theme.orange};
        }
    }
`;

const FarmProductStyles = styled.div`
    max-width: 1000px;
    margin: 2rem auto;
    box-shadow: ${props => props.theme.bs};
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;
const SINGLE_FARM_QUERY = gql`
    query SINGLE_FARM_QUERY($id: ID!) {
        farm(where: { id: $id }) {
            id
            name
            description
            image
            products {
                name
                image
                id
                farm {
                    id
                }
            }
        }
    }
`;

class SingleFarm extends Component {
    render() {
        return (
            <Query query={SINGLE_FARM_QUERY} variables={{ id: this.props.id }}>
                {({error, loading, data}) => {
                    if(error) return <Error error={error} />;
                    if(loading) return <p>Loading...</p>;
                    if(!data.farm) return <p>No Item Found</p>;
                    const farm = data.farm;
                    return (
                        <>
                        <SingleFarmStyles>
                            <Head>
                                <title>Cronkshaw Fold Farm | {farm.name}</title>
                            </Head>
                            <img src={farm.image} alt={farm.name} />
                            <div className="details">
                                <h2>Viewing {farm.name}</h2>
                                <p>{farm.description}</p>
                            </div>
                        </SingleFarmStyles>
                        <FarmProductStyles>
                            {farm.products.map(product => <ProducePreview product={product} key={product.id}></ProducePreview>)}
                        </FarmProductStyles>
                        </>
                    );
                }}
            </Query>
        );
    }
}

export default SingleFarm;