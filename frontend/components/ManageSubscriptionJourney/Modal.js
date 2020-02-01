import React, { Component } from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';

import { NumberInput, ButtonStyles } from '../styles/ButtonStyles';
import { buildDropdown } from '../../lib/buildDropdown';

const ModalStyles = styled.div`
  width: 100%;
  position: absolute;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: ${props => props.theme.transparentGrey};
  display: flex;
  justify-content: center;
  align-items: center;

  .modal {
    &__container {
      max-width: 350px;
      height: auto;
      background-color: ${props => props.theme.darkgrey};
      padding: 40px;
      position: relative;
    }
    &__close-button {
      position: absolute;
      right: 5px;
      top: 20px;
      width: 30px;
      height: 30px;
      -webkit-appearance: none;
      -moz-appearance: none;
      border: none;
      background-color: transparent;
      color: ${props => props.theme.orange};
      font-size: 2em;
      line-height: 0;
      font-family: 'Helvetica';

      &:focus {
        outline: none;
      }
    }
  }

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;

    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid ${props => props.theme.grey};
    left: -8px;

    top: 7px;
  }
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
  font-family: Helvetica, sans-serif;
`;

const DatesLayout = styled.div`
  label {
    display: block;
    padding: 10px 0 0;
  }
`;

class Modal extends Component {
  render() {
    const {
      day,
      subscription,
      overrideStartDate,
      overrideEndDate,
      quantity,
      amendFunctions,
      variant
    } = this.props;
    const values = {
      subscriptionId: subscription.id,
      overrideStartDate,
      overrideEndDate,
      quantity: quantity || this.props.subscription.quantity
    };
    return (
      <ModalStyles>
        <div className='modal__container'>
          {variant === 'cancel' ? (
            <h3>You are canceling your delivery between dates</h3>
          ) : (
            <h3>
              You are editing your delivery on the{' '}
              {format(day, 'dd mmm yyyy')}
            </h3>
          )}
          {variant === 'request' && (
            <NumberInput
              value={quantity}
              onChange={amendFunctions.handleChange('quantity')}
            >
              {buildDropdown(
                subscription.product.availableStock,
                subscription.product.unit,
                true
              )}
            </NumberInput>
          )}
          <DatesLayout>
            <div>
              <label>Start Date</label>
              <DateInput
                onChange={amendFunctions.handleChange('overrideStartDate')}
                value={format(overrideStartDate, 'yyyy-mm-dd')}
                type='date'
                placeholder='Starting date'
              />
            </div>
            <div>
              <label>End Date</label>
              <DateInput
                onChange={amendFunctions.handleChange('overrideEndDate')}
                value={format(overrideEndDate, 'yyyy-mm-dd')}
                min={format(overrideStartDate, 'yyyy-mm-dd')}
                type='date'
                placeholder='End date'
              />
            </div>
          </DatesLayout>
          <ButtonStyles onClick={() => this.props.amendFunctions.closeModal()}>
            Confirm
          </ButtonStyles>
        </div>
      </ModalStyles>
    );
  }
}

export default Modal;
