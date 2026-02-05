import { Link } from "react-router-dom";
import "./Landing.css";
import bgImage from "../assets/landingbg.png";

export default function Landing() {
  return (
    <div className="landing">

      {/* =========================
         HERO
         ========================= */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(
            rgba(2,6,23,0.85),
            rgba(2,6,23,0.85)
          ), url(${bgImage})`
        }}
      >
        <div className="container">
          <h1>Smart Air Quality Monitoring System</h1>
          <p>
            Real-time monitoring of particulate matter, harmful gases,
            temperature, and humidity — designed for modern indoor spaces.
          </p>

          <div className="hero-actions">
            <Link to="/demo">
              <button className="secondary">View Live Demo</button>
            </Link>

            <Link to="/buy">
              <button className="primary">Buy Now</button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
         WHY AQI MATTERS (CARDS)
         ========================= */}
      <section className="info-section">
        <div className="container">
          <h2>Why Indoor Air Quality Matters</h2>
          <p className="section-subtitle">
            Indoor air pollution is silent, invisible, and often more dangerous
            than outdoor air.
          </p>

          <div className="card-carousel">
            <div className="info-card">
              <h3>Invisible Threats</h3>
              <p>
                Pollutants like carbon monoxide, VOCs, and PM2.5 are odorless and
                invisible. Without monitoring, exposure often goes unnoticed
                until symptoms appear.
              </p>
            </div>

            <div className="info-card">
              <h3>Everyday Sources</h3>
              <p>
                Gas stoves, cooking fumes, cleaning products, incense,
                poor ventilation, and furniture continuously release harmful
                particles indoors.
              </p>
            </div>

            <div className="info-card">
              <h3>Health Impact</h3>
              <p>
                Long-term exposure contributes to respiratory issues, headaches,
                fatigue, reduced focus, and increased health risks for children
                and seniors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
         WHY MONITORING HELPS (CARDS)
         ========================= */}
      <section className="info-section subtle">
        <div className="container">
          <h2>Why Monitoring Makes the Difference</h2>
          <p className="section-subtitle">
            You can’t fix what you can’t see.
          </p>

          <div className="card-carousel">
            <div className="info-card">
              <h3>Early Detection</h3>
              <p>
                Detect harmful gas levels and fine particles before they become
                dangerous — not after symptoms appear.
              </p>
            </div>

            <div className="info-card">
              <h3>Data-Driven Decisions</h3>
              <p>
                Understand how daily activities affect air quality and take
                targeted actions like improving ventilation or filtration.
              </p>
            </div>

            <div className="info-card">
              <h3>Healthier Living</h3>
              <p>
                Maintain a consistently safe indoor environment and reduce
                long-term exposure risks for your household or workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
         FEATURES
         ========================= */}
      <section className="features">
        <div className="container">
          <div className="feature">
            <h3>Real-Time Monitoring</h3>
            <p>Live air quality data streamed directly from the device.</p>
          </div>

          <div className="feature">
            <h3>Modular Sensors</h3>
            <p>Add optional gas sensors for advanced monitoring.</p>
          </div>

          <div className="feature">
            <h3>Compact Design</h3>
            <p>Built for homes, labs, and indoor environments.</p>
          </div>
        </div>
      </section>

      {/* =========================
         CTA
         ========================= */}
      <section className="cta">
        <div className="container">
          <h2>See the Device in Action</h2>
          <p>Explore real-time air quality data from a live demo unit.</p>

          <Link to="/demo">
            <button className="primary">Open Live Demo</button>
          </Link>
        </div>
      </section>

    </div>
  );
}
