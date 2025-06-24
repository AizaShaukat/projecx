import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import GroupList from "../components/GroupList";
import AddGroupForm from "../components/AddGroupForm";
import { useNavigate } from "react-router-dom";
import projecXLogo from "../assets/projecX.png";
import html2pdf from "html2pdf.js";

export default function BSFYPManagement() {
  const [years] = useState([2023, 2024, 2025]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [groups, setGroups] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  const exportRef = useRef();

  const fetchGroups = async (year) => {
    try {
      const res = await axios.get("http://localhost:80/api/groups", {
        params: { year },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (selectedYear) fetchGroups(selectedYear);
  }, [selectedYear]);

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setShowAddGroup(true);
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await axios.delete(`http://localhost:80/api/groups/${id}`);
        alert("Group deleted!");
        fetchGroups(selectedYear);
      } catch (err) {
        alert("Failed to delete group.");
      }
    }
  };

  const handleAddGroup = async (groupData) => {
    try {
      const formData = new FormData();
      formData.append("project_title", groupData.project_title);
      formData.append("tech_stack", groupData.tech_stack);
      formData.append("year", groupData.year);
      formData.append("defense_doc", groupData.defense_doc);
      formData.append("mid_doc", groupData.mid_doc);
      formData.append("final_doc", groupData.final_doc);
      formData.append("supervisor", groupData.supervisor);
      formData.append("advisor", groupData.advisor);
      formData.append("co_advisor", groupData.co_advisor);
      formData.append("proposal_remarks", groupData.proposal_remarks);
      formData.append("mid_remarks", groupData.mid_remarks);
      formData.append("final_remarks", groupData.final_remarks);
      formData.append("bs_program", groupData.bs_program);
      formData.append("project_type", groupData.project_type);

      if (groupData.proposal_file instanceof File)
        formData.append("proposal_file", groupData.proposal_file);
      if (groupData.mid_file instanceof File)
        formData.append("mid_file", groupData.mid_file);
      if (groupData.final_file instanceof File)
        formData.append("final_file", groupData.final_file);

      formData.append("members", JSON.stringify(groupData.members));

      let res;
      if (editingGroup) {
        res = await axios.post(`http://localhost:80/api/groups/${editingGroup.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-HTTP-Method-Override": "PUT",
          },
        });
      } else {
        res = await axios.post("http://localhost:80/api/groups", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success === true) {
        alert(editingGroup ? "Group updated!" : "Group added!");
        setShowAddGroup(false);
        setEditingGroup(null);
        fetchGroups(selectedYear);
      } else {
        alert(editingGroup ? "Failed to update group." : "Failed to add group.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Submission failed. See console for details.");
    }
  };
  const handleExportPDF = () => {
    if (!exportRef.current) return;
  
    const cloned = exportRef.current.cloneNode(true);
  
    // Wrapper for padding space between logos and table
    const paddedContainer = document.createElement("div");
    paddedContainer.style.position = "relative";
    paddedContainer.style.paddingTop = "100px"; // Space for logos
  
    // Clone logos
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
  
    // Footer with timestamp
    const footer = document.createElement("div");
    footer.style.marginTop = "30px";
    footer.style.textAlign = "center";
    footer.style.fontSize = "12px";
    footer.innerText = `Exported on ${new Date().toLocaleString()}`;
  
    // Apply scaling to fit content
    cloned.style.transform = "scale(0.95)";
    cloned.style.transformOrigin = "top left";
  
    // Append everything in order
    paddedContainer.appendChild(leftLogo);
    paddedContainer.appendChild(rightLogo);
    paddedContainer.appendChild(cloned);
    paddedContainer.appendChild(footer);
  
    const opt = {
      margin: 0.5,
      filename: `BSFYP_Report_${selectedYear}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
  
    html2pdf().set(opt).from(paddedContainer).save();
  };
  

  return (
    <div className="min-h-screen p-6 bg-gray-50">
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
        BS FYP Management
      </h2>

      <div className="mb-6">
        <h3 className="text-xl mb-2">Select Year</h3>
        <div className="flex gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setShowAddGroup(false);
                setEditingGroup(null);
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

      <div className="flex justify-between items-center mb-4">
        {selectedYear && !showAddGroup && (
          <button
            onClick={() => {
              setShowAddGroup(true);
              setEditingGroup(null);
            }}
            className="bg-[#bc1823] text-white px-4 py-2 rounded hover:bg-red-800 transition"
          >
            + Add Group
          </button>
        )}

        {selectedYear && groups.length > 0 && (
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            📄 Export as PDF
          </button>
        )}
      </div>

      {/* PDF Export Container */}
      <div ref={exportRef}>
        {selectedYear && !showAddGroup && (
          <GroupList
            groups={groups}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
            filterText={filterText}
            onFilterChange={setFilterText}
          />
        )}
      </div>

      {showAddGroup && (
        <AddGroupForm
          year={selectedYear}
          onAddGroup={handleAddGroup}
          onCancel={() => {
            setShowAddGroup(false);
            setEditingGroup(null);
          }}
          initialData={editingGroup}
        />
      )}
    </div>
  );
}
