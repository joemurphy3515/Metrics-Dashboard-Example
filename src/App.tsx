import React, { useRef, useState, useMemo } from "react";
import { FaCar } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { GrPowerReset } from "react-icons/gr";
import { MdCalendarMonth } from "react-icons/md";
import { MdAlternateEmail, MdTextsms, MdAddCircle } from "react-icons/md";
import { TbArrowBarBoth } from "react-icons/tb";
import { RxValueNone } from "react-icons/rx";

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
  iconColor: string;
}

const MetricCard = ({
  title,
  subtitle,
  value,
  icon,
  color,
  iconColor,
}: MetricProps) => (
  <div className="metric-card">
    <div className="metric-header">
      <span
        className="metric-icon"
        style={{ backgroundColor: color, color: iconColor }}
      >
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

  const months = useMemo(() => {
    const list = [];
    const years = [2025, 2026];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (const year of years) {
      for (const name of monthNames) {
        list.push(`${name} ${year}`);
      }
    }
    return list;
  }, []);

  const [allMonthlyData, setAllMonthlyData] = useState<
    Record<string, DashboardCounts>
  >({});
  const [selectedMonth, setSelectedMonth] = useState<string>(months[0]);

  const totals = useMemo(() => {
    const currentData = allMonthlyData[selectedMonth] || {};
    const sources = ["Dealer Web", "FordPass", "Owner Web", "Tier3"];

    let textOnly = 0;
    let emailOnly = 0;
    let both = 0;
    let noComms = 0;

    sources.forEach((source) => {
      textOnly += currentData[`${source}-Text Only`] || 0;
      emailOnly += currentData[`${source}-Email Only`] || 0;
      both += currentData[`${source}-Email & Text`] || 0;
      noComms += currentData[`${source}-No Comms`] || 0;
    });

    const hasData = Object.keys(currentData).length > 0;

    return {
      textOnly: hasData ? textOnly.toLocaleString() : "xxxx",
      emailOnly: hasData ? emailOnly.toLocaleString() : "xxxx",
      both: hasData ? both.toLocaleString() : "xxxx",
      noComms: hasData ? noComms.toLocaleString() : "xxxx",
      totalOptIns: hasData
        ? (textOnly + emailOnly + both).toLocaleString()
        : "xxxx",
    };
  }, [allMonthlyData, selectedMonth]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await parseCsvData(file);
        setAllMonthlyData((prev) => ({ ...prev, [selectedMonth]: result }));
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        console.error("Failed to parse CSV", err);
      }
    }
  };

  const handleResetAll = () => {
    if (window.confirm("This will clear data for ALL months. Continue?")) {
      setAllMonthlyData({});
    }
  };

  const getVal = (source: string, type: string) => {
    const currentMonthData = allMonthlyData[selectedMonth] || {};
    const key = `${source}-${type}`;
    return currentMonthData[key]?.toLocaleString() || "xxxx";
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
      subtitle: "Email & Text",
      value: getVal("Dealer Web", "Email & Text"),
    },
    {
      title: "Source - FordPass",
      subtitle: "Email & Text",
      value: getVal("FordPass", "Email & Text"),
    },
    {
      title: "Source - Owner Web",
      subtitle: "Email & Text",
      value: getVal("Owner Web", "Email & Text"),
    },
    {
      title: "Source - Tier3",
      subtitle: "Email & Text",
      value: getVal("Tier3", "Email & Text"),
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
          <div className="month-picker-container">
            <MdCalendarMonth className="picker-icon" />
            <select
              className="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
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
            <LuUpload className="btn-icon" /> Upload
          </button>
          <button className="btn-secondary" onClick={handleResetAll}>
            <GrPowerReset className="btn-icon" /> Reset All
          </button>
          <button className="btn-secondary">
            <FiDownload className="btn-icon" /> Export
          </button>
        </div>
      </header>

      <div className="view-status">
        Currently viewing data for: <strong>{selectedMonth}</strong>
        {allMonthlyData[selectedMonth] ? (
          <span className="status-badge success">Data Loaded</span>
        ) : (
          <span className="status-badge empty">No Data</span>
        )}
      </div>

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
              iconColor="#3b82f6"
            />
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="metrics-section">
        <h3 className="section-label">Totals</h3>
        <div className="metrics-grid totals-grid">
          <MetricCard
            title="TEXT ONLY"
            subtitle="All Sources"
            value={totals.textOnly}
            icon={<MdTextsms />}
            color="#E1F9F7"
            iconColor="#00A19D"
          />
          <MetricCard
            title="EMAIL ONLY"
            subtitle="All Sources"
            value={totals.emailOnly}
            icon={<MdAlternateEmail />}
            color="#E1F9F7"
            iconColor="#00A19D"
          />
          <MetricCard
            title="EMAIL & TEXT"
            subtitle="All Sources"
            value={totals.both}
            icon={<TbArrowBarBoth />}
            color="#E1F9F7"
            iconColor="#00A19D"
          />
          <MetricCard
            title="NO COMMS"
            subtitle="All Sources"
            value={totals.noComms}
            icon={<RxValueNone />}
            color="#E1F9F7"
            iconColor="#00A19D"
          />
          <MetricCard
            title="TOTAL OPT-INS"
            subtitle="Combined Sources"
            value={totals.totalOptIns}
            icon={<MdAddCircle />}
            color="#E1F9F7"
            iconColor="#00A19D"
          />
        </div>
      </section>

      <hr className="divider" />
    </div>
  );
}

export default App;
