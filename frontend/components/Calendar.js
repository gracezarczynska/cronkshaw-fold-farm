import React from "react";
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, endOfWeek, isAfter, isBefore, isEqual, isSameMonth, isSameDay, getDay, addMonths, subMonths } from "date-fns";
import { isItSubscriptionDay, firstDeliveryAfterStartDate } from '../lib/subscriptionDates';

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date()
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            &lt;
          </div>
        </div>
        <div className="col col-center">
          <span>{format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">&gt;</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "EEEEEE";
    const days = [];

    let startDate = startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells(deliveryDays, values, overrideStartDate, overrideEndDate) {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const firstDeliveryDate = firstDeliveryAfterStartDate(deliveryDays, values.subscriptionStartDate);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const subscriptionDay = isItSubscriptionDay(values, day, deliveryDays, firstDeliveryDate);
        const isBetweenOverrideDates = isAfter(day, overrideStartDate) && isBefore(day, overrideEndDate) || isEqual(day, overrideEndDate) || isEqual(day, overrideStartDate);
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate) ? "selected" : ""
            } ${
              deliveryDays.indexOf(getDay(day)) !== -1 ? "delivery-day" : ""
            } ${
              isBetweenOverrideDates ? "override-day" : ""
            } ${
              subscriptionDay ? "subscription-day" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(cloneDay, subscriptionDay)}
          >
            <span className="number">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
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

  onDateClick = (day, isItSubscriptionDayResult) => {
    isItSubscriptionDayResult ? this.props.amendFunctions.openModal(day) : null;
  };

  nextMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    const { deliveryDays, values, overrideStartDate, overrideEndDate } = this.props;
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells(deliveryDays, values, overrideStartDate, overrideEndDate)}
      </div>
    );
  }
}

export default Calendar;