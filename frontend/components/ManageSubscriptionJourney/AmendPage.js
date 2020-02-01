import React, { Component } from 'react';
import { isSameDay, format } from 'date-fns';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../ErrorMessage';
import AmendCalendar from './AmendCalendar';
import CalendarStyles from '../styles/CalendarStyles';
import { ButtonStyles } from '../styles/ButtonStyles';
import styled from 'styled-components';
import Modal from './Modal';

const AmendLayout = styled.div`
  justify-content: center;

  .calendar {
    flex-basis: 70%;
  }
`;

const MarkdownLayout = styled.div`
  display: flex;
  justify-content: center;
`;

const NEW_OVERRIDE = gql`
  mutation ADD_NEW_OVERRIDE(
    $subscriptionId: ID!
    $overrideStartDate: DateTime
    $overrideEndDate: DateTime
    $quantity: Int!
  ) {
    createOverride(
      subscriptionId: $subscriptionId
      startDate: $overrideStartDate
      endDate: $overrideEndDate
      quantity: $quantity
    ) {
      id
      status
    }
  }
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
    canceledDates: []
  };

  undoChanges = () =>
    this.setState({
      canceledDates: [],
      overrideStartDate: '',
      overrideEndDate: ''
    });
  amendFunctions = {
    openModal: (day, variant = 'cancel') => {
      if (this.state.day !== '' && !isSameDay(this.state.day, day)) {
        this.setState({ day, overrideEndDate: day, overrideStartDate: day });
        return;
      }
      this.setState({
        modalOpened: !this.state.modalOpened,
        day,
        overrideEndDate: day,
        overrideStartDate: day,
        variantOfModal: variant
      });
    },
    closeModal: () => {
      this.setState({ modalOpened: !this.state.modalOpened, day: '' });
    },
    handleChange: input => event => {
      this.setState({ [input]: event.target.value });
    }
  };

  popUpFunctions = {
    requestToAddDelivery: day => {
      this.undoChanges();
      this.amendFunctions.openModal(day, 'request');
    },
    cancelDelivery: (e, day) => {
      if (
        this.state.canceledDates.indexOf(format(day, 'MM/DD/yyyy')) !==
        -1
      )
        return;
      this.undoChanges();
      this.setState({
        quantity: 0,
        overrideStartDate: day,
        overrideEndDate: day
      });
    },
    cancelBetweenDates: day => {
      this.undoChanges();
      this.amendFunctions.openModal(day);
      this.setState({ quantity: 0 });
    }
  };

  render() {
    const values = {
      ...this.props.values,
      subscriptionFrequency: this.props.subscription.subscriptionFrequency,
      subscriptionStartDate: this.props.subscription.subscriptionStartDate,
      quantity: this.state.quantity,
      subscriptionId: this.props.subscription.id,
      canceledDates: this.state.canceledDates,
      overrideStartDate: this.state.overrideStartDate,
      overrideEndDate: this.state.overrideEndDate
    };

    const calendarProps = {
      deliveryDays: this.props.deliveryDays,
      deliveryFrequency: this.props.deliveryFrequency,
      startDate: this.props.startDate,
      values,
      amendFunctions: this.amendFunctions,
      overrideStartDate: this.state.overrideStartDate,
      overrideEndDate: this.state.overrideEndDate,
      subscription: this.props.subscription,
      popUpFunctions: this.popUpFunctions,
      canceledDates: this.state.canceledDates
    };

    const modalProps = {
      amendFunctions: this.amendFunctions,
      variant: this.state.variantOfModal,
      day: this.state.day,
      values,
      handleChange: this.props.handleChange,
      subscription: this.props.subscription,
      overrideStartDate: this.state.overrideStartDate,
      overrideEndDate: this.state.overrideEndDate
    };
    return (
      <Mutation mutation={NEW_OVERRIDE} variables={values}>
        {(create, { error, loading, data, called }) => (
          <>
            {data && data.createOverride.status === 'pending' && (
              <p>
                Because you requested more items than your current subscription,
                the change needs to be reviewed by the Farmer, you should get an
                email in the next 24 hours
              </p>
            )}
            {data && data.createOverride.status === 'approved' && (
              <p>Your request has been approved!</p>
            )}
            <Error error={error} />
            <AmendLayout>
              <CalendarStyles>
                <AmendCalendar {...calendarProps} />
                {this.state.modalOpened && <Modal {...modalProps} />}
              </CalendarStyles>
            </AmendLayout>
            <MarkdownLayout>
              <ButtonStyles onClick={this.cancelSubscription}>
                To cancel your order completely click here
              </ButtonStyles>
              <ButtonStyles onClick={() => this.undoChanges()}>
                Undo Amendments
              </ButtonStyles>
              <ButtonStyles
                onClick={async e => {
                  e.preventDefault();
                  await create();
                }}
              >
                Confirm Amendments
              </ButtonStyles>
            </MarkdownLayout>
          </>
        )}
      </Mutation>
    );
  }
}

export default AmendPage;
