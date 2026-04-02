import { useState, useMemo, useEffect, useCallback } from "react";

// ─── Google Fonts ───────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_TRANSACTIONS = [
  { id: 1, date: "2025-03-01", description: "Salary Deposit", category: "Income", amount: 5800, type: "income" },
  { id: 2, date: "2025-03-02", description: "Apartment Rent", category: "Housing", amount: 1400, type: "expense" },
  { id: 3, date: "2025-03-04", description: "Whole Foods", category: "Groceries", amount: 127.4, type: "expense" },
  { id: 4, date: "2025-03-05", description: "Netflix", category: "Subscriptions", amount: 15.99, type: "expense" },
  { id: 5, date: "2025-03-06", description: "Freelance Project", category: "Income", amount: 1200, type: "income" },
  { id: 6, date: "2025-03-08", description: "Electricity Bill", category: "Utilities", amount: 89.5, type: "expense" },
  { id: 7, date: "2025-03-09", description: "Restaurant Dinner", category: "Dining", amount: 74.3, type: "expense" },
  { id: 8, date: "2025-03-11", description: "Gym Membership", category: "Health", amount: 49, type: "expense" },
  { id: 9, date: "2025-03-13", description: "Amazon Purchase", category: "Shopping", amount: 134.99, type: "expense" },
  { id: 10, date: "2025-03-15", description: "Spotify", category: "Subscriptions", amount: 9.99, type: "expense" },
  { id: 11, date: "2025-03-17", description: "Coffee Shop", category: "Dining", amount: 23.5, type: "expense" },
  { id: 12, date: "2025-03-18", description: "Dividend Income", category: "Income", amount: 340, type: "income" },
  { id: 13, date: "2025-03-20", description: "Internet Bill", category: "Utilities", amount: 59.99, type: "expense" },
  { id: 14, date: "2025-03-22", description: "Gas Station", category: "Transport", amount: 55, type: "expense" },
  { id: 15, date: "2025-03-24", description: "Online Course", category: "Education", amount: 199, type: "expense" },
  { id: 16, date: "2025-03-25", description: "Consulting Fee", category: "Income", amount: 850, type: "income" },
  { id: 17, date: "2025-03-26", description: "Pharmacy", category: "Health", amount: 32.6, type: "expense" },
  { id: 18, date: "2025-03-27", description: "Uber Rides", category: "Transport", amount: 41.2, type: "expense" },
  { id: 19, date: "2025-03-28", description: "Grocery Run", category: "Groceries", amount: 98.3, type: "expense" },
  { id: 20, date: "2025-03-30", description: "Clothing Store", category: "Shopping", amount: 210, type: "expense" },
  { id: 21, date: "2025-02-01", description: "Salary Deposit", category: "Income", amount: 5800, type: "income" },
  { id: 22, date: "2025-02-03", description: "Apartment Rent", category: "Housing", amount: 1400, type: "expense" },
  { id: 23, date: "2025-02-07", description: "Grocery Store", category: "Groceries", amount: 112.6, type: "expense" },
  { id: 24, date: "2025-02-10", description: "Restaurant", category: "Dining", amount: 61.4, type: "expense" },
  { id: 25, date: "2025-02-14", description: "Valentine Gift", category: "Shopping", amount: 95, type: "expense" },
  { id: 26, date: "2025-02-18", description: "Freelance Work", category: "Income", amount: 900, type: "income" },
  { id: 27, date: "2025-02-21", description: "Electricity", category: "Utilities", amount: 76.5, type: "expense" },
  { id: 28, date: "2025-02-24", description: "Gas", category: "Transport", amount: 48.9, type: "expense" },
  { id: 29, date: "2025-02-27", description: "Coffee Subscription", category: "Subscriptions", amount: 24.99, type: "expense" },
  { id: 30, date: "2025-02-28", description: "Book Purchase", category: "Education", amount: 37.5, type: "expense" },
];

const CATEGORY_COLORS = {
  Income: "#f0c040",
  Housing: "#6c8ebf",
  Groceries: "#82b366",
  Subscriptions: "#d6b656",
  Utilities: "#a0a0c8",
  Dining: "#e07070",
  Health: "#70c0a0",
  Shopping: "#c080c0",
  Transport: "#80c0d0",
  Education: "#d09060",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
const fmtShort = (n) =>
  Math.abs(n) >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.abs(n).toFixed(0)}`;

function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080e1a;
    --surface: #0d1525;
    --surface2: #111d32;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(240,192,64,0.2);
    --gold: #f0c040;
    --gold2: #ffd97a;
    --gold-dim: rgba(240,192,64,0.12);
    --text: #e8eaf2;
    --text2: #7a86a0;
    --text3: #4a566a;
    --green: #4ecb8a;
    --red: #f05060;
    --blue: #5090f0;
    --radius: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.5);
  }

  body { background: var(--bg); color: var(--text); }

  .app {
    font-family: 'JetBrains Mono', monospace;
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(240,192,64,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(80,144,240,0.04) 0%, transparent 60%);
  }

  /* ── TOP NAV ── */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(8,14,26,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
    display: flex; align-items: center; gap: 24px;
    height: 60px;
  }
  .nav-brand {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
    color: var(--gold);
    flex: 1;
    display: flex; align-items: center; gap: 8px;
  }
  .nav-brand-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 8px var(--gold);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100%{opacity:1;transform:scale(1)}
    50%{opacity:.5;transform:scale(.8)}
  }
  .nav-tabs {
    display: flex; gap: 4px;
  }
  .nav-tab {
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 12px; font-weight: 500; letter-spacing: 0.5px;
    cursor: pointer; transition: all 0.2s;
    border: none; background: transparent;
    color: var(--text2);
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
  }
  .nav-tab:hover { color: var(--text); background: var(--surface2); }
  .nav-tab.active { color: var(--gold); background: var(--gold-dim); }
  
  .role-badge {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 12px 4px 6px;
    font-size: 11px; color: var(--text2);
    font-family: 'JetBrains Mono', monospace;
  }
  .role-select {
    background: transparent; border: none;
    color: var(--gold); font-size: 11px; font-weight: 600;
    cursor: pointer; outline: none;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
  }
  .role-select option { background: #111d32; color: var(--text); }
  .role-dot {
    width: 6px; height: 6px; border-radius: 50%;
  }
  .role-dot.admin { background: var(--gold); box-shadow: 0 0 6px var(--gold); }
  .role-dot.viewer { background: var(--blue); box-shadow: 0 0 6px var(--blue); }

  /* ── LAYOUT ── */
  .page {
    max-width: 1300px; margin: 0 auto;
    padding: 28px 24px;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  /* ── CARDS GRID ── */
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  @media(max-width:700px){ .summary-grid{grid-template-columns:1fr;} }

  .summary-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px 24px;
    position: relative; overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
  }
  .summary-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.12); }
  .summary-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--accent);
  }
  .card-label {
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--text2); margin-bottom: 10px; font-weight: 600;
  }
  .card-value {
    font-size: 28px; font-weight: 600; letter-spacing: -1px;
    font-family: 'Syne', sans-serif;
    color: var(--text);
  }
  .card-sub {
    font-size: 11px; color: var(--text2); margin-top: 6px;
  }
  .card-icon {
    position: absolute; right: 18px; top: 18px;
    font-size: 22px; opacity: 0.15;
  }

  /* ── CHARTS GRID ── */
  .charts-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  @media(max-width:900px){ .charts-grid{grid-template-columns:1fr;} }

  .chart-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px 24px;
  }
  .chart-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 0.3px;
    color: var(--text2); text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 20px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .chart-badge {
    font-size: 10px; padding: 3px 8px;
    border-radius: 20px; background: var(--gold-dim);
    color: var(--gold); font-family: 'JetBrains Mono', monospace;
  }

  /* ── BAR CHART ── */
  .bar-chart {
    display: flex; align-items: flex-end; gap: 8px;
    height: 140px;
  }
  .bar-group {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .bar-wrap {
    width: 100%; display: flex; gap: 2px; align-items: flex-end; height: 110px;
  }
  .bar-seg {
    flex: 1; border-radius: 3px 3px 0 0;
    transition: opacity 0.2s;
    cursor: default;
    position: relative;
  }
  .bar-seg:hover { opacity: 0.8; }
  .bar-label {
    font-size: 9px; color: var(--text3); letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* ── DONUT ── */
  .donut-wrap {
    display: flex; align-items: center; gap: 20px;
    flex-wrap: wrap;
  }
  .donut-svg { flex-shrink: 0; }
  .donut-legend {
    display: flex; flex-direction: column; gap: 8px;
    flex: 1; min-width: 120px;
  }
  .legend-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; color: var(--text2);
  }
  .legend-dot {
    width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0;
  }
  .legend-pct {
    margin-left: auto; color: var(--text); font-weight: 600;
  }

  /* ── SECTION HEADER ── */
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap; gap: 12px;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 800; letter-spacing: -0.3px;
  }
  .section-controls {
    display: flex; gap: 8px; flex-wrap: wrap;
  }

  /* ── INPUTS ── */
  .input, .select-inp {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 12px; font-family: 'JetBrains Mono', monospace;
    padding: 7px 12px;
    outline: none;
    transition: border-color 0.2s;
  }
  .input:focus, .select-inp:focus { border-color: var(--gold); }
  .select-inp option { background: #111d32; }

  /* ── BUTTON ── */
  .btn {
    padding: 7px 16px; border-radius: 8px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
    cursor: pointer; border: none; transition: all 0.15s;
    font-family: 'JetBrains Mono', monospace; text-transform: uppercase;
  }
  .btn-primary {
    background: var(--gold); color: #080e1a;
  }
  .btn-primary:hover { background: var(--gold2); transform: translateY(-1px); }
  .btn-ghost {
    background: transparent; color: var(--text2);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }
  .btn-danger {
    background: transparent; color: var(--red);
    border: 1px solid rgba(240,80,96,0.2);
    padding: 4px 10px; font-size: 11px;
  }
  .btn-danger:hover { background: rgba(240,80,96,0.1); }
  .btn-edit {
    background: transparent; color: var(--blue);
    border: 1px solid rgba(80,144,240,0.2);
    padding: 4px 10px; font-size: 11px;
  }
  .btn-edit:hover { background: rgba(80,144,240,0.1); }

  /* ── TABLE ── */
  .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: var(--surface2); }
  th {
    padding: 12px 16px;
    font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;
    color: var(--text2); font-weight: 600; text-align: left;
    border-bottom: 1px solid var(--border);
    cursor: pointer; user-select: none;
    white-space: nowrap;
  }
  th:hover { color: var(--text); }
  th .sort-icon { margin-left: 4px; opacity: 0.5; }
  th.sorted { color: var(--gold); }
  th.sorted .sort-icon { opacity: 1; }

  td {
    padding: 12px 16px;
    font-size: 12px; color: var(--text);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface2); }

  .amount-cell { font-weight: 600; }
  .amount-income { color: var(--green); }
  .amount-expense { color: var(--red); }

  .type-pill {
    display: inline-block; padding: 2px 8px;
    border-radius: 4px; font-size: 10px;
    font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;
  }
  .pill-income { background: rgba(78,203,138,0.15); color: var(--green); }
  .pill-expense { background: rgba(240,80,96,0.15); color: var(--red); }

  .cat-pill {
    display: inline-block; padding: 2px 8px;
    border-radius: 4px; font-size: 10px; font-weight: 500;
  }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s;
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 28px;
    width: 100%; max-width: 460px;
    margin: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.7);
  }
  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 800; margin-bottom: 22px;
    color: var(--gold);
  }
  .form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    margin-bottom: 20px;
  }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-field.full { grid-column: 1/-1; }
  .form-label {
    font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
    color: var(--text2); font-weight: 600;
  }
  .form-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* ── INSIGHTS ── */
  .insights-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
    margin-bottom: 24px;
  }
  @media(max-width:700px){ .insights-grid{grid-template-columns:1fr;} }

  .insight-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 22px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .insight-header {
    display: flex; align-items: center; gap: 10px;
  }
  .insight-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .insight-label {
    font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
    color: var(--text2); font-weight: 600;
  }
  .insight-value {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
  }
  .insight-desc { font-size: 11px; color: var(--text2); line-height: 1.6; }

  /* ── PROGRESS BAR ── */
  .progress-list { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
  .progress-item { display: flex; flex-direction: column; gap: 4px; }
  .progress-meta { display: flex; justify-content: space-between; font-size: 11px; }
  .progress-label { color: var(--text2); }
  .progress-val { color: var(--text); font-weight: 600; }
  .progress-bar-bg {
    height: 4px; border-radius: 2px; background: var(--surface2);
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    padding: 60px 20px;
    text-align: center; color: var(--text3);
  }
  .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }
  .empty-text { font-size: 13px; }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 12px; color: var(--text);
    box-shadow: var(--shadow);
    z-index: 2000;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  /* ── PAGINATION ── */
  .pagination {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    font-size: 11px; color: var(--text2);
    flex-wrap: wrap; gap: 8px;
  }
  .page-btns { display: flex; gap: 4px; }
  .page-btn {
    width: 28px; height: 28px;
    border-radius: 6px; border: 1px solid var(--border);
    background: transparent; color: var(--text2);
    font-size: 11px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    font-family: 'JetBrains Mono', monospace;
  }
  .page-btn:hover { border-color: var(--gold); color: var(--gold); }
  .page-btn.active { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }
  .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }
`;

// ─── Inject CSS ───────────────────────────────────────────────────────────────
if (!document.getElementById("fin-styles")) {
  const styleEl = document.createElement("style");
  styleEl.id = "fin-styles";
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ data, size = 130 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 12;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="empty-state"><div className="empty-icon">🍩</div></div>;

  let cumulative = 0;
  const slices = data.map((d) => {
    const start = cumulative;
    cumulative += d.value / total;
    return { ...d, start, end: cumulative };
  });

  function arcPath(startPct, endPct) {
    const startAngle = startPct * 2 * Math.PI - Math.PI / 2;
    const endAngle = endPct * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} className="donut-svg">
        <circle cx={cx} cy={cy} r={r} fill="var(--surface2)" />
        {slices.map((s, i) => (
          <path key={i} d={arcPath(s.start, s.end)} fill={s.color} opacity={0.9}>
            <title>{s.label}: {fmt(s.value)}</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={r * 0.62} fill="var(--surface)" />
      </svg>
      <div className="donut-legend">
        {slices.slice(0, 6).map((s, i) => (
          <div className="legend-item" key={i}>
            <div className="legend-dot" style={{ background: s.color }} />
            <span style={{ fontSize: 10 }}>{s.label}</span>
            <span className="legend-pct">{((s.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar Chart (Monthly) ──────────────────────────────────────────────────────
function MonthlyBarChart({ transactions }) {
  const byMonth = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      if (t.type === "income") map[key].income += t.amount;
      else map[key].expense += t.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, vals]) => ({
        label: MONTHS[parseInt(key.split("-")[1]) - 1],
        ...vals,
      }));
  }, [transactions]);

  const maxVal = Math.max(...byMonth.flatMap((m) => [m.income, m.expense]), 1);

  return (
    <div className="bar-chart">
      {byMonth.map((m, i) => (
        <div className="bar-group" key={i}>
          <div className="bar-wrap">
            <div
              className="bar-seg"
              style={{
                height: `${(m.income / maxVal) * 100}%`,
                background: "linear-gradient(to top, #3da86a, #4ecb8a)",
              }}
              title={`Income: ${fmt(m.income)}`}
            />
            <div
              className="bar-seg"
              style={{
                height: `${(m.expense / maxVal) * 100}%`,
                background: "linear-gradient(to top, #c03040, #f05060)",
              }}
              title={`Expense: ${fmt(m.expense)}`}
            />
          </div>
          <div className="bar-label">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Transaction Modal ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  description: "", category: "Groceries", amount: "",
  type: "expense", date: new Date().toISOString().split("T")[0],
};

function TransactionModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isEdit = !!initial;

  function handleSubmit() {
    if (!form.description || !form.amount || isNaN(Number(form.amount))) return;
    onSave({ ...form, amount: Math.abs(Number(form.amount)) });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{isEdit ? "✏️ Edit Transaction" : "＋ New Transaction"}</div>
        <div className="form-grid">
          <div className="form-field full">
            <label className="form-label">Description</label>
            <input className="input" value={form.description} onChange={set("description")} placeholder="e.g. Grocery Run" />
          </div>
          <div className="form-field">
            <label className="form-label">Amount ($)</label>
            <input className="input" type="number" value={form.amount} onChange={set("amount")} placeholder="0.00" min="0" step="0.01" />
          </div>
          <div className="form-field">
            <label className="form-label">Type</label>
            <select className="select-inp" value={form.type} onChange={set("type")}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Category</label>
            <select className="select-inp" value={form.category} onChange={set("category")}>
              {Object.keys(CATEGORY_COLORS).filter(c => c !== "Income").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Date</label>
            <input className="input" type="date" value={form.date} onChange={set("date")} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{isEdit ? "Save Changes" : "Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return <div className="toast">✓ {msg}</div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [transactions, setTransactions] = useState(SEED_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [toast, setToast] = useState(null);
  const PER_PAGE = 8;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // ── Derived stats ──
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // ── Category spending ──
  const catSpend = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || "#888" }));
  }, [transactions]);

  // ── Filtered + sorted transactions ──
  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (filterCat !== "all") list = list.filter(t => t.category === filterCat);
    list.sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (sortBy === "amount") { av = Number(av); bv = Number(bv); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [transactions, search, filterType, filterCat, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSort(col) {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
    setPage(1);
  }

  function handleSave(form) {
    if (editTx) {
      setTransactions(ts => ts.map(t => t.id === editTx.id ? { ...t, ...form } : t));
      showToast("Transaction updated");
    } else {
      setTransactions(ts => [{ ...form, id: Date.now() }, ...ts]);
      showToast("Transaction added");
    }
    setEditTx(null);
  }

  function handleDelete(id) {
    setTransactions(ts => ts.filter(t => t.id !== id));
    showToast("Transaction deleted");
  }

  // ── Insights ──
  const insights = useMemo(() => {
    const topCat = catSpend[0];
    const byMonth = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      const k = getMonthKey(t.date);
      byMonth[k] = (byMonth[k] || 0) + t.amount;
    });
    const months = Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a));
    const latestSpend = months[0]?.[1] || 0;
    const prevSpend = months[1]?.[1] || 0;
    const delta = prevSpend > 0 ? ((latestSpend - prevSpend) / prevSpend * 100) : 0;
    const savingsRate = stats.income > 0 ? ((stats.income - stats.expense) / stats.income * 100) : 0;
    const avgTx = transactions.length > 0 ? stats.expense / transactions.filter(t => t.type === "expense").length : 0;
    return { topCat, delta, savingsRate, avgTx };
  }, [catSpend, transactions, stats]);

  const allCategories = useMemo(() => {
    return [...new Set(transactions.map(t => t.category))];
  }, [transactions]);

  const isAdmin = role === "admin";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-brand-dot" />
          FinLens
        </div>
        <div className="nav-tabs">
          {["dashboard", "transactions", "insights"].map(t => (
            <button
              key={t}
              className={`nav-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >{t}</button>
          ))}
        </div>
        <div className="role-badge">
          <div className={`role-dot ${role}`} />
          <span style={{ color: "var(--text3)" }}>Role:</span>
          <select className="role-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </nav>

      {/* ── DASHBOARD ────────────────────────────────────────────────────────── */}
      {tab === "dashboard" && (
        <div className="page">
          {/* Summary Cards */}
          <div className="summary-grid">
            {[
              { label: "Net Balance", value: stats.balance, accent: "#f0c040", icon: "◈", fmt: fmt },
              { label: "Total Income", value: stats.income, accent: "#4ecb8a", icon: "↑", fmt: fmt },
              { label: "Total Expenses", value: stats.expense, accent: "#f05060", icon: "↓", fmt: fmt },
            ].map((card) => (
              <div
                key={card.label}
                className="summary-card"
                style={{ "--accent": card.accent }}
              >
                <div className="card-icon">{card.icon}</div>
                <div className="card-label">{card.label}</div>
                <div className="card-value" style={{ color: card.accent }}>
                  {card.fmt(card.value)}
                </div>
                <div className="card-sub">{transactions.length} transactions total</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-title">
                Monthly Overview
                <span className="chart-badge">Last 6 months</span>
              </div>
              <MonthlyBarChart transactions={transactions} />
              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                {[["#4ecb8a", "Income"], ["#f05060", "Expenses"]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--text2)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-title">
                Spending by Category
              </div>
              <DonutChart
                data={catSpend.slice(0, 7)}
                size={130}
              />
            </div>
          </div>

          {/* Top 5 spending by category */}
          <div className="chart-card">
            <div className="chart-title" style={{ marginBottom: 16 }}>
              Category Breakdown
              <span className="chart-badge">{catSpend.length} categories</span>
            </div>
            <div className="progress-list">
              {catSpend.slice(0, 5).map((c) => (
                <div className="progress-item" key={c.label}>
                  <div className="progress-meta">
                    <span className="progress-label">{c.label}</span>
                    <span className="progress-val">{fmt(c.value)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${(c.value / catSpend[0].value) * 100}%`,
                        background: c.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TRANSACTIONS ─────────────────────────────────────────────────────── */}
      {tab === "transactions" && (
        <div className="page">
          <div className="section-header">
            <div className="section-title">Transactions</div>
            <div className="section-controls">
              <input
                className="input"
                placeholder="Search..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ width: 160 }}
              />
              <select className="select-inp" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select className="select-inp" value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }}>
                <option value="all">All Categories</option>
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {isAdmin && (
                <button className="btn btn-primary" onClick={() => { setEditTx(null); setShowModal(true); }}>
                  + Add
                </button>
              )}
            </div>
          </div>

          <div className="table-wrap">
            <div className="table-scroll">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <div className="empty-text">No transactions match your filters</div>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      {[
                        ["date", "Date"],
                        ["description", "Description"],
                        ["category", "Category"],
                        ["type", "Type"],
                        ["amount", "Amount"],
                      ].map(([col, label]) => (
                        <th
                          key={col}
                          className={sortBy === col ? "sorted" : ""}
                          onClick={() => handleSort(col)}
                        >
                          {label}
                          <span className="sort-icon">
                            {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "⇅"}
                          </span>
                        </th>
                      ))}
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((t) => (
                      <tr key={t.id}>
                        <td style={{ color: "var(--text2)" }}>{t.date}</td>
                        <td>{t.description}</td>
                        <td>
                          <span
                            className="cat-pill"
                            style={{
                              background: (CATEGORY_COLORS[t.category] || "#888") + "22",
                              color: CATEGORY_COLORS[t.category] || "#888",
                            }}
                          >
                            {t.category}
                          </span>
                        </td>
                        <td>
                          <span className={`type-pill ${t.type === "income" ? "pill-income" : "pill-expense"}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`amount-cell ${t.type === "income" ? "amount-income" : "amount-expense"}`}>
                          {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                        </td>
                        {isAdmin && (
                          <td style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-edit" onClick={() => { setEditTx(t); setShowModal(true); }}>Edit</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>Del</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {filtered.length > 0 && (
              <div className="pagination">
                <span>{filtered.length} results · Page {page} of {totalPages}</span>
                <div className="page-btns">
                  <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={i} style={{ padding: "0 4px", color: "var(--text3)" }}>…</span>
                      ) : (
                        <button
                          key={p}
                          className={`page-btn ${page === p ? "active" : ""}`}
                          onClick={() => setPage(p)}
                        >{p}</button>
                      )
                    )}
                  <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── INSIGHTS ─────────────────────────────────────────────────────────── */}
      {tab === "insights" && (
        <div className="page">
          <div className="section-header" style={{ marginBottom: 20 }}>
            <div className="section-title">Financial Insights</div>
          </div>

          <div className="insights-grid">
            {/* Top Spending Category */}
            <div className="insight-card">
              <div className="insight-header">
                <div className="insight-icon" style={{ background: "rgba(240,80,96,0.12)" }}>🏆</div>
                <div className="insight-label">Highest Spend Category</div>
              </div>
              <div className="insight-value" style={{ color: CATEGORY_COLORS[insights.topCat?.label] || "var(--text)" }}>
                {insights.topCat?.label || "—"}
              </div>
              <div className="insight-desc">
                Total spent: <strong style={{ color: "var(--text)" }}>{fmt(insights.topCat?.value || 0)}</strong>.
                This is your largest expense category — consider reviewing if this aligns with your budget.
              </div>
            </div>

            {/* Savings Rate */}
            <div className="insight-card">
              <div className="insight-header">
                <div className="insight-icon" style={{ background: "rgba(78,203,138,0.12)" }}>💰</div>
                <div className="insight-label">Savings Rate</div>
              </div>
              <div className="insight-value" style={{ color: insights.savingsRate > 20 ? "var(--green)" : "var(--gold)" }}>
                {insights.savingsRate.toFixed(1)}%
              </div>
              <div className="insight-desc">
                {insights.savingsRate >= 20
                  ? "Great job! You're saving more than 20% of your income."
                  : "You're saving less than 20% of income. Consider cutting expenses to improve your rate."}
              </div>
            </div>

            {/* Month-over-month */}
            <div className="insight-card">
              <div className="insight-header">
                <div className="insight-icon" style={{ background: "rgba(80,144,240,0.12)" }}>📊</div>
                <div className="insight-label">Monthly Spend Trend</div>
              </div>
              <div className="insight-value" style={{ color: insights.delta > 0 ? "var(--red)" : "var(--green)" }}>
                {insights.delta > 0 ? "+" : ""}{insights.delta.toFixed(1)}%
              </div>
              <div className="insight-desc">
                Compared to the previous month, spending has{" "}
                <strong style={{ color: "var(--text)" }}>
                  {insights.delta > 0 ? "increased" : "decreased"}
                </strong>{" "}
                by {Math.abs(insights.delta).toFixed(1)}%.
                {insights.delta > 10 ? " This is a significant jump — review your recent purchases." : ""}
              </div>
            </div>

            {/* Avg transaction */}
            <div className="insight-card">
              <div className="insight-header">
                <div className="insight-icon" style={{ background: "rgba(240,192,64,0.12)" }}>⚡</div>
                <div className="insight-label">Avg. Expense Transaction</div>
              </div>
              <div className="insight-value" style={{ color: "var(--gold)" }}>
                {fmt(insights.avgTx)}
              </div>
              <div className="insight-desc">
                Your average expense transaction amount. Smaller, more frequent purchases can add up quickly — track daily spending habits.
              </div>
            </div>
          </div>

          {/* Category breakdown deep dive */}
          <div className="chart-card" style={{ marginBottom: 20 }}>
            <div className="chart-title">
              Full Spending Breakdown
              <span className="chart-badge">All time</span>
            </div>
            <div className="progress-list">
              {catSpend.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📉</div><div className="empty-text">No expense data</div></div>
              ) : catSpend.map((c) => (
                <div className="progress-item" key={c.label}>
                  <div className="progress-meta">
                    <span className="progress-label">{c.label}</span>
                    <span className="progress-val">{fmt(c.value)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${(c.value / catSpend[0].value) * 100}%`,
                        background: c.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income vs Expense chart */}
          <div className="chart-card">
            <div className="chart-title">Income vs Expenses — Monthly</div>
            <MonthlyBarChart transactions={transactions} />
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {[["#4ecb8a", "Income"], ["#f05060", "Expenses"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--text2)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <TransactionModal
          initial={editTx}
          onClose={() => { setShowModal(false); setEditTx(null); }}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} />}
    </div>
  );
}