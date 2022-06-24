const express = require("express");
const app = express();
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const YOUR_DOMAIN = 'http://localhost:4020/stripe';

const router = express.Router();

router.get("/", function (req, res) {
  console.log('-- Stripe Services -- ');
  res.send('Stripe Payment Services');
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

router.post("/create-checkout-session", function (req, res) {
  createCheckoutSession().then(function () {
    console.log('Checkout done ');
  })
  res.send('Sucessfully paid')
});

async function createCheckoutSession() {
  console.log('create-checkout-session');
  const product = await stripe.products.create({ name: 'T-shirt' });
  console.log('product ', product);
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2000,
    currency: 'usd',
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });
}

router.post("/create-payment-intent", function (req, res) {
  createPaymentIntent().then(function (client_secret) {
    console.log('Checkout done ',client_secret);
    res.send(client_secret)
  })

});

async function createPaymentIntent() {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1200,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return paymentIntent.client_secret;
}

module.exports = router
