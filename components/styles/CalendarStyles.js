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
  border: 1px solid ${props => props.theme.grey};;
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
  transition: .15s ease-out;
}

.calendar .header .icon:hover {
  transform: scale(1.75);
  transition: .25s ease-out;
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
  padding: .75em 0;
  border-bottom: 1px solid ${props => props.theme.grey};
}

.calendar .body .cell {
  position: relative;
  height: 5em;
  border-right: 1px solid ${props => props.theme.grey};
  overflow: hidden;
  cursor: pointer;
  background: #202020;
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
  top: .75em;
  right: .75em;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.calendar .body .cell.delivery-day .number {
  height: 3em;
  width: 3em;
  border: 1px solid ${props => props.theme.orange};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar .body .cell.delivery-day.disabled .number {
  border: 1px solid ${props => props.theme.grey};
}

.calendar .body .cell.subscription-day .number {
  background-color: ${props => props.theme.orange};
}

.calendar .body .cell.subscription-day.disabled {
  background-color: ${props => props.theme.black};
}

.calendar .body .disabled {
  color: #434242;
  background-color: #2a2929;
  pointer-events: none;
}

.calendar .body .col {
  flex-grow: 0;
  flex-basis: calc(100%/7);
  width: calc(100%/7);
  text-align: center;
  display: table;
  vertical-align: middle;
}
`;

export default CalendarStyles;