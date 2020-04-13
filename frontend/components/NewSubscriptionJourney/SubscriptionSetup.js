import React, { Component } from 'react';
import styled from 'styled-components';

import Calendar from '../Calendar';
import CalendarStyles from '../styles/CalendarStyles';
import { ButtonStyles } from '../styles/ButtonStyles';

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

const MoreSpace = styled.div`
  padding: 40px 0;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  @media (min-width: 860px) {
    flex-wrap: nowrap;
  }
`;

const Select = styled.select`
  margin-right: 1em;
  background-color: transparent;
  border: ${props => props.theme.orange} 1px solid;
  border-radius: 0;
  -webkit-appearance: none;
  padding: 10px;
  color: ${props => props.theme.orange};
  height: 40px;
  font-size: 1em;
  margin-bottom: 10px;
`;

const DateInput = styled.input`
  margin-right: 1em;
  background-color: transparent;
  padding: 10px;
  border: ${props => props.theme.orange} 1px solid;
  border-radius: unset;
  color: ${props => props.theme.orange};
  height: 40px;
  font-size: 1em;
  font-family: Arial, Helvetica, sans-serif;
`;

const MapKey = styled.div`
  @media (min-width: 668px) {
    margin-top: 0;
  }
  margin-top: 50px;
  p {
    margin-top: 0;
    color: #c0c0c0;
    font-size: 0.9em;
    span {
      color: white;
      font-size: 1em;
    }
  }
  .delivery-day {
    border: 1px solid ${props => props.theme.orange};
    border-radius: 50%;
    padding: 7px 3px;
  }
  .subscription-day {
    background-color: ${props => props.theme.orange};
    padding: 7px 3px;
    border-radius: 50%;
  }
`;

class SubscriptionSetup extends Component {
  saveAndContinue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  goBack = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { deliveryDays, deliveryFrequency, startDate, values } = this.props;

    return (
      <>
        <MoreSpace>
          <div>
            <Select
              defaultValue={values.subscriptionFrequency}
              onChange={this.props.handleChange('subscriptionFrequency')}
            >
              <option value=''>Select subscription frequency</option>
              <option value='weekly'>Weekly</option>
              <option value='biweekly'>Biweekly</option>
              <option value='monthly'>Monthly</option>
            </Select>
            <DateInput
              defaultValue={values.subscriptionStartDate}
              onChange={this.props.handleChange('subscriptionStartDate')}
              type='date'
              placeholder='Starting date'
            />
          </div>
          <MapKey>
            <div>
              <p>
                <span className='delivery-day'>Day</span> Delivery Day
              </p>
            </div>
            <div>
              <p>
                <span className='subscription-day'>Day</span> Your chosen
                subscription day
              </p>
            </div>
          </MapKey>
        </MoreSpace>
        <CalendarStyles>
          <Calendar
            deliveryDays={deliveryDays}
            deliveryFrequency={deliveryFrequency}
            startDate={startDate}
            values={values}
          />
        </CalendarStyles>
        <Center>
          <ButtonStyles onClick={this.goBack}>Go Back to Edit </ButtonStyles>
          <ButtonStyles onClick={this.saveAndContinue}>
            Save and Continue{' '}
          </ButtonStyles>
        </Center>
      </>
    );
  }
}

export default SubscriptionSetup;
