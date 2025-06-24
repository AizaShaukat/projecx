import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import MSThesisList from "../components/MSThesisList";
import AddMSThesisForm from "../components/AddMSThesisForm";
import { useNavigate } from "react-router-dom";
import projecXLogo from "../assets/projecX.png";

export default function MSThesisManagement() {
  const [years] = useState([2023, 2024, 2025]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [theses, setTheses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingThesis, setEditingThesis] = useState(null);
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const exportRef = useRef();


  const fetchTheses = async (year) => {
    try {
      const res = await axios.get("http://localhost:80/api/ms_thesis.php", {
        params: { year },
      });
      setTheses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (selectedYear) fetchTheses(selectedYear);
  }, [selectedYear]);

  const handleEdit = (thesis) => {
    setEditingThesis(thesis);
    setShowAddForm(true);
  };
  const handleExportPDF = () => {
    if (!exportRef.current) return;
  
    const cloned = exportRef.current.cloneNode(true);
  
    const paddedContainer = document.createElement("div");
    paddedContainer.style.position = "relative";
    paddedContainer.style.paddingTop = "100px";
  
    const leftLogo = document.createElement("img");
    leftLogo.src = "/assets/itu.png";
    leftLogo.style.position = "absolute";
    leftLogo.style.top = "10px";
    leftLogo.style.left = "10px";
    leftLogo.style.width = "80px";
  
    const rightLogo = document.createElement("img");
    rightLogo.src = "/assets/projecX.png";
    rightLogo.style.position = "absolute";
    rightLogo.style.top = "10px";
    rightLogo.style.right = "10px";
    rightLogo.style.width = "80px";
  
    const footer = document.createElement("div");
    footer.style.marginTop = "30px";
    footer.style.textAlign = "center";
    footer.style.fontSize = "12px";
    footer.innerText = `Exported on ${new Date().toLocaleString()}`;
  
    cloned.style.transform = "scale(0.95)";
    cloned.style.transformOrigin = "top left";
  
    paddedContainer.appendChild(leftLogo);
    paddedContainer.appendChild(rightLogo);
    paddedContainer.appendChild(cloned);
    paddedContainer.appendChild(footer);
  
    const opt = {
      margin: 0.5,
      filename: `MS_Thesis_Report_${selectedYear}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
  
    html2pdf().set(opt).from(paddedContainer).save();
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this thesis?")) {
      try {
        await axios.delete(`http://localhost:80/api/ms_thesis.php/${id}`);
        alert("Thesis deleted!");
        fetchTheses(selectedYear);
      } catch (err) {
        alert("Failed to delete thesis.");
      }
    }
  };

  const handleSubmit = async (formDataObj) => {
    try {
      const url = editingThesis
        ? `http://localhost:80/api/ms_thesis.php/${editingThesis.id}`
        : "http://localhost:80/api/ms_thesis.php";

      let res;

      if (editingThesis) {
        const formData = new URLSearchParams();
        Object.entries(formDataObj).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });

        res = await axios.put(url, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      } else {
        const formData = new FormData();
        Object.entries(formDataObj).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value, value.name);
            } else {
              formData.append(key, value);
            }
          }
        });

        res = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("Backend response:", res.data);

      if (res.data.success) {
        alert(editingThesis ? "Thesis updated!" : "Thesis added!");
        setShowAddForm(false);
        setEditingThesis(null);
        fetchTheses(selectedYear);
      } else {
        alert(`Operation failed: ${res.data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Full error:", err);

      if (err.response) {
        alert(`Error: ${err.response.data.message || err.response.statusText}`);
        console.error("Response data:", err.response.data);
      } else if (err.request) {
        alert("No response from server. Check if backend is running.");
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Top bar with logo and Ask button */}
      <div className="flex justify-between items-center mb-6">
        <img
          src={projecXLogo}
          alt="projecX Logo"
          className="w-28 h-auto cursor-pointer"
          onClick={() => navigate("/")}
        />
        <button
          onClick={() => window.open("/ask", "_blank")}
          className="bg-[#bc1823] text-white px-4 py-2 rounded hover:bg-red-800 transition"
        >
          💡 Ask & Visualize
        </button>
      </div>

      <h2 className="text-3xl font-semibold mb-6 text-[#bc1823]">
        MS Thesis Management
      </h2>

      {/* Year Selection */}
      <div className="mb-6">
        <h3 className="text-xl mb-2">Select Year</h3>
        <div className="flex gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setShowAddForm(false);
                setEditingThesis(null);
              }}
              className={`px-4 py-2 rounded transition-all ${
                selectedYear === year
                  ? "bg-[#bc1823] text-white shadow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Thesis List or Add Button */}
      {selectedYear && !showAddForm && (
        <>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingThesis(null);
            }}
            className="mb-4 bg-[#bc1823] text-white px-4 py-2 rounded hover:bg-red-800 transition"
          >
            + Add Thesis
          </button>
          <div className="flex justify-between items-center mb-4">


  {theses.length > 0 && (
    <button
      onClick={handleExportPDF}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
    >
      📄 Export as PDF
    </button>
  )}
</div>

<div ref={exportRef}>
  <MSThesisList
    theses={theses}
    onEdit={handleEdit}
    onDelete={handleDelete}
    filterText={filterText}
    onFilterChange={setFilterText}
  />
</div>

        </>
      )}

      {/* Form for Add/Edit */}
      {showAddForm && (
        <AddMSThesisForm
          year={selectedYear}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowAddForm(false);
            setEditingThesis(null);
          }}
          initialData={editingThesis}
        />
      )}
    </div>
  );
}
