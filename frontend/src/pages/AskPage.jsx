import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import html2pdf from "html2pdf.js";

ChartJS.register(BarElement, ArcElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AskPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [graphType, setGraphType] = useState("bar");
  const [canVisualize, setCanVisualize] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");
    setChartData(null);
    setCanVisualize(false);
    setShowChart(false);

    try {
      const { data } = await axios.post("http://localhost:80/api/query.php", { question: query });
      if (data.answer) {
        setResponse(styleHTML(marked.parse(data.answer)));
        if (data.chartData?.labels && data.chartData?.datasets) {
          setChartData(data.chartData);
          setCanVisualize(true);
        }
      } else {
        setResponse("<p>No answer provided.</p>");
      }
    } catch (e) {
      setResponse(`<p style="color:red">Error: ${e.message}</p>`);
    } finally {
      setLoading(false);
    }
  };

  const styleHTML = html => {
    const div = document.createElement("div");
    div.innerHTML = html;
  
    // Style headers
    div.querySelectorAll("h1,h2,h3").forEach(h => {
      h.style.color = "#bc1823";
      h.style.margin = "1em 0 0.5em";
    });
  
    // Style paragraphs
    div.querySelectorAll("p").forEach(p => (p.style.margin = "0.8em 0"));
  
    // Style tables
    div.querySelectorAll("table").forEach(table => {
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.querySelectorAll("th,td").forEach(cell => {
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "6px";
      });
      table.style.marginBottom = "1em";
    });
  
    // Add a line and alternating color to each new project/thesis title
    let colorToggle = false;
    div.querySelectorAll("p").forEach(p => {
      const text = p.textContent.toLowerCase();
      if (text.startsWith("project title") || text.startsWith("thesis title")) {
        const hr = document.createElement("hr");
        hr.style.border = "none";
        hr.style.borderTop = "2px dashed #ccc";
        hr.style.margin = "30px 0 20px";
        p.style.fontWeight = "bold";
        p.style.fontSize = "1.1em";
        p.style.color = colorToggle ? "#bc1823" : "#000"; // Alternate color
        colorToggle = !colorToggle;
        p.parentNode.insertBefore(hr, p);
      }
    });
  
    return div.innerHTML;
  };
  
  

  const renderChart = () => {
    if (!chartData) return null;
    const props = {
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map(ds => ({
          ...ds,
          backgroundColor: ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#0ea5e9"],
          borderColor: "#1e40af",
        })),
      },
      options: { responsive: true, maintainAspectRatio: false },
    };
    return (
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: 800, height: 350 }}>
          {graphType === "pie" ? <Pie {...props} /> : graphType === "line" ? <Line {...props} /> : <Bar {...props} />}
        </div>
      </div>
    );
  };

  const exportPDF = () => {
    const doc = document.createElement("div");
    doc.style.padding = "20px";
    doc.style.position = "relative";
    doc.style.fontFamily = "Arial, sans-serif";
  
    const leftImg = Object.assign(document.createElement("img"), {
      src: "/assets/itu.png",
      style: "position:absolute;top:20px;left:20px;width:100px"
    });
    const rightImg = Object.assign(document.createElement("img"), {
      src: "/assets/projecX.png",
      style: "position:absolute;top:20px;right:20px;width:100px"
    });
    doc.append(leftImg, rightImg);
  
    doc.append(Object.assign(document.createElement("h1"), {
      textContent: "FYP Report Summary",
      style: "text-align:center;color:#bc1823;margin:140px 0 30px;font-size:24px"
    }));
  
    const textDiv = document.createElement("div");
    textDiv.innerHTML = response;
    doc.append(textDiv);
  
    if (showChart) {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        // Force new page before adding chart
        const pageBreak = document.createElement("div");
        pageBreak.style.pageBreakBefore = "always";
        doc.append(pageBreak);
  
        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png", 1);
        img.style.width = "100%";
        img.style.margin = "30px 0";
        doc.append(img);
      }
    }
  
    doc.append(Object.assign(document.createElement("div"), {
      textContent: `Exported on: ${new Date().toLocaleString()}`,
      style: "text-align:right;font-size:10pt;margin-top:20px;color:#555"
    }));
  
    html2pdf()
      .set({
        margin: [10, 10],
        filename: `FYP_Report_${new Date().toISOString().split("T")[0]}.pdf`,
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(doc)
      .save();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-[#bc1823] mb-6">Ask and Visualize</h2>
      <textarea
        className="w-full p-4 border rounded mb-4 h-40"
        value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Enter your question..."
      />
      <button
        onClick={handleAsk}
        className="bg-[#bc1823] text-white px-6 py-2 rounded mr-4"
        disabled={loading}
      >
        {loading ? "Asking..." : "Ask"}
      </button>

      {response && (
        <div className="mt-6 bg-white rounded shadow p-6">
          <div dangerouslySetInnerHTML={{ __html: response }} className="prose max-w-none" />
          {canVisualize && !showChart && (
            <button onClick={() => setShowChart(true)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              Visualize
            </button>
          )}
          {showChart && (
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <label className="mr-2">Graph type:</label>
                <select value={graphType} onChange={e => setGraphType(e.target.value)} className="p-2 border rounded">
                  <option value="bar">Bar</option>
                  <option value="pie">Pie</option>
                  <option value="line">Line</option>
                </select>
              </div>
              {renderChart()}
            </div>
          )}
          <button onClick={exportPDF} className="mt-6 bg-[#bc1823] text-white px-4 py-2 rounded">
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
