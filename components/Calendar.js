import React from "react";
import dateFns, { isAfter } from "date-fns";
const moment = require('moment');
require('moment-recur');

const flag = true;

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date()
  };

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            &lt;
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">&gt;</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells(deliveryDays, deliveryFrequency, deliveryStartDate, values) {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const isItSubscriptionDay = (values, day, deliveryDays) => {
      const { subscriptionFrequency, subscriptionStartDate } = values;
      let subStartDate = subscriptionStartDate;

      if (subStartDate === undefined) {
        subStartDate = dateFns.startOfToday()
      }
      let monthWeek = moment(subStartDate).monthWeek();
      if(monthWeek === 4) {
          monthWeek = 3;
      }
      // it is a first deliveryDays after subStartDate
      const weeklyOcurrence = moment.recur().every(deliveryDays).daysOfWeek().startDate(subStartDate);
      const monthlyOccurrence = moment.recur().every(deliveryDays).daysOfWeek().every([monthWeek]).weeksOfMonthByDay().fromDate(subStartDate);
      if (subscriptionFrequency === 'weekly' && weeklyOcurrence.matches(day)) {
        return true;
      } else if(subscriptionFrequency === 'biweekly' && weeklyOcurrence.matches(day)) {
        const startDay  = dateFns.getDay(subStartDate);
        const difference = dateFns.differenceInDays(day, subStartDate);
        if (difference < 7 || ((difference + (startDay - dateFns.getDay(day)) - 7) % 14 === 0)) {
          return true;
        }
      } else if(subscriptionFrequency === 'monthly' && monthlyOccurrence.matches(day)){
        return true;
      }
    }

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            } ${
              deliveryDays.indexOf(dateFns.getDay(day)) !== -1 ? "delivery-day" : ""
            } ${
              isItSubscriptionDay(values, day, deliveryDays) ? "subscription-day" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    const { deliveryDays, deliveryFrequency, startDate, values } = this.props;
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells(deliveryDays, deliveryFrequency, startDate, values)}
      </div>
    );
  }
}

export default Calendar;