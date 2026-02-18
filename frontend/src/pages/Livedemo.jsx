import { useEffect, useState } from "react";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./LiveDemo.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LiveDemo() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("normal");

  const PM25_LIMIT = 60;
  const GAS_LIMIT = 300;

  useEffect(() => {
    const fetchData = () => {
      fetch("http://192.168.1.5:8000/api/store/dashboard/")
        .then((res) => res.json())
        .then((response) => {
          if (!response.latest_readings) return;

          const readings = response.latest_readings;
          setData(readings);

          // Keep last 20 readings
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
    const interval = setInterval(fetchData, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: history.map((item) => item.time),
    datasets: [
      {
        label: "Temperature (°C)",
        data: history.map((item) => item.temperature),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.2)",
        tension: 0.4,
      },
      {
        label: "Humidity (%)",
        data: history.map((item) => item.humidity),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139,92,246,0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return (
    <div className="dashboard-wrapper">
      <h1>Live AQI Dashboard</h1>
      <p className="subtitle">
        Real-time air quality monitoring (Public Demo)
      </p>

      {/* METRIC CARDS */}
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

      {/* CHART SECTION */}
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

        <Line data={chartData} options={chartOptions} />
      </div>

      <p className="demo-note">
        Public demo · Auto refresh every 2 seconds
      </p>
    </div>
  );
}