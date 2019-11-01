export default function calcTotal(values) {
  const { subscriptionFrequency, quantity, price } = values;
  switch(subscriptionFrequency) {
    case "monthly":
      return quantity * price;
    case "biweekly":
      return (quantity * 26 * price) / 12;
    case "weekly":
      return (quantity * 52 * price) / 12;
  }   
}
