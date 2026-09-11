import { Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import Assets from "./pages/Assets"
import Devices from "./pages/Devices"
import Helpdesk from "./pages/Helpdesk"

import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import AuthLayout from "./layouts/AuthLayout"
import Settings from "./pages/Settings"
import StockOpname from "./pages/StockOpname"
import StockHistory from "./pages/StockHistory"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="assets/devices" element={<Devices title="Perangkat (Devices)" />} />
        <Route path="assets/inventory" element={<Assets title="Aset (General)" />} />
        <Route path="assets/atk" element={<StockOpname />} />
        <Route path="assets/atk/history" element={<StockHistory />} />
        <Route path="assets" element={<Assets />} /> {/* Fallback or redirect could be better, keeping for safety */}
        <Route path="helpdesk" element={<Helpdesk />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
