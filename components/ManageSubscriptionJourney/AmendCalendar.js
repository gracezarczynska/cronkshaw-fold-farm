import React, { Component } from 'react';
import dateFns from 'date-fns';
import Calendar from '../Calendar';
import CalendarStyles from '../styles/CalendarStyles';
import Modal from './Modal';
import styled from 'styled-components';

const AmendLayout = styled.div`
    display: flex;
    justify-content: center;

    .calendar {
        flex-basis: 70%;
    }
`;

class AmendCalendar extends Component {
    state = {
        modalOpened: false,
        day: ''
    }
    amendFunctions = {
        openModal: (day) => {
            if(this.state.day !== '' && !dateFns.isSameDay(this.state.day, day)) {
                this.setState({day});
                return;
            }
            this.setState({ modalOpened: !this.state.modalOpened, day });
        },
    }

    render() {
        const values = {
            ...this.props.values,
            subscriptionFrequency: this.props.subscription.subscriptionFrequency,
            subscriptionStartDate: this.props.subscription.subscriptionStartDate
        }
        return (
            <AmendLayout>
                <CalendarStyles className="calendar">
                    <Calendar deliveryDays={this.props.deliveryDays} deliveryFrequency={this.props.deliveryFrequency} startDate={this.props.startDate} values={values} amendFunctions={this.amendFunctions}/>
                </CalendarStyles>
                { this.state.modalOpened && 
                    <Modal day={this.state.day} values handleChange={this.props.handleChange} subscription={this.props.subscription} />
                }
            </AmendLayout>
        );
    }
}

export default AmendCalendar;