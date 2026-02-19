import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  /* =========================
     WINDOW RESIZE LISTENER
     ========================= */
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =========================
     FETCH ORDER DETAILS
     ========================= */
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token || !orderId) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:8000/api/store/order/${orderId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 12000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(redirectTimer);
    };
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="success-wrapper">
        <div className="success-card">
          <h2>Verifying Payment...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="success-wrapper">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={300}
          gravity={0.25}
          recycle={false}
          colors={["#38bdf8", "#8b5cf6", "#22c55e", "#ffffff"]}
        />
      )}

      <div className="success-card premium-glow">
        <div className="checkmark">✓</div>

        <h1>Payment Confirmed</h1>

        <p className="subtitle">
          Your Smart AQI Monitoring System order has been successfully processed.
        </p>

        <div className="success-details">
          <div>
            <span>Order ID</span>
            <strong>#{order?.id}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong className="paid">Paid</strong>
          </div>

          <div>
            <span>Amount Paid</span>
            <strong>₹ {order?.total}</strong>
          </div>
        </div>

        <p className="note">
          A receipt has been sent to your registered email address.
        </p>

        <button
          className="primary"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}