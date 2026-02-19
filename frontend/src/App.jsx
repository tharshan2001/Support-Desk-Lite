import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import Unauthorized from "./pages/Unauthorized";
import CustomerDashboard from "./components/CustomerDashboard";
import Sidebar from "./components/Sidebar";
import "./index.css";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Customer routes */}
      <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
        <Route
          path="/customer"
          element={
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-4 bg-gray-50">
                <CustomerDashboard />
              </main>
            </div>
          }
        />
      </Route>

      {/* Agent routes */}
      <Route element={<PrivateRoute allowedRoles={["agent"]} />}>
        {/* Add agent routes here */}
      </Route>

      {/* Admin routes */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        {/* Add admin routes here */}
      </Route>
    </Routes>
  );
}

export default App;
