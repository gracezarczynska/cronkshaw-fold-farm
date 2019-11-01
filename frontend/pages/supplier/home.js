import React, { Component } from 'react';
import Link from 'next/link';
import User from '../../components/User';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../../components/ErrorMessage';
import { ButtonStyles } from '../../components/styles/ButtonStyles';
import styled from 'styled-components';

const MAIL_MUTATION = gql`
    mutation MAIL_MUTATION($emailText: String!) {
        sendEmailAllEnrollments(emailText: $emailText) {
            message
        }
    }
`;

const StyledTextArea = styled.textarea`
    width: 100%;
    max-width: 400px;
    min-height: 150px;
    background-color: ${props => props.theme.black};
    border: ${props => props.theme.orange} 1px solid;
    color: ${props => props.theme.orange};
    font-size: 1.2em;
    &:focus {
        outline: none;
    }
`;

const SendEmailStyles = styled.div`
    display: flex;
    flex-direction: column;
`;

const TabStyles = styled.div`
    display: flex;
    .tab {
        flex-basis: 30%;
        border: ${props => props.theme.black};
        background-color: ${props => props.theme.black};
        color: ${props => props.theme.orange};
        width: 30%;
        min-height: 350px;
        
        button, a {
            display: block;
            background-color: inherit;
            color: ${props => props.theme.orange};
            font-size: 2rem;
            padding: 22px 16px;
            width: 100%;
            border: ${props => props.theme.black} 1px solid;
            outline: none;
            text-align: left;
            cursor: pointer;
            transition: 0.3s;
            font-family: 'radnika_next';

            &:hover {
                background-color: ${props => props.theme.orange};
                color: ${props => props.theme.black};
            }

            &.active {
                background-color: ${props => props.theme.orange};
                color: ${props => props.theme.black};
            }
        }
    }

    .tabcontent {
        float: left;
        padding: 0px 12px;
        background-color: ${props => props.theme.black};
        width: 70%;
        border-left: none;
        min-height: 350px;
        display: none;
        &.active {
            display: block;
        }
    }
`;

class SupplierHome extends Component {
    state = {
        emailText: '',
        active: ''
    }
    handleChange = input => event => {
        this.setState({ [input] : event.target.value });
    }
    openTab = (event, tab) => {
        this.setState({ active: tab });
    }
    render() {
        return (
                <User>
                    {({ data, error, loading }) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Oops!</p>
                        return (
                            <div>
                                <h1>Suppliers Homepage</h1>
                                <h2>Hello {data.me.name}</h2>
                                <TabStyles>
                                    <div class="tab">
                                        <button className="tablinks" onClick={(e) => this.openTab(e, 'tab1')}>Email All Users</button>
                                        <Link className="tablinks" href={'manage-requests'}><a>Manage Requests</a></Link>
                                    </div>

                                    <div id="tab1" className={`tabcontent ${this.state.active === "tab1" ? 'active' : ''}`}>
                                        <h3>Email All Users</h3>
                                        <Mutation 
                                            mutation={MAIL_MUTATION} 
                                            variables={this.state} 
                                        >
                                        {(send, { error, loading, data }) => (
                                            <>
                                                {data && 
                                                <p>Success!</p>
                                                }
                                                <Error error={error} />
                                                    <SendEmailStyles>
                                                        <StyledTextArea disabled={loading} value={this.state.emailText} onChange={this.handleChange('emailText')}></StyledTextArea>
                                                        <ButtonStyles disabled={loading} onClick={async e => {
                                                            e.preventDefault();
                                                            await send();
                                                        }}>Send!</ButtonStyles>
                                                    </SendEmailStyles>
                                            </>
                                        )}
                                        </Mutation>
                                    </div>

                                    <div id="tab2" className={`tabcontent ${this.state.active === "tab2" ? 'active' : ''}`}>
                                        <h3>Paris</h3>
                                        <p>Paris is the capital of France.</p> 
                                    </div>
                                </TabStyles>
                            </div>
                        )
                    }}
                </User>
        );
    }
}

export default SupplierHome;