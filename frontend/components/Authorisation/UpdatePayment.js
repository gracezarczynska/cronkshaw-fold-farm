import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../ErrorMessage';
import User from '../User';
import CheckoutForm from '../StripePayment';

const UPDATE_PAYMENT_MUTATION = gql`
	mutation UPDATE_PAYMENT_MUTATION($paymentMethodId: String) {
		updatePayment(paymentMethodId: $paymentMethodId) {
			message
		}
	}
`;

const UpdatePayment = () => {
	return (
		<User>
			{({ data: { me } }) => {
				return me ? (
					<Mutation mutation={UPDATE_PAYMENT_MUTATION}>
						{(updatePayment, { data, error, loading }) => (
							<>
								<h1>Update your payment</h1>
								<p>
									Hello, we have noticed that your payment method has
									failed/expired. Click below to change your payment
								</p>
								{data && <p>Thank you!</p>}
								<Error error={error} />
								{!data && !loading && (
									<CheckoutForm cta="Update" updatePayment={updatePayment} />
								)}
							</>
						)}
					</Mutation>
				) : (
					<p>Please sign in before updating your details</p>
				);
			}}
		</User>
	);
};

export default UpdatePayment;
