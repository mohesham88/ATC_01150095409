import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AdminApp } from "./admin/App";
import "./i18n";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
          {/* Add other routes here */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
