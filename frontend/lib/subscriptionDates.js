const moment = require('moment');
require('moment-recur');
import { startOfToday, getDay, addDays } from "date-fns";

export const isItSubscriptionDay = (values, day, deliveryDays, firstDeliveryDate) => {
    const { subscriptionFrequency, subscriptionStartDate } = values;
    let subStartDate = subscriptionStartDate;

    if (subStartDate === undefined) {
      subStartDate = startOfToday()
    }
    let monthWeek = moment(subStartDate).monthWeek();
    if(monthWeek === 4) {
        monthWeek = 3;
    }
    // it is a first deliveryDays after subStartDate
    const weeklyOcurrence = moment.recur().every(deliveryDays).daysOfWeek().startDate(subStartDate);
    const monthlyOccurrence = moment.recur().every(deliveryDays).daysOfWeek().every([monthWeek]).weeksOfMonthByDay().fromDate(subStartDate);
    const biweeklyOcurrence = moment(firstDeliveryDate).recur().every(2).weeks();
    if (subscriptionFrequency === 'weekly' && weeklyOcurrence.matches(day)) {
      return true;
    } else if(subscriptionFrequency === 'biweekly' && biweeklyOcurrence.matches(day)) {
      return true;
    } else if(subscriptionFrequency === 'monthly' && monthlyOccurrence.matches(day)){
      return true;
    }
}

export const firstDeliveryAfterStartDate = ( deliveryDays, startDate ) => {
  let newDateCheck = startDate;
  if (newDateCheck === undefined) {
    newDateCheck = startOfToday()
  }
  for(var i = 0; i < 7; i++) {
    if (getDay(newDateCheck) === deliveryDays[0]) {
      return newDateCheck;
    } else {
      newDateCheck = addDays(newDateCheck, 1);
    }
  }
}

export const nextSubscriptionDay = (subscriptionFrequency = 'weekly', subscriptionStartDate, deliveryDays) => {
    let monthWeek = moment(subscriptionStartDate).monthWeek();
    if(monthWeek === 4) {
        monthWeek = 3;
    }
    const firstDeliveryDate = firstDeliveryAfterStartDate(deliveryDays, subscriptionStartDate);
    const weeklyOcurrence = moment.recur().every(deliveryDays).daysOfWeek().startDate(subscriptionStartDate);
    const monthlyOccurrence = moment.recur().every(deliveryDays).daysOfWeek().every([monthWeek]).weeksOfMonthByDay().fromDate(subscriptionStartDate);
    const biweeklyOcurrence = moment(firstDeliveryDate).recur().every(2).weeks();

    if (subscriptionFrequency === 'weekly') {
      return weeklyOcurrence.fromDate(moment(new Date())).next(1);
    } else if (subscriptionFrequency === 'biweekly') {
      return biweeklyOcurrence.fromDate(moment(new Date())).next(1);
    } else if (subscriptionFrequency === 'monthly') {
      return monthlyOccurrence.fromDate(moment(new Date())).next(1);
    }
}