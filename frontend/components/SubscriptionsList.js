import React, { Component } from 'react';
import User from './User';

import ProducePreview from './ProducePreview';
import styled from 'styled-components';

const Center = styled.div`
  text-align: center;
`;

const ProduceListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  @media (min-width: 860px) {
    grid-template-columns: 1fr 1fr;
  }
`;

class ProduceList extends Component {
  render() {
    return (
      <Center>
        <h2> My Subscriptions</h2>
        <User>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <ProduceListStyles>
                {data.me.subscriptions.map(subscription => (
                  <ProducePreview
                    product={subscription.product}
                    key={subscription.product.id}
                  ></ProducePreview>
                ))}
              </ProduceListStyles>
            );
          }}
        </User>
      </Center>
    );
  }
}

export default ProduceList;
