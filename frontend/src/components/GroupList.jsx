import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function GroupList({ groups, onEdit, onDelete, filterText, onFilterChange }) {
  const filteredGroups = groups.filter(group =>
    group.project_title.toLowerCase().includes(filterText.toLowerCase()) ||
    group.tech_stack.toLowerCase().includes(filterText.toLowerCase()) ||
    group.supervisor?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-[#bc1823]">BS Project Groups</h3>

        <input
          type="text"
          placeholder="Search by title, tech stack, supervisor..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bc1823] w-80"
        />
      </div>

      {filteredGroups.length === 0 ? (
        <p className="text-gray-600">No groups match your search.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-[1200px] w-full text-sm bg-white">
            <thead className="sticky top-0 bg-[#bc1823] text-white text-left z-10">
              <tr>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3">Tech Stack</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Supervisor</th>
                <th className="px-4 py-3">Advisor</th>
                <th className="px-4 py-3">Co-Advisor</th>
                <th className="px-4 py-3">Defense</th>
                <th className="px-4 py-3">Mid</th>
                <th className="px-4 py-3">Final</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">BS Program</th>
                <th className="px-4 py-3">Project Type</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => (
                <tr
                  key={group.id}
                  className="hover:bg-red-50 transition-colors border-b"
                >
                  <td className="px-4 py-3 font-medium">{group.project_title}</td>
                  <td className="px-4 py-3">{group.tech_stack}</td>
                  <td className="px-4 py-3">{group.year}</td>
                  <td className="px-4 py-3">{group.supervisor}</td>
                  <td className="px-4 py-3">{group.advisor}</td>
                  <td className="px-4 py-3">{group.co_advisor}</td>
                  <td className="px-4 py-3"><StatusTag status={group.defense_doc} /></td>
                  <td className="px-4 py-3"><StatusTag status={group.mid_doc} /></td>
                  <td className="px-4 py-3"><StatusTag status={group.final_doc} /></td>
                  <td className="px-4 py-3 space-y-1 text-xs leading-5">
                    <div><span className="font-semibold text-gray-700">Proposal:</span> {group.proposal_remarks || "—"}</div>
                    <div><span className="font-semibold text-gray-700">Mid:</span> {group.mid_remarks || "—"}</div>
                    <div><span className="font-semibold text-gray-700">Final:</span> {group.final_remarks || "—"}</div>
                  </td>
                  <td className="px-4 py-3">{group.bs_program}</td>
                  <td className="px-4 py-3">{group.project_type}</td>
                  <td className="px-4 py-3">
                    {group.members?.length ? (
                      <ul className="list-disc ml-5 space-y-1">
                        {group.members.map((m, idx) => (
                          <li key={idx}><span className="font-medium">{m.name}</span> ({m.reg_no})</li>
                        ))}
                      </ul>
                    ) : "No members"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => onEdit(group)} className="text-[#bc1823] hover:text-red-800 mr-3" title="Edit">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => onDelete(group.id)} className="text-red-600 hover:text-red-800" title="Delete">
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

// ✅ Reusable colored tag for status
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
