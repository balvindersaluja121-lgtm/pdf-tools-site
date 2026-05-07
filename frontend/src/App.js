import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ToolPage from "./pages/ToolPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/pdf-to-word" element={<ToolPage toolId="pdf-to-word" />} />

        <Route path="/jpg-to-pdf" element={<ToolPage toolId="jpg-to-pdf" />} />

        <Route path="/pdf-to-jpg" element={<ToolPage toolId="pdf-to-jpg" />} />

        <Route path="/merge-pdf" element={<ToolPage toolId="merge-pdf" />} />

        <Route path="/split-pdf" element={<ToolPage toolId="split-pdf" />} />

        <Route path="/compress-pdf" element={<ToolPage toolId="compress-pdf" />} />

        <Route path="/protect-pdf" element={<ToolPage toolId="protect-pdf" />} />

        <Route path="/unlock-pdf" element={<ToolPage toolId="unlock-pdf" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
