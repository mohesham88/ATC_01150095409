import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider";
// import { AdminApp } from "./admin/App";
import "./i18n";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import EventDetailsPage from "./pages/EventDetailsPage";
import AdminJSApp from "./admin/AdminJSApp";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/admin/*" element={<AdminApp />} /> */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/event/:id" element={<EventDetailsPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminJSApp />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Add other routes here */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
