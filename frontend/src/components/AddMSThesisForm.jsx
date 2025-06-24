import React, { useState, useEffect } from "react";

export default function AddMSThesisForm({ year, onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState({
    student_name: "",
    reg_no: "",
    email: "",
    phone: "",
    program: "",
    thesis_title: "",
    research_area: "",
    thesis_type: "",
    supervisor_name: "",
    co_supervisor_name: "",
    proposal_status: "Incomplete",
    progress_status: "Incomplete",
    final_status: "Incomplete",
    proposal_remarks: "",
    progress_remarks: "",
    final_remarks: "",
    thesis1_status: "Not Started",
    thesis2_status: "Not Started",
    proposal_file: null,
    progress_file: null,
    final_thesis_file: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, year });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-[#bc1823] mb-2">{initialData ? "Edit MS Thesis" : "Add MS Thesis"}</h2>

      <div>
        <label className="block text-sm font-medium">Student Name</label>
        <input type="text" name="student_name" value={form.student_name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Registration Number</label>
        <input type="text" name="reg_no" value={form.reg_no} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Program</label>
        <select name="program" value={form.program} onChange={handleChange} required className="w-full border rounded px-3 py-2">
          <option value="">Select Program</option>
          <option>MS Electrical Engineering</option>
          <option>MS Software Engineering</option>
          <option>MS Computer Engineering</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Thesis Title</label>
        <input type="text" name="thesis_title" value={form.thesis_title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Research Area</label>
        <input type="text" name="research_area" value={form.research_area} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Thesis Type</label>
        <select name="thesis_type" value={form.thesis_type} onChange={handleChange} required className="w-full border rounded px-3 py-2">
          <option value="">Select Thesis Type</option>
          <option>Software Based</option>
          <option>Hardware Based</option>
          <option>Software & Hardware</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Supervisor Name</label>
        <input type="text" name="supervisor_name" value={form.supervisor_name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Co-Supervisor Name</label>
        <input type="text" name="co_supervisor_name" value={form.co_supervisor_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Proposal Status</label>
          <select name="proposal_status" value={form.proposal_status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option>Incomplete</option>
            <option>In Process</option>
            <option>Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Progress Status</label>
          <select name="progress_status" value={form.progress_status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option>Incomplete</option>
            <option>In Process</option>
            <option>Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Final Status</label>
          <select name="final_status" value={form.final_status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option>Incomplete</option>
            <option>In Process</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Proposal Remarks</label>
        <textarea name="proposal_remarks" value={form.proposal_remarks} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Progress Remarks</label>
        <textarea name="progress_remarks" value={form.progress_remarks} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Final Remarks</label>
        <textarea name="final_remarks" value={form.final_remarks} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Thesis I Status</label>
          <select name="thesis1_status" value={form.thesis1_status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Thesis II Status</label>
          <select name="thesis2_status" value={form.thesis2_status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Proposal File</label>
        <input type="file" name="proposal_file" onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Progress File</label>
        <input type="file" name="progress_file" onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Final Thesis File</label>
        <input type="file" name="final_thesis_file" onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="bg-[#bc1823] text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition">{initialData ? "Update" : "Add"}</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
}
