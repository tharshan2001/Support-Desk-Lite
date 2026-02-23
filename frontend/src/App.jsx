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
import AdminTicketListPage from "./pages/AdminTicketListPage";
import AdminTicketDetailPage from "./pages/AdminTicketDetailPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />

        {/* Admin / Agent Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              <AdminLayout>
                <AdminTicketListPage />
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
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout>
                <CreateTicketPage />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
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

        {/* Ticket Details using URL param */}
        <Route
          path="/tickets/detailed/:id"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <AdminLayout>
                <AdminTicketDetailPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
