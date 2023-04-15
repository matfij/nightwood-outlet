import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutFormComponent = ({ currentUser, onPayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!elements) {
      return;
    }
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        email: currentUser.email,
      },
    });
    if (error) {
      return;
    }
    onPayment(paymentMethod);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button
          disabled={!stripe || !elements}
          className="btn btn-primary mt-3"
        >
          Pay
        </button>
      </form>
    </>
  );
};

export default CheckoutFormComponent;
