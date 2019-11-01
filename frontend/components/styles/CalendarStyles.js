import styled from 'styled-components';

const CalendarStyles = styled.div`
  .row {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }

  .row-middle {
    align-items: center;
  }

  .col {
    flex-grow: 1;
    flex-basis: 0;
    max-width: 100%;
  }

  .col-start {
    justify-content: flex-start;
    text-align: left;
  }

  .col-center {
    justify-content: center;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .col-end {
    justify-content: flex-end;
    text-align: right;
  }

  /* Calendar */

  .calendar {
    display: block;
    position: relative;
    width: 100%;
    background: var(--neutral-color);
    border: 1px solid ${props => props.theme.grey};
  }

  .calendar .body .cell.popup-opened {
    overflow: visible;
    position: relative;
  }

  .calendar .header {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 1.15em;
    padding: 1.5em 0;
    border-bottom: 1px solid ${props => props.theme.grey};
  }

  .calendar .header .icon {
    cursor: pointer;
    transition: 0.15s ease-out;
  }

  .calendar .header .icon:hover {
    transform: scale(1.75);
    transition: 0.25s ease-out;
    color: var(--main-color);
  }

  .calendar .header .icon:first-of-type {
    margin-left: 1em;
  }

  .calendar .header .icon:last-of-type {
    margin-right: 1em;
  }

  .calendar .days {
    text-transform: uppercase;
    font-weight: 400;
    color: var(--text-color-light);
    font-size: 1em;
    padding: 0.75em 0;
    border-bottom: 1px solid ${props => props.theme.grey};
  }

  .calendar .body .cell {
    position: relative;
    height: 5em;
    border-right: 1px solid ${props => props.theme.grey};
    overflow: hidden;
    cursor: pointer;
    background: ${props => props.theme.darkgrey};
    transition: 0.25s ease-out;
  }

  .calendar .body .cell:hover {
    background: var(--bg-color);
    transition: 0.5s ease-out;
  }

  .calendar .body .selected {
  }

  .calendar .body .row {
    border-bottom: 1px solid ${props => props.theme.grey};
  }

  .calendar .body .row:last-child {
    border-bottom: none;
  }

  .calendar .body .cell:last-child {
    border-right: none;
  }

  .calendar .body .cell .number {
    font-size: 1.2em;
    line-height: 1;
    top: 0.75em;
    right: 0.75em;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .calendar .body .cell.override-day--cancel .number {
    &:before,
    &:after {
      position: absolute;
      content: '';
      background: ${props => props.theme.orange};
      display: block;
      width: 100%;
      height: 5px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }

    &:after {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  .calendar .body .cell.override-day--add {
    background-color: #603e07;
  }

  .calendar .body .cell.delivery-day {
    .number {
      height: 2em;
      width: 2em;
      border: 1px solid ${props => props.theme.orange};
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      @media (min-width: 860px) {
        height: 3em;
        width: 3em;
      }
    }
  }

  .calendar .body .cell.delivery-day.disabled .number {
    border: 1px solid ${props => props.theme.grey};
  }

  .calendar .body .cell.subscription-day {
    .number {
      background-color: ${props => props.theme.orange};
    }

    &.override-day--cancel .number {
      background-color: ${props => props.theme.black};
    }

    &.override-day--add {
      background-color: #603e07;
    }
  }

  .calendar .body .cell.subscription-day.disabled {
    background-color: ${props => props.theme.black};
  }

  .calendar .body .cell.canceled-day .number {
    background-color: ${props => props.theme.black};

    &:before,
    &:after {
      position: absolute;
      content: '';
      background: ${props => props.theme.orange};
      display: block;
      width: 100%;
      height: 5px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }

    &:after {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  .calendar .body .disabled {
    color: #434242;
    background-color: #2a2929;
    pointer-events: none;
  }

  .calendar .body .col {
    flex-grow: 0;
    flex-basis: calc(100% / 7);
    width: calc(100% / 7);
    text-align: center;
    display: table;
    vertical-align: middle;
  }
`;

export default CalendarStyles;
