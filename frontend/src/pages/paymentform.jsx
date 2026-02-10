import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import "./Payment.css";

export default function PaymentForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [total, setTotal] = useState(null);

  /* =========================
     FETCH ORDER TOTAL + PAYMENT INTENT
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setError("You must be logged in to pay");
      return;
    }

    fetch("http://localhost:8000/api/store/create-payment-intent/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order_id: orderId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create payment intent");
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setTotal(data.amount); // ✅ REAL TOTAL FROM ORDER
      })
      .catch(() => setError("Unable to initialize payment"));
  }, [orderId]);

  /* =========================
     SUBMIT PAYMENT
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { name },
      },
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      window.location.href = "/success";
    }
  };

  /* =========================
     STRIPE INPUT STYLES
     ========================= */
  const elementStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#e5e7eb",
        "::placeholder": { color: "#9ca3af" },
      },
      invalid: { color: "#f87171" },
    },
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <h2>Complete Payment</h2>
        <p className="subtitle">
          Secure checkout · SSL encrypted · Powered by Stripe
        </p>

        {/* ORDER SUMMARY */}
        <div className="summary-box">
          <div className="row">
            <span>Product</span>
            <span>Smart AQI Monitoring System</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>₹ {total ?? "—"}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* CARDHOLDER NAME */}
          <label>Cardholder Name</label>
          <input
            placeholder="Name on card"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* CARD NUMBER */}
          <label>Card Number</label>
          <div className="card-element">
            <CardNumberElement options={elementStyle} />
          </div>

          {/* EXPIRY + CVC */}
          <div className="card-row">
            <div>
              <label>Expiry</label>
              <div className="card-element">
                <CardExpiryElement options={elementStyle} />
              </div>
            </div>

            <div>
              <label>CVC</label>
              <div className="card-element">
                <CardCvcElement options={elementStyle} />
              </div>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button
            className="primary pay-btn"
            disabled={!stripe || loading}
          >
            {loading ? "Processing…" : "Pay Now"}
          </button>
        </form>

        <p className="secure-note">
          🔒 Your card details are never stored on our servers
        </p>
      </div>
    </div>
  );
}