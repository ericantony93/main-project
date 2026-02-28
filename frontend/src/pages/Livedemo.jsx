import { useEffect, useState } from "react";
import "./LiveDemo.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

/* =========================
   PREMIUM CHART COMPONENT
   ========================= */
function PremiumChart({ readings }) {
  const labels = readings.map((r) => r.time);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: readings.map((r) => r.temperature),
        borderColor: "#38bdf8",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(56,189,248,0.4)");
          gradient.addColorStop(1, "rgba(56,189,248,0.02)");
          return gradient;
        },
        fill: true,
        tension: 0.45,
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: "Humidity (%)",
        data: readings.map((r) => r.humidity),
        borderColor: "#8b5cf6",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(139,92,246,0.35)");
          gradient.addColorStop(1, "rgba(139,92,246,0.02)");
          return gradient;
        },
        fill: true,
        tension: 0.45,
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: { size: 14, weight: "500" },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <div
      style={{
        height: "420px",
        padding: "30px",
        borderRadius: "24px",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))",
        boxShadow:
          "0 40px 120px rgba(56,189,248,0.15), inset 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      <Line data={chartData} options={options} />
    </div>
  );
}

/* =========================
   MAIN LIVE DEMO
   ========================= */
export default function LiveDemo() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("normal");

  const PM25_LIMIT = 60;
  const GAS_LIMIT = 300;

  useEffect(() => {
    const fetchData = () => {
      fetch("http://192.168.0.140:8000/api/store/dashboard/")
        .then((res) => res.json())
        .then((response) => {
          if (!response.latest_readings) return;

          const readings = response.latest_readings;
          setData(readings);

          setHistory((prev) => {
            const updated = [
              ...prev,
              {
                time: new Date().toLocaleTimeString(),
                temperature: readings.temperature,
                humidity: readings.humidity,
              },
            ];
            return updated.slice(-20);
          });

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

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h1>Live AQI Dashboard</h1>
      <p className="subtitle">
        Real-time air quality monitoring (Public Demo)
      </p>

      <div className="dashboard-grid">
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

      <div className={`chart-placeholder ${status}`}>
        <h3>Live Sensor Graph</h3>

        {status === "danger" ? (
          <div className="alert danger">
            ⚠ Air Quality Alert
            <p>Harmful air quality detected.</p>
          </div>
        ) : (
          <p>Air quality is within safe limits.</p>
        )}

        <PremiumChart readings={history} />
      </div>

      <p className="demo-note">
        Public demo · Auto refresh every 2 seconds
      </p>
    </div>
  );
}