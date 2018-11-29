import React from 'react'
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

import STRIPE_PUBLISHABLE from '../constants/stripe';
import PAYMENT_SERVER_URL from '../constants/server';

const CURRENCY = 'USD';

const fromEuroToCent = amount => amount * 100;

let savedUser = JSON.parse(sessionStorage.getItem("userId"));
console.log(savedUser)

const successPayment = data => {
  console.log(savedUser)
  alert('Payment Successful');
};

const errorPayment = data => {
  console.log(savedUser)
  alert('Payment Error');
};

const onToken = (amount, description) => token =>{
console.log(description, token.id, CURRENCY, fromEuroToCent(amount))
  axios.post(PAYMENT_SERVER_URL,
    {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: fromEuroToCent(amount)
    })
    .then(successPayment)
    .catch(errorPayment);
  }
const Checkout = ({ name, description, amount }) =>
  <StripeCheckout
    name={name}
    description={description}
    amount={fromEuroToCent(amount)}
    token={onToken(amount, description)}
    currency={CURRENCY}
    stripeKey={STRIPE_PUBLISHABLE}
  />

export default Checkout;