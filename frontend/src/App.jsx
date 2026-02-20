// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import CustomerLayout from "./layout/CustomerLayout";
import AdminLayout from "./layout/AdminLayout";
import LoginPage from "./pages/LoginPage";
import "./index.css";
import CreateTicketPage from "./components/CreateTicketPage";
import MyTickets from "./components/MyTickets";
import TicketDetailPage from "./pages/TicketDetailPage";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />

      {/* Admin / Agent Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "agent"]}>
            <AdminLayout>
              <div>Admin / Agent Dashboard Content</div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Customer Dashboard */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLayout>
              <div>Customer Dashboard Content</div>
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* Tickets */}
      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin", "agent"]}>
            <CustomerLayout>
              <CreateTicketPage />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin", "agent"]}>
            <CustomerLayout>
              <MyTickets />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* Ticket Details using URL param */}
      <Route
        path="/tickets/details/:id"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLayout>
              <TicketDetailPage />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;