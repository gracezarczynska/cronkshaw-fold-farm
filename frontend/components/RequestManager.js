import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import OverridePreview from './OverridePreview';
import Table from './styles/Table';
import Error from './ErrorMessage';
import styled from 'styled-components';

const PENDING_OVERRIDE_QUERY = gql`
    query PENDING_OVERRIDE_QUERY($pending: String = "pending") {
            overrides(where: { status: $pending }) {
                id
                startDate
                endDate
                quantity
                subscriptions {
                    product {
                        name
                        unit
                        pluralUnit
                    }
                }
        }
    }
`;

class RequestManager extends Component {
    render() {
        return (
            <Query query={PENDING_OVERRIDE_QUERY}>
                {({ data, error, loading }) => {
                    if(loading) return <p>Loading...</p>
                    if(error) return <Error error={error} />
                    return (
                        <Table>
                            <thead>
                                <th>Product</th>
                                <th>Quantity</th> 
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Approve</th>
                                <th>Reject</th>
                                <th>Message</th>
                                <th>Update</th>
                            </thead>
                            {data.overrides.map(override => <OverridePreview override={override} key={override.id}></OverridePreview>)}
                        </Table>
                    )
                }}
            </Query>
        );
    }
}

export default RequestManager;