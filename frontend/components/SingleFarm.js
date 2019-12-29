import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head';
import ProducePreview from './ProducePreview';

const SingleFarmStyles = styled.div`
  max-width: 1200px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .details {
    font-size: 2rem;

    h2 {
      color: ${props => props.theme.orange};
      text-align: center;
    }
  }
`;

const HeadingStyles = styled.h2`
  text-align: center;
  color: ${props => props.theme.orange};
`;

const FarmProductStyles = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;

  @media (min-width: 860px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
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
        price
        unit
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
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.farm) return <p>No Item Found</p>;
          const farm = data.farm;
          return (
            <>
              <SingleFarmStyles>
                <Head>
                  <title>Cronkshaw Fold Farm | {farm.name}</title>
                </Head>
                <div className='details'>
                  <h2>Welcome to {farm.name}</h2>
                  <p>{farm.description}</p>
                </div>
                <img src={farm.image} alt={farm.name} />
              </SingleFarmStyles>
              <HeadingStyles>Produce available at the farm</HeadingStyles>
              <FarmProductStyles>
                {farm.products.map(product => (
                  <ProducePreview
                    product={product}
                    key={product.id}
                  ></ProducePreview>
                ))}
              </FarmProductStyles>
            </>
          );
        }}
      </Query>
    );
  }
}

export default SingleFarm;
