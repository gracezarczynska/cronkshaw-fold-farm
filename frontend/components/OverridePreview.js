import React, { Component } from 'react';
import { format } from "date-fns";
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import { ButtonStyles } from './styles/ButtonStyles';

const UPDATE_OVERRIDE = gql`
    mutation UPDATE_OVERRIDE($id: ID!, $status: String) {
        updateOverride(id: $id, status: $status) {
            id
            status
        }
    }
`;

export default class farm extends Component {
    state = {
        message : '',
        status: ''
    }
    updateValues = (e) => {
        if(e.target.type === 'checkbox') {
            this.setState({ status: e.target.name });
        } else {
            this.setState({[e.target.name]: e.target.value});
        }
    }
    render() {
        const { override } = this.props;
        const values = { status: this.state.status, id: override.id, message: this.state.message }
        return (
            <Mutation mutation={UPDATE_OVERRIDE} variables={values} >
                {(update, { error, loading, data, called }) => (
                <>
                    <Error error={error} />
                    <tr>
                        <td>
                            {override.subscriptions.product.name}
                        </td>
                        <td>{override.quantity} {override.quantity <= 1 ? override.subscriptions.product.unit : override.subscriptions.product.pluralUnit }</td>
                        <td>{format(override.startDate, 'dd mm yyyy')}</td>
                        <td>{format(override.endDate, 'dd mm yyyy')}</td>
                        <td><input type='checkbox' name="approved" checked={this.state.status === 'approved'} onChange={this.updateValues} /></td>
                        <td><input type='checkbox' name="rejected" checked={this.state.status === 'rejected'} onChange={this.updateValues} /></td>
                        <td><textarea name="message" value={this.state.message} onChange={this.updateValues} /></td>
                        <td>
                            { data && !error && !loading ? 
                                <p>Sorted!</p>
                                :
                                <ButtonStyles onClick={async e => {
                                    e.preventDefault();
                                    await update();
                                }}>Update</ButtonStyles>
                            }
                            </td>
                    </tr>
                </>
                )}
            </Mutation>
        );
    }
}