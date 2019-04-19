import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FormStyles from './styles/Form';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
        signup(email: $email, name: $name, password: $password) {
            id
            email
            name
        }
    }
`;

class Register extends Component {
    state = {
        name: '',
        password: '',
        email: '',
        confirmPassword: '',
        confirmEmail: '',
    };
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };
    render() {
        return (
            <Mutation 
                mutation={SIGNUP_MUTATION} 
                variables={this.state} 
                onCompleted={this.completed}
                refetchQueries={[
                    { query: CURRENT_USER_QUERY }
                ]} 
                >
                {(signup, { called, loading, data, error, client }) => {
                    return (
                        <FormStyles method="post" onSubmit={(e) => {
                            e.preventDefault();
                            signup();
                        }}> 
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Register</h2>
                                <Error error={error} />
                                {!error && !loading && called && <p>Success! You have successfully registered</p>}
                                <label htmlFor="name">
                                    Name
                                    <input type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.saveToState} />
                                </label>
                                <label htmlFor="name">
                                    Surname
                                    <input type="text" name="surname" placeholder="Surame" value={this.state.surname} onChange={this.saveToState} />
                                </label>
                                <br></br>
                                <label htmlFor="email">
                                    Email
                                    <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} />
                                </label>
                                <label htmlFor="email">
                                    Confirm Email
                                    <input type="text" name="confirmEmail" placeholder="Confirm Email" value={this.state.confirmEmail} onChange={this.saveToState} />
                                </label>
                                <br></br>
                                <label htmlFor="password">
                                    Password
                                    <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} />
                                </label>
                                <label htmlFor="password">
                                    Confirm Password
                                    <input type="password" name="confirmPassword" placeholder="Password" value={this.state.confirmPassword} onChange={this.saveToState} />
                                </label>
                                <button type="submit">Register</button>
                            </fieldset>
                        </FormStyles>
                    )
                }}
            </Mutation>
        );
    }
}

export default Register;