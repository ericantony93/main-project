import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
    "pk_test_51Sy87S1X4vWqxrH8rORrfjZCpLEWNJbt9cGKo9qKQt9nyii4MQ1ZfRF4KY2nNCexcYvm2DFKidvWbgKHOfYbyv4N00pdfO8FWR"
);