import React from "react";
import dateFns from "date-fns";
import { isItSubscriptionDay, firstDeliveryAfterStartDate } from '../../lib/subscriptionDates';
import PopUp from './PopUp';

class AmendCalendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    popUpOpened: false,
    quantity: 0,
    day: ''
  };

  openPopUp(day) {
    if(this.state.day !== '' && !dateFns.isSameDay(this.state.day, day)) {
        this.setState({ day, overrideEndDate: day, overrideStartDate: day });
        return;
    }
    this.setState({ popUpOpened: !this.state.popUpOpened, day, overrideEndDate: day, overrideStartDate: day });
  }

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

  renderCells(deliveryDays, values, overrideStartDate, overrideEndDate) {
    const popUpProps = {
      day: this.state.day,
      values, 
      subscription: this.props.subscription,
      overrideStartDate: this.props.overrideStartDate,
      overrideEndDate: this.props.overrideEndDate,
      quantity: this.state.quantity === 0 ? this.props.subscription.quantity : this.state.quantity,
      popUpFunctions: this.props.popUpFunctions,
      canceledDates: this.props.canceledDates,
    };
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    const firstDeliveryDate = firstDeliveryAfterStartDate(deliveryDays, values.subscriptionStartDate);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        const subscriptionDay = isItSubscriptionDay(values, day, deliveryDays, firstDeliveryDate);
        const isBetweenOverrideDates = deliveryDays.indexOf(dateFns.getDay(day)) !== -1 && (dateFns.isAfter(day, overrideStartDate) && dateFns.isBefore(day, overrideEndDate) || dateFns.isEqual(day, overrideEndDate) || dateFns.isEqual(day, overrideStartDate));
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            } ${
              deliveryDays.indexOf(dateFns.getDay(day)) !== -1 ? "delivery-day" : ""
            } ${
              subscriptionDay ? "subscription-day" : ""
            } 
            ${
              this.state.popUpOpened && dateFns.isSameDay(this.state.day, day) ? "popup-opened" : ""
            }
            ${
              (this.props.canceledDates.indexOf(dateFns.format(day, 'MM/DD/YYYY')) !== -1) ? "canceled-day" : ''
            }
            ${
              isBetweenOverrideDates && values.quantity === 0 ? "override-day--cancel" : ''
            }
            ${
              isBetweenOverrideDates && values.quantity > 0 ? "override-day--add" : ''
            }`}
            key={day}
            onClick={() => this.onDateClick(cloneDay, subscriptionDay)}
          >
            <span className="number">{formattedDate}</span>
            { this.state.popUpOpened && dateFns.isSameDay(this.state.day, day) &&
              <PopUp {...popUpProps} />
            }
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

  onDateClick = (day, isItSubscriptionDayResult) => {
    isItSubscriptionDayResult ? this.openPopUp(day) : null;
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

export default AmendCalendar;