const STRIPE_PUBLISHABLE = process.env.NODE_ENV === 'production'
  ? 'pk_live_MY_PUBLISHABLE_KEY'
  : 'pk_test_pm5fBeUOm5WMtTN7Cwo4gp9o';

export default STRIPE_PUBLISHABLE;
