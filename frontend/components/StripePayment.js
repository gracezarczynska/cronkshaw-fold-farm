import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styled from 'styled-components';
import { ButtonStyles } from './styles/ButtonStyles';

const CARD_OPTIONS = {
	iconStyle: 'solid',
	hidePostalCode: true,
	style: {
		base: {
			iconColor: '#2F2E2E',
			color: '#2F2E2E',
			fontWeight: 500,
			fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
			fontSize: '16px',
			fontSmoothing: 'antialiased',
			':-webkit-autofill': { color: '#2F2E2E' },
			'::placeholder': { color: '#2F2E2E' },
		},
		invalid: {
			iconColor: '#ffc7ee',
			color: '#ffc7ee',
		},
	},
};

const Wrapper = styled.div`
	margin: 0 15px 20px;
	padding: 0;
	border-style: none;
	background-color: #f29d12;
	will-change: opacity, transform;
	box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
		inset 0 1px 0 #f29d12;
	border-radius: 4px;

	.FormRow {
		display: -ms-flexbox;
		display: flex;
		-ms-flex-align: center;
		align-items: center;
		margin-left: 15px;
	}

	.StripeElement--webkit-autofill {
		background: transparent !important;
	}

	.StripeElement {
		width: 100%;
		padding: 11px 15px 11px 0;
	}
`;

const CheckoutForm = (props) => {
	const [loading, setLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (event) => {
		setLoading(true);
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}
		const cardElement = elements.getElement(CardElement);

		// Use your card Element with other Stripe.js APIs
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		});

		if (error) {
			setLoading(false);
			throw error;
		} else {
			await props
				.updatePayment({
					variables: {
						paymentMethodId: paymentMethod.id,
					},
				})
				.catch((err) => {
					throw err;
				});
			setLoading(false);

			props.nextStep ? props.nextStep() : null;
		}
	};

	return (
		<Wrapper>
			<form onSubmit={handleSubmit} className="FormRow">
				<CardElement options={CARD_OPTIONS} />
				<ButtonStyles
					className="inverted"
					type="submit"
					disabled={!stripe || loading}
				>
					{props.cta}
				</ButtonStyles>
			</form>
		</Wrapper>
	);
};

export default CheckoutForm;
