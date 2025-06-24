import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function MSThesisList({ theses, onEdit, onDelete, filterText, onFilterChange }) {
  const filteredTheses = theses.filter((t) =>
    t.student_name.toLowerCase().includes(filterText.toLowerCase()) ||
    t.reg_no.toLowerCase().includes(filterText.toLowerCase()) ||
    t.thesis_title.toLowerCase().includes(filterText.toLowerCase()) ||
    t.supervisor_name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (!theses.length)
    return <p className="text-gray-500 mt-4">No theses found for selected year.</p>;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-[#bc1823]">MS Thesis Projects</h3>
        <input
          type="text"
          placeholder="Search by student, reg no, supervisor..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bc1823] w-80"
        />
      </div>

      {filteredTheses.length === 0 ? (
        <p className="text-gray-500">No thesis matches your search.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-[900px] w-full text-sm bg-white">
            <thead className="sticky top-0 bg-[#bc1823] text-white text-left z-10">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Reg No</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Thesis Title</th>
                <th className="px-4 py-3">Supervisor</th>
                <th className="px-4 py-3">Proposal</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Final</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTheses.map((thesis) => (
                <tr key={thesis.id} className="hover:bg-red-50 transition-colors border-b">
                  <td className="px-4 py-3">{thesis.student_name}</td>
                  <td className="px-4 py-3">{thesis.reg_no}</td>
                  <td className="px-4 py-3">{thesis.program}</td>
                  <td className="px-4 py-3">{thesis.thesis_title}</td>
                  <td className="px-4 py-3">{thesis.supervisor_name}</td>
                  <td className="px-4 py-3">
                    <StatusTag status={thesis.proposal_status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusTag status={thesis.progress_status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusTag status={thesis.final_status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onEdit(thesis)}
                      className="text-[#bc1823] hover:text-red-800 mr-3"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(thesis.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 💡 Status label with color
function StatusTag({ status }) {
  const base = "px-2 py-1 text-xs rounded-full font-medium";
  const color =
    status === "Completed"
      ? "bg-green-100 text-green-700"
      : status === "In Process"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-gray-700";

  return <span className={`${base} ${color}`}>{status || "N/A"}</span>;
}
