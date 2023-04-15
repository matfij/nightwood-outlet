import { useEffect, useState } from "react";
import Router from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutFormComponent from "../../common/components/checkout-form";
import { STRIPE_PUBLISH_KEY } from "../../common/config";
import useRequest from "../../common/hooks/use-request";

const OrderDetailPage = ({ order, currentUser }) => {
  const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);
  const [secondsToExpire, setSecondsToExpire] = useState(0);
  const [doRequest, errors] = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  const calulateSecondsToExpire = () => {
    const msToExpire = new Date(order.expiresAt) - new Date();
    setSecondsToExpire(Math.round(msToExpire / 1000));
  };

  useEffect(() => {
    const intervalId = setInterval(calulateSecondsToExpire, 1000);
    calulateSecondsToExpire();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handlePayment = (payment) => {
    doRequest({
      token: payment.id,
    });
  };

  if (secondsToExpire < 0) {
    return (
      <>
        <h2 className="alert alert-danger">Order Expired</h2>
      </>
    );
  }

  return (
    <>
      <h2>Ordered Item: {order.item.name}</h2>
      <hr></hr>
      <h4>Price: {order.item.price}$</h4>
      <h4>Time to expire: {secondsToExpire}s</h4>
      <hr></hr>
      <Elements stripe={stripePromise}>
        <CheckoutFormComponent
          currentUser={currentUser}
          onPayment={handlePayment}
        />
      </Elements>
      {errors}
    </>
  );
};

OrderDetailPage.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDetailPage;
