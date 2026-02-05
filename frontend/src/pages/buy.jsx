import { useNavigate } from "react-router-dom";
import "./buy.css";
import bgImage from "../assets/buy-bg.png"; // 👈 background image

export default function Buy() {
  const navigate = useNavigate();

  return (
    <div
      className="buy-page"
      style={{
        backgroundImage: `linear-gradient(
          rgba(2, 6, 23, 0.65),
          rgba(2, 6, 23, 0.65)
        ), url(${bgImage})`
      }}
    >
      <div className="buy-container">
        <div className="buy-card">
          <h1>Smart AQI Monitoring System</h1>

          <p className="subtitle">
            A compact IoT-based air quality monitoring device that measures:
          </p>

          <ul className="features-list">
            <li>PM2.5 levels</li>
            <li>Gas concentration</li>
            <li>Temperature</li>
            <li>Humidity</li>
          </ul>

          <div className="price">₹ 4,999</div>

          <button
            className="primary buy-btn"
            onClick={() => navigate("/auth")}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
