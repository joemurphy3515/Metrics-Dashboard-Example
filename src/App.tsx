import React, { useRef, useState, useMemo } from "react";
import { FaCar, FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { FaPercentage } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { GrPowerReset } from "react-icons/gr";
import {
  MdCalendarMonth,
  MdAlternateEmail,
  MdTextsms,
  MdAddCircle,
} from "react-icons/md";
import { TbArrowBarBoth } from "react-icons/tb";
import { RxValueNone } from "react-icons/rx";

import {
  parseCsvData,
  exportDashboardData,
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

  const [sectionsOpen, setSectionsOpen] = useState({
    metrics: true,
    totals: true,
    percentages: true,
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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

  const stats = useMemo(() => {
    const data = allMonthlyData[selectedMonth] || {};
    const sources = ["Dealer Web", "FordPass", "Owner Web", "Tier3"];
    const n = (s: string, t: string) => data[`${s}-${t}`] || 0;

    const textOnly = sources.reduce((acc, s) => acc + n(s, "Text Only"), 0);
    const emailOnly = sources.reduce((acc, s) => acc + n(s, "Email Only"), 0);
    const both = sources.reduce((acc, s) => acc + n(s, "Email & Text"), 0);
    const noComms = sources.reduce((acc, s) => acc + n(s, "No Comms"), 0);
    const totalOptIns = textOnly + emailOnly + both;

    const getPlatformOptIns = (s: string) =>
      n(s, "Text Only") + n(s, "Email Only") + n(s, "Email & Text");
    const dxOptIns = getPlatformOptIns("Dealer Web");
    const fpOptIns = getPlatformOptIns("FordPass");
    const owOptIns = getPlatformOptIns("Owner Web");
    const t3OptIns = getPlatformOptIns("Tier3");
    const cxOptIns = fpOptIns + owOptIns + t3OptIns;

    const hasData = Object.keys(data).length > 0 && totalOptIns > 0;
    const fmtPct = (val: number) =>
      hasData ? `${((val / totalOptIns) * 100).toFixed(1)}%` : "xxxx";

    return {
      totals: {
        textOnly: hasData ? textOnly.toLocaleString() : "xxxx",
        emailOnly: hasData ? emailOnly.toLocaleString() : "xxxx",
        both: hasData ? both.toLocaleString() : "xxxx",
        noComms: hasData ? noComms.toLocaleString() : "xxxx",
        totalOptIns: hasData ? totalOptIns.toLocaleString() : "xxxx",
      },
      percentages: {
        textOnly: fmtPct(textOnly),
        emailOnly: fmtPct(emailOnly),
        both: fmtPct(both),
        dx: fmtPct(dxOptIns),
        cx: fmtPct(cxOptIns),
        fp: fmtPct(fpOptIns),
        ow: fmtPct(owOptIns),
        t3: fmtPct(t3OptIns),
      },
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
        console.error(err);
      }
    }
  };

  const handleResetAll = () => {
    if (window.confirm("This will clear data for ALL months. Continue?"))
      setAllMonthlyData({});
  };

  const getVal = (source: string, type: string) => {
    const currentData = allMonthlyData[selectedMonth] || {};
    return currentData[`${source}-${type}`]?.toLocaleString() || "xxxx";
  };

  const handleExport = () => {
    if (!allMonthlyData[selectedMonth]) {
      alert("No data available to export for this month.");
      return;
    }

    const metricsForExport: {
      title: string;
      subtitle: string;
      value: string;
    }[] = [];
    ["Text Only", "Email Only", "Email & Text", "No Comms"].forEach((type) => {
      ["Dealer Web", "FordPass", "Owner Web", "Tier3"].forEach((source) => {
        metricsForExport.push({
          title: `Source - ${source}`,
          subtitle: type,
          value: getVal(source, type),
        });
      });
    });

    exportDashboardData(
      selectedMonth,
      metricsForExport,
      stats.totals,
      stats.percentages
    );
  };

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
          <button className="btn-secondary" onClick={handleExport}>
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

      {/* KEY METRICS SECTION */}
      <section className="metrics-section">
        <div
          className="section-header-clickable"
          onClick={() => toggleSection("metrics")}
        >
          <h3 className="section-label">
            Key Metrics
            {sectionsOpen.metrics ? (
              <FaChevronDown className="chevron" />
            ) : (
              <FaChevronRight className="chevron" />
            )}
          </h3>
        </div>

        {sectionsOpen.metrics && (
          <div className="metrics-grid">
            {["Text Only", "Email Only", "Email & Text", "No Comms"].map(
              (type) =>
                ["Dealer Web", "FordPass", "Owner Web", "Tier3"].map(
                  (source) => (
                    <MetricCard
                      key={`${source}-${type}`}
                      title={`Source - ${source}`}
                      subtitle={type}
                      value={getVal(source, type)}
                      icon={<FaCar />}
                      color="#e5eafbff"
                      iconColor="#3b82f6"
                    />
                  )
                )
            )}
          </div>
        )}
      </section>

      <hr className="divider" />

      {/* TOTALS SECTION */}
      <section className="metrics-section">
        <div
          className="section-header-clickable"
          onClick={() => toggleSection("totals")}
        >
          <h3 className="section-label">
            Totals
            {sectionsOpen.totals ? (
              <FaChevronDown className="chevron" />
            ) : (
              <FaChevronRight className="chevron" />
            )}
          </h3>
        </div>

        {sectionsOpen.totals && (
          <div className="metrics-grid totals-grid">
            <MetricCard
              title="TEXT ONLY"
              subtitle="All Sources"
              value={stats.totals.textOnly}
              icon={<MdTextsms />}
              color="#E1F9F7"
              iconColor="#00A19D"
            />
            <MetricCard
              title="EMAIL ONLY"
              subtitle="All Sources"
              value={stats.totals.emailOnly}
              icon={<MdAlternateEmail />}
              color="#E1F9F7"
              iconColor="#00A19D"
            />
            <MetricCard
              title="EMAIL & TEXT"
              subtitle="All Sources"
              value={stats.totals.both}
              icon={<TbArrowBarBoth />}
              color="#E1F9F7"
              iconColor="#00A19D"
            />
            <MetricCard
              title="NO COMMS"
              subtitle="All Sources"
              value={stats.totals.noComms}
              icon={<RxValueNone />}
              color="#E1F9F7"
              iconColor="#00A19D"
            />
            <MetricCard
              title="TOTAL OPT-INS"
              subtitle="Combined Sources"
              value={stats.totals.totalOptIns}
              icon={<MdAddCircle />}
              color="#E1F9F7"
              iconColor="#00A19D"
            />
          </div>
        )}
      </section>

      <hr className="divider" />

      {/* PERCENTAGES SECTION */}
      <section className="metrics-section">
        <div
          className="section-header-clickable"
          onClick={() => toggleSection("percentages")}
        >
          <h3 className="section-label">
            Opt-In Percentages
            {sectionsOpen.percentages ? (
              <FaChevronDown className="chevron" />
            ) : (
              <FaChevronRight className="chevron" />
            )}
          </h3>
        </div>

        {sectionsOpen.percentages && (
          <div className="metrics-grid">
            <MetricCard
              title="TEXT ONLY %"
              subtitle="of Total Opt-ins"
              value={stats.percentages.textOnly}
              icon={<FaPercentage />}
              color="#EAE1F9"
              iconColor="#7D35EF"
            />
            <MetricCard
              title="EMAIL ONLY %"
              subtitle="of Total Opt-ins"
              value={stats.percentages.emailOnly}
              icon={<FaPercentage />}
              color="#EAE1F9"
              iconColor="#7D35EF"
            />
            <MetricCard
              title="EMAIL & TEXT %"
              subtitle="of Total Opt-ins"
              value={stats.percentages.both}
              icon={<FaPercentage />}
              color="#EAE1F9"
              iconColor="#7D35EF"
            />
            <MetricCard
              title="DX PLATFORMS"
              subtitle="Dealer Web Dist."
              value={stats.percentages.dx}
              icon={<FaPercentage />}
              color="#EAE1F9"
              iconColor="#7D35EF"
            />
            <MetricCard
              title="CX PLATFORMS"
              subtitle="Consumer Dist."
              value={stats.percentages.cx}
              icon={<FaPercentage />}
              color="#EAE1F9"
              iconColor="#7D35EF"
            />
            <MetricCard
              title="FORDPASS ONLY"
              subtitle="Platform Dist."
              value={stats.percentages.fp}
              icon={<FaPercentage />}
              color="#EAE1F9"
              iconColor="#7D35EF"
            />
            <MetricCard
              title="OWNER WEB ONLY"
              subtitle="Platform Dist."
              value={stats.percentages.ow}
              icon={<FaPercentage />}
              color="#EAE1F9"
              iconColor="#7D35EF"
            />
            <MetricCard
              title="TIER3 ONLY"
              subtitle="Platform Dist."
              value={stats.percentages.t3}
              icon={<FaPercentage />}
              color="#EAE1F9"
              iconColor="#7D35EF"
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
