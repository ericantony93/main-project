import { useEffect, useState } from "react";
import "./LiveDemo.css";

export default function LiveDemo() {
  /* =========================
     DEMO / PLACEHOLDER STATE
     (Replace later with live data)
     ========================= */
  const [data, setData] = useState({
    pm25: null,
    gas: null,
    temperature: null,
    humidity: null,
  });

  const [status, setStatus] = useState("normal");

  /* =========================
     THRESHOLDS (INDUSTRY-ALIGNED)
     ========================= */
  const PM25_LIMIT = 60;      // µg/m³
  const GAS_LIMIT = 300;      // arbitrary ppm placeholder

  /* =========================
     DEMO DATA SIMULATION
     (Remove when sensors are live)
     ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const simulated = {
        pm25: Math.floor(Math.random() * 120),
        gas: Math.floor(Math.random() * 500),
        temperature: 24 + Math.random() * 3,
        humidity: 45 + Math.random() * 10,
      };

      setData(simulated);

      if (simulated.pm25 > PM25_LIMIT || simulated.gas > GAS_LIMIT) {
        setStatus("danger");
      } else {
        setStatus("normal");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h1>Live AQI Dashboard</h1>
      <p className="subtitle">
        Sample dashboard showing how real-time air quality data will appear.
      </p>

      {/* =========================
         METRIC CARDS
         ========================= */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>PM2.5</h3>
          <span>{data.pm25 ?? "—"} µg/m³</span>
        </div>

        <div className="card">
          <h3>Gas Level</h3>
          <span>{data.gas ?? "—"} ppm</span>
        </div>

        <div className="card">
          <h3>Temperature</h3>
          <span>
            {data.temperature
              ? `${data.temperature.toFixed(1)} °C`
              : "—"}
          </span>
        </div>

        <div className="card">
          <h3>Humidity</h3>
          <span>
            {data.humidity
              ? `${data.humidity.toFixed(0)} %`
              : "—"}
          </span>
        </div>
      </div>

      {/* =========================
         GRAPH AREA (PLACEHOLDER)
         ========================= */}
      <div className={`chart-placeholder ${status}`}>
        <h3>Live Sensor Graph</h3>

        {status === "danger" ? (
          <div className="alert danger">
            ⚠ Air Quality Alert  
            <p>
              Harmful air quality detected. Immediate ventilation recommended.
            </p>
          </div>
        ) : (
          <p>Air quality is within safe limits.</p>
        )}

        <div className="graph-mock">
          Real-time graph will appear here when device is connected.
        </div>
      </div>

      <p className="demo-note">
        Demo mode · Values are simulated for presentation purposes
      </p>
    </div>
  );
}
