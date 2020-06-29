import UpdatePayment from '../components/Authorisation/UpdatePayment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_nCjbZkTimFUKFlBgY0H6ZDD300OOIX13Z4');

const UpdatePaymentPage = props => (
  <div>
    <Elements stripe={stripePromise}>
      <UpdatePayment />
    </Elements>
  </div>
);

export default UpdatePaymentPage;
