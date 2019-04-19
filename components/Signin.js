import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FormStyles from './styles/Form';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            id
            email
            name
        }
    }
`;

class Signin extends Component {
    state = {
        password: '',
        email: '',
    };
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    render() {
        return (
            <Mutation 
                mutation={SIGNIN_MUTATION} 
                variables={this.state}
                refetchQueries={[
                    { query: CURRENT_USER_QUERY }
                ]} 
            >
                {(signin, { called, loading, data, error, client }) => {
                    return (
                        <FormStyles method="post" onSubmit={(e) => {
                            e.preventDefault();
                            signin();
                        }}> 
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Sign In</h2>
                                <Error error={error} />
                                <label htmlFor="email">
                                    Email
                                    <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} />
                                </label>
                                <label htmlFor="password">
                                    Password
                                    <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} />
                                </label>
                                <button type="submit">Sign In</button>
                            </fieldset>
                        </FormStyles>
                    )
                }}
            </Mutation>
        );
    }
}

export default Signin;