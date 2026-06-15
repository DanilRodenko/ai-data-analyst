// Render markdown into an element via marked.js.
function renderMarkdown(el, text) {
  el.classList.add("md");
  el.innerHTML = marked.parse(text || "");
}

// Orchestrates rendering of a full analysis result into the main panel.
function render(query, data) {
  const results = dom.results;
  results.innerHTML = "";
  dom.subtitle.textContent = `Results for “${query}”`;

  const stats = data.statistics || {};
  renderMetrics(stats);

  // Final synthesized answer (synthesizer appends an AIMessage)
  const messages = data.messages || [];
  const finalMsg = messages.length ? messages[messages.length - 1] : null;
  const synthesis = finalMsg ? (finalMsg.content || finalMsg.text) : null;

  renderCharts(data.charts || []);

  if (synthesis) {
    const block = document.createElement("div");
    block.className = "panel-block";
    const details = document.createElement("details");
    details.className = "summary-details";
    const summary = document.createElement("summary");
    summary.textContent = "Summary";
    const body = document.createElement("div");
    body.className = "synthesis";
    renderMarkdown(body, synthesis);
    details.appendChild(summary);
    details.appendChild(body);
    block.appendChild(details);
    results.appendChild(block);
  }

  renderInsights(data.insights || []);

  if (!results.children.length) {
    results.innerHTML =
      '<div class="empty-state"><div>No results returned.</div></div>';
  }
}

function metricCard(label, value, cls = "") {
  return `<div class="card"><div class="label">${label}</div>
    <div class="value ${cls}">${value}</div></div>`;
}

function renderMetrics(stats) {
  if (!stats || Object.keys(stats).length === 0) return;
  const pct = (v) => (v == null ? "—" : `${Number(v).toFixed(1)}%`);
  const num = (v) => (v == null ? "—" : Number(v).toLocaleString());

  const cards = [
    metricCard("Rows", num(stats.row_count)),
    metricCard("Columns", num(stats.column_count)),
    metricCard("Missing", pct(stats.missing_percentage),
      stats.missing_percentage > 0 ? "warn" : "accent"),
    metricCard("Duplicates", num(stats.duplicated_count),
      stats.duplicated_count > 0 ? "warn" : "accent"),
  ].join("");

  const wrap = document.createElement("div");
  wrap.className = "metrics";
  wrap.innerHTML = cards;
  dom.results.appendChild(wrap);
}

function renderInsights(insights) {
  if (!insights.length) return;
  const block = document.createElement("div");
  block.className = "panel-block";
  block.innerHTML = `<h3>Insights</h3>`;
  insights.forEach((text) => {
    const el = document.createElement("div");
    el.className = "insight";
    renderMarkdown(el, typeof text === "string" ? text : JSON.stringify(text));
    block.appendChild(el);
  });
  dom.results.appendChild(block);
}

function renderCharts(charts) {
  if (!charts.length) return;
  const block = document.createElement("div");
  block.className = "panel-block";
  block.innerHTML = `<h3>Charts</h3>`;
  dom.results.appendChild(block);

  charts.forEach((chart, i) => {
    let fig;
    try {
      fig = typeof chart === "string" ? JSON.parse(chart) : chart;
    } catch (e) {
      console.error("Bad chart JSON", e);
      return;
    }
    const div = document.createElement("div");
    div.className = "chart";
    div.id = `chart-${i}`;
    block.appendChild(div);

    const layout = Object.assign(
      {
        autosize: true,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "#e6e9ef" },
        margin: { t: 50, r: 20, b: 50, l: 50 },
      },
      fig.layout || {}
    );
    Plotly.newPlot(div, fig.data || [], layout, {
      responsive: true,
      displayModeBar: false,
    });
  });
}
