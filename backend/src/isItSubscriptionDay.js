const moment = require('moment');
require('moment-recur');
const dateFns = require('date-fns');

const isItSubscriptionDay = (values, day, deliveryDays) => {
  const { subscriptionFrequency, subscriptionStartDate } = values;
  // TODO
  const firstDeliveryDate = firstDeliveryAfterStartDate(
    deliveryDays,
    subscriptionStartDate
  );
  let subStartDate = subscriptionStartDate;

  if (subStartDate === undefined) {
    subStartDate = dateFns.startOfToday();
  }
  let monthWeek = moment(subStartDate).monthWeek();
  if (monthWeek === 4) {
    monthWeek = 3;
  }
  // it is a first deliveryDays after subStartDate
  const weeklyOcurrence = moment
    .recur()
    .every(deliveryDays)
    .daysOfWeek()
    .startDate(subStartDate);
  const monthlyOccurrence = moment
    .recur()
    .every(deliveryDays)
    .daysOfWeek()
    .every([monthWeek])
    .weeksOfMonthByDay()
    .fromDate(subStartDate);
  const biweeklyOcurrence = moment(firstDeliveryDate)
    .recur()
    .every(2)
    .weeks();

  if (subscriptionFrequency === 'weekly' && weeklyOcurrence.matches(day)) {
    return true;
  } else if (
    subscriptionFrequency === 'biweekly' &&
    biweeklyOcurrence.matches(day)
  ) {
    return true;
  } else if (
    subscriptionFrequency === 'monthly' &&
    monthlyOccurrence.matches(day)
  ) {
    return true;
  }
};

const firstDeliveryAfterStartDate = (deliveryDays, startDate) => {
  let newDateCheck = startDate;
  if (newDateCheck === undefined) {
    newDateCheck = dateFns.startOfToday();
  }
  for (var i = 0; i < 7; i++) {
    if (dateFns.getDay(newDateCheck) === deliveryDays[0]) {
      return newDateCheck;
    } else {
      newDateCheck = dateFns.addDays(newDateCheck, 1);
    }
  }
};

module.exports = isItSubscriptionDay;
