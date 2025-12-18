import React, { useRef, useState } from "react";
import { FaCar } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { GrPowerReset } from "react-icons/gr";

import {
  parseCsvData,
  type DashboardCounts,
} from "./services/CommsReportParser";
import "./App.css";

interface MetricProps {
  title: string;
  subtitle: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [counts, setCounts] = useState<DashboardCounts>({});

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await parseCsvData(file);
        setCounts(result);
      } catch (err) {
        console.error("Failed to parse CSV", err);
      }
    }
  };

  const handleReset = () => {
    setCounts({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getVal = (source: string, type: string) => {
    const key = `${source}-${type}`;
    return counts[key]?.toLocaleString() || "xxxx";
  };

  const metrics = [
    {
      title: "Source - Dealer Web",
      subtitle: "Text Only",
      value: getVal("Dealer Web", "Text Only"),
    },
    {
      title: "Source - FordPass",
      subtitle: "Text Only",
      value: getVal("FordPass", "Text Only"),
    },
    {
      title: "Source - Owner Web",
      subtitle: "Text Only",
      value: getVal("Owner Web", "Text Only"),
    },
    {
      title: "Source - Tier3",
      subtitle: "Text Only",
      value: getVal("Tier3", "Text Only"),
    },

    {
      title: "Source - Dealer Web",
      subtitle: "Email Only",
      value: getVal("Dealer Web", "Email Only"),
    },
    {
      title: "Source - FordPass",
      subtitle: "Email Only",
      value: getVal("FordPass", "Email Only"),
    },
    {
      title: "Source - Owner Web",
      subtitle: "Email Only",
      value: getVal("Owner Web", "Email Only"),
    },
    {
      title: "Source - Tier3",
      subtitle: "Email Only",
      value: getVal("Tier3", "Email Only"),
    },

    {
      title: "Source - Dealer Web",
      subtitle: "No Comms",
      value: getVal("Dealer Web", "No Comms"),
    },
    {
      title: "Source - FordPass",
      subtitle: "No Comms",
      value: getVal("FordPass", "No Comms"),
    },
    {
      title: "Source - Owner Web",
      subtitle: "No Comms",
      value: getVal("Owner Web", "No Comms"),
    },
    {
      title: "Source - Tier3",
      subtitle: "No Comms",
      value: getVal("Tier3", "No Comms"),
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
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleFileChange}
          />
          <button className="btn-primary" onClick={handleUploadClick}>
            <LuUpload className="btn-icon" />
            Upload
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            <GrPowerReset />
            Reset
          </button>
          <button className="btn-secondary">
            <FiDownload className="btn-icon" />
            Export
          </button>
        </div>
      </header>

      <hr className="divider" />

      <section className="metrics-section">
        <h3 className="section-label">Key Metrics</h3>
        <div className="metrics-grid">
          {metrics.map((m, i) => (
            <MetricCard
              key={i}
              title={m.title}
              subtitle={m.subtitle}
              value={m.value}
              icon={<FaCar />}
              color="#e5eafbff"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
