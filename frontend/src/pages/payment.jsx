import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import PaymentForm from "./paymentform";

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51Sy87S1X4vWqxrH8rORrfjZCpLEWNJbt9cGKo9qKQt9nyii4MQ1ZfRF4KY2nNCexcYvm2DFKidvWbgKHOfYbyv4N00pdfO8FWR";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function Payment() {
  const { orderId } = useParams();

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm orderId={orderId} />
    </Elements>
  );
}