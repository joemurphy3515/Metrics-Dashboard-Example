import React from "react";
import { FaCar } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import "./App.css";

interface MetricProps {
  title: string;
  subtitle: string; // Added for the source details
  value: string;
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ title, subtitle, value, icon, color }: MetricProps) => (
  <div className="metric-card">
    <div className="metric-header">
      <span className="metric-icon" style={{ backgroundColor: color }}>
        {icon}
      </span>
      <div className="metric-title-group">
        <span className="metric-title">{title}</span>
        <span className="metric-subtitle">{subtitle}</span>
      </div>
    </div>
    <div className="metric-value">{value}</div>
  </div>
);

function App() {
  const metrics = [
    // Text Only
    {
      title: "Source - Dealer Web",
      subtitle: "Text Only",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - FPass",
      subtitle: "Text Only",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - Owner Web",
      subtitle: "Text Only",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - Tier3",
      subtitle: "Text Only",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },

    // Email Only
    {
      title: "Source - Dealer Web",
      subtitle: "Email Only",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - FPass",
      subtitle: "Email Only",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - Owner Web",
      subtitle: "Email Only",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - Tier3",
      subtitle: "Email Only",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },

    // No Comms
    {
      title: "Source - Dealer Web",
      subtitle: "No Comms",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - FPass",
      subtitle: "No Comms",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - Owner Web",
      subtitle: "No Comms",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
    {
      title: "Source - Tier3",
      subtitle: "No Comms",
      value: "xxxx",
      icon: <FaCar />,
      color: "#e5eafbff",
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-box">⊞</div>
          <h1 className="header-title">Metrics Dashboard</h1>
        </div>
        <div className="header-right">
          <button className="btn-primary">
            <LuUpload className="btn-icon" />
            Upload
          </button>
          <button className="btn-secondary">
            <FiDownload className="btn-icon" />
            Export
          </button>
        </div>
      </header>

      <hr className='divider'></hr>

      <section className="metrics-section">
        <h3 className="section-label">Key Metrics</h3>
        <div className="metrics-grid">
          {metrics.map((m, i) => (
            <MetricCard
              key={i}
              title={m.title}
              subtitle={m.subtitle}
              value={m.value}
              icon={m.icon}
              color={m.color}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
