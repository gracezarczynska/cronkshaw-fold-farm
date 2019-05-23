import React, { Component } from 'react';
import dateFns from 'date-fns';
import AmendCalendar from './AmendCalendar';
import CalendarStyles from '../styles/CalendarStyles';
import { ButtonStyles } from '../styles/ButtonStyles';
import styled from 'styled-components';
import Modal from './Modal';

const AmendLayout = styled.div`
    display: flex;
    justify-content: center;

    .calendar {
        flex-basis: 70%;
    }
`;

const MarkdownLayout = styled.div`
    display: flex;
    align-items: center;
`;

class AmendPage extends Component {
    state = {
        popUpOpened: false,
        modalOpened: false,
        day: '',
        overrideStartDate: '',
        overrideEndDate: '',
        quantity: 0,
        variantOfModal: '',
    }
    amendFunctions = {
        openModal: (day, variant = 'cancel') => {
            if(this.state.day !== '' && !dateFns.isSameDay(this.state.day, day)) {
                this.setState({ day, overrideEndDate: day, overrideStartDate: day });
                return;
            }
            this.setState({ modalOpened: !this.state.modalOpened, day, overrideEndDate: day, overrideStartDate: day, variantOfModal: variant });
        },
        closeModal: () => {
            this.setState({ modalOpened: !this.state.modalOpened, day: '' });
        },
        handleChange: input => event => {
            this.setState({ [input] : event.target.value });
        }
    }

    render() {
        const values = {
            ...this.props.values,
            subscriptionFrequency: this.props.subscription.subscriptionFrequency,
            subscriptionStartDate: this.props.subscription.subscriptionStartDate
        }

        const calendarProps = {
            deliveryDays: this.props.deliveryDays,
            deliveryFrequency: this.props.deliveryFrequency,
            startDate: this.props.startDate,
            values,
            amendFunctions: this.amendFunctions,
            overrideStartDate: this.state.overrideStartDate,
            overrideEndDate: this.state.overrideEndDate,
            subscription: this.props.subscription,
        }
        return (
            <>  
                <MarkdownLayout>
                    <ButtonStyles onClick={this.cancelSubscription}>To cancel your order completely click here</ButtonStyles>
                </MarkdownLayout>
                <AmendLayout>
                    <CalendarStyles className="calendar">
                        <AmendCalendar {...calendarProps} />
                        { this.state.modalOpened && 
                            <Modal amendFunctions={this.amendFunctions} variant={this.state.variantOfModal} day={this.state.day} values handleChange={this.props.handleChange} subscription={this.props.subscription} />
                        }
                    </CalendarStyles>
                </AmendLayout>
            </>
        );
    }
}

export default AmendPage;