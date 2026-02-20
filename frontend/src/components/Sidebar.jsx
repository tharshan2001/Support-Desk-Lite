import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, Menu, X, Ticket, Shield } from "lucide-react";
import { useAuthStore } from "../context/authStore";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout, isStaff } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/tickets", icon: LayoutDashboard, label: "Tickets", end: true },
    { to: "/tickets/new", icon: Plus, label: "New Ticket" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-[200] bg-white border border-[#e2e6ec] rounded-[10px] p-2 shadow-[0_4px_12px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] text-[#1a1d23]"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[90]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-[95] h-screen bg-white border-r border-[#e2e6ec]
          flex flex-col transition-all duration-200
          ${collapsed ? "w-[72px]" : "w-[250px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 pt-[22px] pb-[18px] border-b border-[#f1f3f6]">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-[#e6f5ea] flex items-center justify-center">
            <Ticket size={24} color="#189435" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-lg text-[#1a1d23]">
              Support<span className="text-[#ffcc26]">Desk</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 p-2.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#fff4cc] text-[#1a1d23] font-semibold border-l-[3px] border-[#ffcc26]"
                    : "text-[#5a6178] hover:bg-[#f1f3f6] hover:text-[#1a1d23]"
                }`
              }
            >
              <item.icon size={19} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-3.5 border-t border-[#f1f3f6]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-[#189435] text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-[#1a1d23] truncate capitalize">
                  {user?.name}
                </span>
                <span className="text-xs text-[#8c91a0] flex items-center gap-1 capitalize">
                  {isStaff && <Shield size={11} />}
                  {user?.role}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-[10px] text-sm font-medium text-[#8c91a0] hover:bg-[#fee2e2] hover:text-[#e53e3e]"
          >
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
