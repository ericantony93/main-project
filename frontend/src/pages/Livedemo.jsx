import { useEffect, useState } from "react";
import "./LiveDemo.css";

export default function LiveDemo() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("normal");

  const PM25_LIMIT = 60;
  const GAS_LIMIT = 300;

  /* =========================
     FETCH LIVE SENSOR DATA
     ========================= */
  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:8000/api/store/dashboard/")
        .then((res) => res.json())
        .then((response) => {
          if (!response.latest_readings) return;

          const readings = response.latest_readings;

          setData(readings);

          if (
            readings.pm25 > PM25_LIMIT ||
            readings.gas > GAS_LIMIT
          ) {
            setStatus("danger");
          } else {
            setStatus("normal");
          }
        })
        .catch((err) => {
          console.error("Dashboard fetch error:", err);
        });
    };

    fetchData(); // initial load
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h1>Live AQI Dashboard</h1>
      <p className="subtitle">
        Real-time air quality monitoring (Public Demo)
      </p>

      {/* METRIC CARDS */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>PM2.5</h3>
          <span>
            {data?.pm25 ? `${data.pm25} µg/m³` : "—"}
          </span>
        </div>

        <div className="card">
          <h3>Gas Level</h3>
          <span>
            {data?.gas ? `${data.gas} ppm` : "—"}
          </span>
        </div>

        <div className="card">
          <h3>Temperature</h3>
          <span>
            {data?.temperature
              ? `${data.temperature.toFixed(1)} °C`
              : "—"}
          </span>
        </div>

        <div className="card">
          <h3>Humidity</h3>
          <span>
            {data?.humidity
              ? `${data.humidity.toFixed(0)} %`
              : "—"}
          </span>
        </div>
      </div>

      {/* STATUS / GRAPH SECTION */}
      <div className={`chart-placeholder ${status}`}>
        <h3>Live Sensor Graph</h3>

        {status === "danger" ? (
          <div className="alert danger">
            ⚠ Air Quality Alert
            <p>
              Harmful air quality detected. Ventilation recommended.
            </p>
          </div>
        ) : (
          <p>Air quality is within safe limits.</p>
        )}

        <div className="graph-mock">
          Real-time graph will appear here.
        </div>
      </div>

      <p className="demo-note">
        Public demo · Auto refresh every 5 seconds
      </p>
    </div>
  );
}