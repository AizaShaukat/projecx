import React from "react";
import { useNavigate } from "react-router-dom";
import projecXLogo from "../assets/projecX.png"; // Update path if needed

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      {/* Logo only */}
      <div className="relative flex flex-col justify-center items-center w-full h-64 mb-8">
  <img src={projecXLogo} alt="projecX Logo" className="w-90 h-20 opacity-90" />
  <p className="text-gray-500 text-sm mt-2">
    FYP & Thesis Management System
  </p>
</div>


      {/* Main Buttons */}
      <div className="flex flex-col md:flex-row gap-8">
        <button
          onClick={() => navigate("/bs-fyp")}
          className="bg-[#bc1823] text-white px-10 py-6 rounded-2xl shadow-lg border-2 border-[#bc1823] transition duration-300 hover:bg-white hover:text-[#bc1823]"
        >
          BS FYP Management
        </button>
        <button
          onClick={() => navigate("/ms-thesis")}
          className="bg-[#bc1823] text-white px-10 py-6 rounded-2xl shadow-lg border-2 border-[#bc1823] transition duration-300 hover:bg-white hover:text-[#bc1823]"
        >
          MS Thesis Management
        </button>
      </div>
    </div>
  );
}
