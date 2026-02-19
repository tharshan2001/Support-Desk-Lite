// src/layouts/AdminLayout.jsx
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-h-screen p-4 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
