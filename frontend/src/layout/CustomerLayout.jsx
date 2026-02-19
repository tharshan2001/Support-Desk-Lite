// src/layouts/CustomerLayout.jsx
import Sidebar from "../components/Sidebar";

const CustomerLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-h-screen p-4 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
