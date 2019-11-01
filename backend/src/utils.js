const moment = require('moment');
require('moment-recur');
const dateFns = require('date-fns');

const hasPermission = (user, permissionsNeeded) => {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
      `);
  }
};

const calcTotal = values => {
  const { subscriptionFrequency, quantity, price } = values;
  switch (subscriptionFrequency) {
    case 'monthly':
      return quantity;
    case 'biweekly':
      return quantity * 2;
    case 'weekly':
      return (quantity * 52 * price) / 12;
  }
};

getEnrollmentDates = (
  subscriptionStartDate,
  subscriptionFrequency,
  deliveryDays
) => {
  const startDate = firstDeliveryAfterStartDate(
    deliveryDays,
    subscriptionStartDate
  );
  const SubscriptionDates = [];
  switch (subscriptionFrequency) {
    case 'weekly':
      for (let i = 0; i < 52; i++) {
        console.log(dateFns.addWeeks(startDate, i));
        SubscriptionDates.push(dateFns.format(dateFns.addWeeks(startDate, i)));
      }
      return SubscriptionDates;
    case 'biweekly':
      for (let i = 0; i < 52; i = i + 2) {
        SubscriptionDates.push(dateFns.format(dateFns.addWeeks(startDate, i)));
      }
      return SubscriptionDates;
    case 'monthly':
      let monthWeek = moment(startDate).monthWeek();
      if (monthWeek === 4) {
        monthWeek = 3;
      }
      const monthlyOccurrence = moment
        .recur()
        .every(deliveryDays)
        .daysOfWeek()
        .every([monthWeek])
        .weeksOfMonthByDay()
        .fromDate(subStartDate);
      return monthlyOccurrence.next(12);
    default:
      return null;
  }
};

const firstDeliveryAfterStartDate = startDate => {
  let newDateCheck = startDate;
  if (newDateCheck === undefined) {
    newDateCheck = dateFns.startOfToday();
  }
  for (var i = 0; i < 7; i++) {
    if (dateFns.getDay(newDateCheck) === 2) {
      return newDateCheck;
    } else {
      newDateCheck = dateFns.addDays(newDateCheck, 1);
    }
  }
};

module.exports = {
  calcTotal,
  hasPermission,
  getEnrollmentDates
};
