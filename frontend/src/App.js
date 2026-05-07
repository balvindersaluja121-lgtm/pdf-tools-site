import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ToolPage from "./pages/ToolPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/:toolId" element={<ToolPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
