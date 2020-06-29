import UpdatePayment from '../components/Authorisation/UpdatePayment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_ZLQELKtFUScOcrZLPWxCiJPp00LWEn34Oc');

const UpdatePaymentPage = props => (
  <div>
    <Elements stripe={stripePromise}>
      <UpdatePayment />
    </Elements>
  </div>
);

export default UpdatePaymentPage;
