import { Link } from "react-router-dom";
import { useState } from "react";
import "./Landing.css";
import bgImage from "../assets/landingbg.png";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

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
            temperature, and humidity — engineered for modern indoor living.
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
         WHY AQI MATTERS
         ========================= */}
      <section className="info-section">
        <div className="container">
          <h2>Why Indoor Air Quality Matters</h2>
          <p className="section-subtitle">
            Indoor air can be 2–5x more polluted than outdoor air.
          </p>

          <div className="card-carousel">
            <div className="info-card">
              <h3>Invisible Threats</h3>
              <p>
                Pollutants like carbon monoxide, VOCs, and PM2.5 are odorless and
                undetectable without specialized monitoring.
              </p>
            </div>

            <div className="info-card">
              <h3>Everyday Exposure</h3>
              <p>
                Cooking fumes, gas stoves, cleaning chemicals, incense,
                and poor ventilation continuously degrade indoor air.
              </p>
            </div>

            <div className="info-card">
              <h3>Health Consequences</h3>
              <p>
                Long-term exposure increases risk of asthma, fatigue,
                headaches, respiratory irritation, and cardiovascular stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
         WHY MONITORING HELPS
         ========================= */}
      <section className="info-section subtle">
        <div className="container">
          <h2>Why Monitoring Makes the Difference</h2>
          <p className="section-subtitle">
            Data-driven awareness transforms prevention into protection.
          </p>

          <div className="card-carousel">
            <div className="info-card">
              <h3>Early Detection</h3>
              <p>
                Identify harmful concentration spikes before symptoms appear.
              </p>
            </div>

            <div className="info-card">
              <h3>Informed Action</h3>
              <p>
                Improve ventilation, filtration, or source control using
                real-time insights.
              </p>
            </div>

            <div className="info-card">
              <h3>Safer Environments</h3>
              <p>
                Maintain consistent indoor air standards for homes,
                offices, labs, and educational institutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
         AQI SCALE
         ========================= */}
      {/* =========================
   AQI SCALE
   ========================= */}
      <section className="aqi-section">
        <div className="container">
          <h2>Understanding AQI Levels</h2>
          <p>
            Our system converts particulate concentration into a clear
            Air Quality Index for easy interpretation.
          </p>

          <div className="aqi-scale">
            <div className="aqi-bar good">
              <h3>Good</h3>
              <span>0 – 50</span>
            </div>

            <div className="aqi-bar moderate">
              <h3>Moderate</h3>
              <span>51 – 100</span>
            </div>

            <div className="aqi-bar unhealthy">
              <h3>Unhealthy</h3>
              <span>101 – 200</span>
            </div>

            <div className="aqi-bar severe">
              <h3>Hazardous</h3>
              <span>200+</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
         HOW IT WORKS
         ========================= */}
      <section className="process-section">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-subtitle">
            From detection to insight — a seamless data pipeline.
          </p>

          <div className="process-grid">

            <div className="process-step">
              <div className="step-number">01</div>
              <h3>Sensor Detection</h3>
              <p>
                High-precision sensors continuously measure particulate matter,
                gas concentration, temperature, and humidity in real time.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">02</div>
              <h3>Cloud Processing</h3>
              <p>
                Data is securely transmitted and processed to compute AQI,
                apply thresholds, and detect abnormal patterns.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">03</div>
              <h3>Live Dashboard</h3>
              <p>
                Results are streamed to your web dashboard with alerts,
                visual indicators, and historical insights.
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
            <p>Continuous live air quality tracking.</p>
          </div>

          <div className="feature">
            <h3>Modular Architecture</h3>
            <p>Optional gas sensors for enhanced detection.</p>
          </div>

          <div className="feature">
            <h3>Compact Deployment</h3>
            <p>Designed for homes, labs, and indoor environments.</p>
          </div>
        </div>
      </section>

      {/* =========================
         FAQ
         ========================= */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>

          {[
            {
              q: "Does it work without internet?",
              a: "The device continues collecting data locally. Cloud dashboard requires internet access."
            },
            {
              q: "Is calibration required?",
              a: "Sensors are factory calibrated for indoor monitoring accuracy."
            },
            {
              q: "Can additional sensors be added later?",
              a: "Yes. The modular system supports future sensor expansion."
            }
          ].map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openFaq === index ? "open" : ""}`}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <h4>{item.q}</h4>
              {openFaq === index && <p>{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* =========================
         CTA
         ========================= */}
      <section className="cta">
        <div className="container">
          <h2>Experience Real-Time Air Monitoring</h2>
          <p>
            Explore live air quality data from our demonstration device.
          </p>

          <Link to="/demo">
            <button className="primary">Open Live Demo</button>
          </Link>
        </div>
      </section>

    </div>
  );
}