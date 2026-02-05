import "./LiveDemo.css";

export default function LiveDemo() {
  return (
    <div className="dashboard-wrapper">
      <h1>Live AQI Dashboard</h1>
      <p className="subtitle">
        Sample dashboard showing how real-time air quality data will appear.
      </p>

      <div className="dashboard-grid">
        <div className="card placeholder">
          <h3>PM2.5</h3>
          <span>—</span>
        </div>

        <div className="card placeholder">
          <h3>Gas Level</h3>
          <span>—</span>
        </div>

        <div className="card placeholder">
          <h3>Temperature</h3>
          <span>—</span>
        </div>

        <div className="card placeholder">
          <h3>Humidity</h3>
          <span>—</span>
        </div>
      </div>

      <div className="chart-placeholder">
        <h3>Live Sensor Graph</h3>
        <p>Real-time graph will appear here when device is connected.</p>
      </div>

      <p className="demo-note">
        Demo mode · Data shown is illustrative
      </p>
    </div>
  );
}
