import React, { useState, useEffect } from "react";

export default function AddGroupForm({ year, onAddGroup, onCancel, initialData }) {
  const [group, setGroup] = useState({
    project_title: "",
    tech_stack: "",
    supervisor: "",
    advisor: "",
    co_advisor: "",
    defense_doc: "Incomplete",
    mid_doc: "Incomplete",
    final_doc: "Incomplete",
    proposal_remarks: "",
    mid_remarks: "",
    final_remarks: "",
    proposal_file: null,
    mid_file: null,
    final_file: null,
    bs_program: "",
    project_type: "",
  });

  const [members, setMembers] = useState([{ name: "", reg_no: "", phone: "", email: "" }]);

  useEffect(() => {
    if (initialData) {
      setGroup((prev) => ({
        ...prev,
        project_title: initialData.project_title || "",
        tech_stack: initialData.tech_stack || "",
        supervisor: initialData.supervisor || "",
        advisor: initialData.advisor || "",
        co_advisor: initialData.co_advisor || "",
        defense_doc: initialData.defense_doc || "Incomplete",
        mid_doc: initialData.mid_doc || "Incomplete",
        final_doc: initialData.final_doc || "Incomplete",
        proposal_remarks: initialData.proposal_remarks || "",
        mid_remarks: initialData.mid_remarks || "",
        final_remarks: initialData.final_remarks || "",
        proposal_file: null,
        mid_file: null,
        final_file: null,
        bs_program: initialData.bs_program || "",
        project_type: initialData.project_type || "",
      }));
      setMembers(initialData.members && initialData.members.length > 0 ? initialData.members : [{ name: "", reg_no: "", phone: "", email: "" }]);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroup((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const addMember = () =>
    setMembers([...members, { name: "", reg_no: "", phone: "", email: "" }]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setGroup((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddGroup({ ...group, year, members });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-2xl shadow-xl max-w-4xl mx-auto mt-6 border border-gray-200"
    >
      <h2 className="text-3xl font-bold text-[#bc1823] mb-2">Add BS Project Group</h2>

      {/* Project Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="project_title"
          value={group.project_title}
          onChange={handleChange}
          placeholder="Project Title"
          required
          className="border p-3 rounded-md w-full focus:ring-2 focus:ring-[#bc1823]"
        />
        <input
          name="tech_stack"
          value={group.tech_stack}
          onChange={handleChange}
          placeholder="Tech Stack"
          required
          className="border p-3 rounded-md w-full focus:ring-2 focus:ring-[#bc1823]"
        />
        <input
          name="supervisor"
          value={group.supervisor}
          onChange={handleChange}
          placeholder="Supervisor"
          required
          className="border p-3 rounded-md w-full"
        />
        <input
          name="advisor"
          value={group.advisor}
          onChange={handleChange}
          placeholder="Advisor"
          required
          className="border p-3 rounded-md w-full"
        />
        <input
          name="co_advisor"
          value={group.co_advisor}
          onChange={handleChange}
          placeholder="Co-Advisor"
          required
          className="border p-3 rounded-md w-full"
        />
        <select
          name="bs_program"
          value={group.bs_program}
          onChange={handleChange}
          required
          className="border p-3 rounded-md w-full bg-white"
        >
          <option value="">Select BS Program</option>
          <option>Computer Engineering</option>
          <option>Software Engineering</option>
          <option>Electrical Engineering</option>
        </select>
        <select
          name="project_type"
          value={group.project_type}
          onChange={handleChange}
          required
          className="border p-3 rounded-md w-full bg-white"
        >
          <option value="">Select Project Type</option>
          <option>Software</option>
          <option>Hardware</option>
          <option>Both</option>
        </select>
      </div>

      {/* Document Status */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Document Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["defense_doc", "mid_doc", "final_doc"].map((doc) => (
            <select
              key={doc}
              name={doc}
              value={group[doc]}
              onChange={handleChange}
              required
              className="border p-3 rounded-md w-full bg-white"
            >
              <option>Incomplete</option>
              <option>In Process</option>
              <option>Completed</option>
            </select>
          ))}
        </div>
      </div>

      {/* Members Section */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Group Members</h3>
        {members.map((m, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
            <input
              value={m.name}
              onChange={(e) => handleMemberChange(i, "name", e.target.value)}
              placeholder="Name"
              required
              className="border p-2 rounded-md"
            />
            <input
              value={m.reg_no}
              onChange={(e) => handleMemberChange(i, "reg_no", e.target.value)}
              placeholder="Reg No"
              required
              className="border p-2 rounded-md"
            />
            <input
              value={m.phone}
              onChange={(e) => handleMemberChange(i, "phone", e.target.value)}
              placeholder="Phone"
              required
              className="border p-2 rounded-md"
            />
            <input
              type="email"
              value={m.email}
              onChange={(e) => handleMemberChange(i, "email", e.target.value)}
              placeholder="Email"
              required
              className="border p-2 rounded-md"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addMember}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-md text-sm text-gray-700 border border-gray-300 transition"
        >
          + Add Member
        </button>
      </div>

      {/* File Uploads */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Document Uploads</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="file" name="proposal_file" onChange={handleFileChange} className="border p-2 rounded-md" />
          <input type="file" name="mid_file" onChange={handleFileChange} className="border p-2 rounded-md" />
          <input type="file" name="final_file" onChange={handleFileChange} className="border p-2 rounded-md" />
        </div>
      </div>

      {/* Remarks */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Remarks (Optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <textarea
            name="proposal_remarks"
            value={group.proposal_remarks}
            onChange={handleChange}
            placeholder="Proposal Remarks"
            className="border p-2 rounded-md resize-none h-24"
          />
          <textarea
            name="mid_remarks"
            value={group.mid_remarks}
            onChange={handleChange}
            placeholder="Mid Evaluation Remarks"
            className="border p-2 rounded-md resize-none h-24"
          />
          <textarea
            name="final_remarks"
            value={group.final_remarks}
            onChange={handleChange}
            placeholder="Final Evaluation Remarks"
            className="border p-2 rounded-md resize-none h-24"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          className="bg-[#bc1823] text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition"
        >
          Save Group
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
