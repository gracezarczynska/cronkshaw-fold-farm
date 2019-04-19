import React, { Component } from 'react';
import SignIn from '../components/Authorisation/Signin';
import Register from '../components/Authorisation/Register';
import RequestReset from '../components/Authorisation/RequestReset';
import styled from 'styled-components';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
  grid-auto-rows: auto;
`;

class SignInPage extends Component {
    render() {
        return (
            <Columns>
                <SignIn />
                <Register />
                <RequestReset />
            </Columns>
        );
    }
}

export default SignInPage;