import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BSFYPManagement from "./pages/BSFYPManagement";
import MSThesisManagement from "./pages/MSThesisManagement";
import LLMQueryPage from "./pages/LLMQueryPage";
import VisualizationPage from "./pages/VisualizationPage";
import AskPage from "./pages/AskPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bs-fyp" element={<BSFYPManagement />} />
        <Route path="/ms-thesis" element={<MSThesisManagement />} />
        <Route path="/llm-query" element={<LLMQueryPage />} />
        <Route path="/visualization" element={<VisualizationPage />} />
        <Route path="/ask" element={<AskPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
