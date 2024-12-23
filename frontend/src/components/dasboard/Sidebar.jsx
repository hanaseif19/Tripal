import { sidebarItems } from "@/data/dashboard";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import { logout } from "@/api/UserService";

const handleLogout = async () => {
  const result = await logout();
  if (result.status === "success") {
    window.location.href = "/login";
  } else {
    message.error(result.message);
  }
};
export default function Sidebar({ setSideBarOpen }) {
  const { pathname } = useLocation();

  return (
    <div className="dashboard__sidebar js-dashboard-sidebar" style={{ height: '100vh', overflowY: 'auto' }}>
      <div className="dashboard__sidebar_header">
        <span
          onClick={() => setSideBarOpen(false)}
          className="text-white closeSidebar"
        >
          &times;
        </span>
        <Link to={"/"}>
          <img src="/img/general/logo.svg" alt="Logo" width="200" height="40" />
        </Link>
      </div>

      <div className="sidebar -dashboard">
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar__item ${pathname === item.href ? "-is-active" : ""}`}
          >
            <Link to={item.href}
             onClick={(e) => {
              if (item.label === "Logout") {
                e.preventDefault(); 
                handleLogout(); 
              }
            }}>
              {item.icon}
              <span className="ml-10">{item.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}