
import { useState } from "react";
import axios from "axios";
import {
  Upload, BrainCircuit, Database, BarChart3,
  MessageCircle, Download, FileSpreadsheet,
  Activity, RefreshCw, TrendingUp, Layers,
  AlertCircle, CheckCircle2
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from "recharts";

const API = "http://127.0.0.1:8000";

const COLORS = [
  "#8B5CF6", "#06B6D4", "#F59E0B", "#EC4899",
  "#10B981", "#F97316", "#3B82F6", "#EF4444",
  "#A3E635", "#D946EF"
];

const numberFormat = value =>
  Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2
  });

export default function App() {
  const [data, setData] = useState(null);
  const [chart, setChart] = useState(null);
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [type, setType] = useState("bar");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState("");

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setData(null);
    setChart(null);
    setAnswer("");

    const form = new FormData();
    form.append("file", file);

    try {
      const response = await axios.post(`${API}/upload`, form);
      const result = response.data;

      setData(result);

      const numeric = result.summary.numeric_columns || [];
      const categorical = result.summary.categorical_columns || [];

      if (numeric.length > 0) setY(numeric[0]);

      if (categorical.length > 0) {
        setX(categorical[0]);
      } else if (numeric.length > 1) {
        setX(numeric[1]);
      } else {
        setX("");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Dataset upload failed. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  async function createChart() {
    if (!x || !y) {
      setError("Please select valid X-axis and Y-axis columns.");
      return;
    }

    setChartLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/chart`, {
        x_column: x,
        y_column: y,
        chart_type: type
      });

      setChart(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to generate chart."
      );
    } finally {
      setChartLoading(false);
    }
  }

  async function ask(event) {
    event.preventDefault();

    if (!question.trim()) return;

    setAnswer("Analyzing your question...");

    try {
      const response = await axios.post(`${API}/ask`, {
        question
      });
      setAnswer(response.data.answer);
    } catch (err) {
      setAnswer(
        err.response?.data?.detail || "Unable to answer this question."
      );
    }
  }

  function download() {
    window.open(`${API}/download`, "_blank");
  }

  function resetDataset() {
    setData(null);
    setChart(null);
    setQuestion("");
    setAnswer("");
    setError("");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <BrainCircuit size={27} />
          </div>
          <div>
            <h2>FlowPilot AI</h2>
            <small>Intelligent Analytics</small>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <div className="nav active">
          <BarChart3 size={19} /> Dashboard
        </div>
        <div className="nav">
          <Database size={19} /> Data Explorer
        </div>
        <div className="nav">
          <MessageCircle size={19} /> AI Assistant
        </div>

        <div className="sidebar-bottom">
          <div className="online-indicator" />
          <span>Analytics Engine Online</span>
          <small>Local processing · No paid API</small>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <div className="eyebrow">DATA INTELLIGENCE PLATFORM</div>
            <h1>Analytics Dashboard</h1>
            <p>Turn your raw data into meaningful insights.</p>
          </div>

          <label className="primary-button upload-button">
            <Upload size={18} />
            Upload Dataset
            <input
              hidden
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={upload}
            />
          </label>
        </header>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <RefreshCw className="spin" size={20} />
            Processing your dataset...
          </div>
        )}

        {!data && !loading && (
          <section className="welcome">
            <div className="welcome-icon">
              <FileSpreadsheet size={43} />
            </div>
            <h2>Welcome to FlowPilot Analytics</h2>
            <p>
              Upload your CSV or Excel dataset to explore your data,
              discover patterns, and generate beautiful visualizations.
            </p>
            <label className="primary-button">
              <Upload size={18} />
              Select Dataset
              <input
                hidden
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={upload}
              />
            </label>
            <div className="supported-files">
              Supported formats: CSV, XLSX, XLS
            </div>
          </section>
        )}

        {data && (
          <>
            <section className="dataset-bar">
              <div className="dataset-name">
                <FileSpreadsheet size={21} />
                <div>
                  <strong>{data.filename}</strong>
                  <small>Dataset successfully loaded</small>
                </div>
              </div>

              <div className="dataset-actions">
                <button className="secondary-button" onClick={download}>
                  <Download size={16} /> Export CSV
                </button>
                <button className="secondary-button" onClick={resetDataset}>
                  <RefreshCw size={16} /> New Dataset
                </button>
              </div>
            </section>

            <section className="metrics">
              <Metric
                icon={<Database />}
                label="Total Records"
                value={data.summary.rows}
                color="purple"
              />
              <Metric
                icon={<Layers />}
                label="Total Columns"
                value={data.summary.columns}
                color="blue"
              />
              <Metric
                icon={<AlertCircle />}
                label="Missing Values"
                value={data.summary.missing_values}
                color="orange"
              />
              <Metric
                icon={<CheckCircle2 />}
                label="Duplicate Rows"
                value={data.summary.duplicates}
                color="green"
              />
            </section>

            <section className="panel">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">AUTOMATED ANALYSIS</div>
                  <h2><BrainCircuit /> Data Insights</h2>
                  <p>Important observations from your uploaded dataset.</p>
                </div>
              </div>

              <div className="insights-grid">
                {data.insights.map((item, i) => (
                  <div className="insight-card" key={i}>
                    <span className="insight-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel visualization-panel">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">EXPLORE YOUR DATA</div>
                  <h2><BarChart3 /> Visualization Studio</h2>
                  <p>Choose your columns and create interactive charts.</p>
                </div>
              </div>

              <div className="chart-controls">
                <label>
                  X Axis / Category
                  <select value={x} onChange={e => setX(e.target.value)}>
                    {(data.summary.column_names || []).map(column => (
                      <option key={column} value={column}>{column}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Y Axis / Value
                  <select value={y} onChange={e => setY(e.target.value)}>
                    {(data.summary.numeric_columns || []).map(column => (
                      <option key={column} value={column}>{column}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Visualization Type
                  <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="scatter">Scatter Plot</option>
                  </select>
                </label>

                <button
                  className="primary-button generate-button"
                  onClick={createChart}
                  disabled={chartLoading || !x || !y}
                >
                  {chartLoading ? (
                    <><RefreshCw className="spin" size={17} /> Generating</>
                  ) : (
                    <><BarChart3 size={17} /> Generate Chart</>
                  )}
                </button>
              </div>

              {chart && (
                <ChartView
                  chart={chart}
                  xColumn={x}
                  yColumn={y}
                />
              )}

              {!chart && (
                <div className="chart-placeholder">
                  <BarChart3 size={42} />
                  <h3>Your visualization will appear here</h3>
                  <p>Select your columns and click Generate Chart.</p>
                </div>
              )}
            </section>

            <section className="panel">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">DATA EXPLORER</div>
                  <h2><Database /> Dataset Preview</h2>
                  <p>Preview the first 10 records in your dataset.</p>
                </div>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      {data.summary.column_names.map(column => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.preview.map((row, i) => (
                      <tr key={i}>
                        {data.summary.column_names.map(column => (
                          <td key={column}>
                            {String(row[column] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel assistant-panel">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">ASK YOUR DATA</div>
                  <h2><MessageCircle /> Data Assistant</h2>
                  <p>Ask questions about your dataset.</p>
                </div>
              </div>

              <form className="question-form" onSubmit={ask}>
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Example: What is the average sales?"
                />
                <button className="primary-button" type="submit">
                  Ask Question
                </button>
              </form>

              {answer && <div className="answer-box">{answer}</div>}

              <div className="question-examples">
                Try: "What is the total sales?", "What is the average sales?",
                or "Which value is highest?"
              </div>

              <p className="disclaimer">
                This version uses Python-based analytics and predefined
                natural-language question matching. It does not yet use an LLM.
              </p>
            </section>
          </>
        )}

        <footer className="footer">
          FlowPilot AI · Intelligent Data Analytics Platform
          <span>Free local analytics engine</span>
        </footer>
      </main>
    </div>
  );
}

function Metric({ icon, label, value, color }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${color}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{numberFormat(value)}</strong>
      </div>
    </div>
  );
}

function ChartView({ chart, xColumn, yColumn }) {
  const values = chart.values.map(v => Number(v) || 0);

  const chartData = chart.labels.map((label, index) => ({
    name: String(label),
    value: values[index] ?? 0
  }));

  const total = values.reduce((sum, value) => sum + value, 0);

  const tooltipStyle = {
    backgroundColor: "#20243a",
    border: "1px solid #414664",
    borderRadius: "10px",
    color: "#fff"
  };

  return (
    <div className="chart-result">
      <div className="chart-title-row">
        <div>
          <h3>{chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart</h3>
          <p>{yColumn} by {xColumn}</p>
        </div>
        <div className="chart-total">
          <span>Total</span>
          <strong>{numberFormat(total)}</strong>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={360}>
          {chart.type === "pie" ? (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={125}
                innerRadius={65}
                paddingAngle={3}
                cornerRadius={5}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(1)}%`
                }
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#171a29"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => numberFormat(value)}
              />
              <Legend
                verticalAlign="bottom"
                formatter={value => (
                  <span style={{ color: "#d5d7e8" }}>{value}</span>
                )}
              />
            </PieChart>
          ) : chart.type === "bar" ? (
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#34384f" />
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={75}
                tick={{ fill: "#b7bad0", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "#b7bad0", fontSize: 11 }}
                tickFormatter={numberFormat}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={value => numberFormat(value)}
              />
              <Legend />
              <Bar
                dataKey="value"
                name={yColumn}
                fill="#8B5CF6"
                radius={[7, 7, 0, 0]}
                maxBarSize={55}
                label={{ position: "top", fill: "#e7e5f5", fontSize: 11, formatter: numberFormat }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : chart.type === "line" ? (
            <LineChart data={chartData} margin={{ top: 20, right: 25, left: 10, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#34384f" />
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={75}
                tick={{ fill: "#b7bad0", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "#b7bad0", fontSize: 11 }}
                tickFormatter={numberFormat}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={value => numberFormat(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={yColumn}
                stroke="#06B6D4"
                strokeWidth={4}
                dot={{ fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          ) : chart.type === "area" ? (
            <AreaChart data={chartData} margin={{ top: 20, right: 25, left: 10, bottom: 45 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#34384f" />
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={75}
                tick={{ fill: "#b7bad0", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "#b7bad0", fontSize: 11 }}
                tickFormatter={numberFormat}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={value => numberFormat(value)}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                name={yColumn}
                stroke="#A78BFA"
                strokeWidth={3}
                fill="url(#areaGradient)"
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          ) : (
            <ScatterChart margin={{ top: 20, right: 25, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#34384f" />
              <XAxis
                type="category"
                dataKey="name"
                name={xColumn}
                tick={{ fill: "#b7bad0", fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="value"
                name={yColumn}
                tick={{ fill: "#b7bad0", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={tooltipStyle}
              />
              <Legend />
              <Scatter
                name={`${yColumn} vs ${xColumn}`}
                data={chartData}
                fill="#EC4899"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="chart-explanation">
        <TrendingUp size={17} />
        <span>
          Showing {chartData.length} data points.
          {chart.type === "pie"
            ? " Each segment represents its share of the total."
            : chart.type === "scatter"
              ? " Each point represents one category and its numeric value."
              : " Hover over the chart to inspect individual values."}
        </span>
      </div>
    </div>
  );
}
