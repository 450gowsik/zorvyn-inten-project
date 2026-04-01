import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { 
  Shield, Eye, Check, ChevronDown, LayoutDashboard, CreditCard, TrendingUp,
  ArrowUpRight, ArrowDownRight, Wallet, LogOut, User 
} from "lucide-react";
import { C } from "./UI";
import { useAuth } from "../context/AuthContext";

export function Sidebar({ page }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const nav = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard, path: "/" },
    { id: "transactions", label: "Transactions", Icon: CreditCard, path: "/transactions" },
    { id: "insights", label: "Insights", Icon: TrendingUp, path: "/insights" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: 220, height: "100vh",
      background: C.surface, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", zIndex: 100
    }}>
      <div style={{ padding: "28px 24px 24px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 700, color: C.gold, letterSpacing: 1 }}>FinTrack</div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 3, letterSpacing: 2, textTransform: "uppercase" }}>Finance Dashboard</div>
      </div>

      <nav style={{ flex: 1, padding: "20px 12px" }}>
        {nav.map(({ id, label, Icon, path }) => (
          <NavLink key={id} to={path} style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 12, width: "100%",
            padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: isActive ? C.goldDim : "transparent",
            color: isActive ? C.gold : C.dim,
            fontSize: 13, fontWeight: isActive ? 600 : 400,
            textDecoration: "none",
            borderLeft: isActive ? `2px solid ${C.gold}` : "2px solid transparent",
            marginBottom: 4, transition: "all 0.15s", textAlign: "left",
          })}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: `1px solid ${C.border}` }}>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: 12, width: "100%",
          padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
          background: "transparent", color: C.red, fontSize: 13, fontWeight: 500,
          textAlign: "left", transition: "all 0.15s"
        }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>

      <div style={{ padding: "16px 24px", fontSize: 11, color: C.muted }}>© 2026 FinTrack</div>
    </div>
  );
}

export function Header() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
      <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>
        {user.role === "admin" 
          ? <span style={{ color: C.gold }}>⬡ Admin Access — Full Permissions</span>
          : <span>⬡ Viewer Access — Read Only</span>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{user.name}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{user.email}</div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: user.role === "admin" ? `linear-gradient(135deg,${C.gold},#b88a20)` : C.surface2,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${user.role === "admin" ? C.gold : C.border}`
        }}>
          {user.role === "admin" ? <Shield size={18} color="#1a1200" /> : <User size={18} color={C.dim} />}
        </div>
      </div>
    </div>
  );
}

export function PageTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 24, animation: "fadeIn 0.5s ease-out" }}>
      <h1 style={{ fontFamily: "Georgia,serif", fontSize: 30, fontWeight: 700, color: C.text, margin: 0, letterSpacing: -0.5 }}>{title}</h1>
      {sub && <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 13 }}>{sub}</p>}
    </div>
  );
}

export function SCard({ title, value, sub, trend, color, Icon }) {
  const up = trend >= 0;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -24, right: -24, width: 88, height: 88, borderRadius: "50%", background: color + "18" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{title}</div>
          <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>{sub}</div>}
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      {trend !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12, fontSize: 12 }}>
          {up ? <ArrowUpRight size={12} color={C.green} /> : <ArrowDownRight size={12} color={C.red} />}
          <span style={{ color: up ? C.green : C.red }}>{Math.abs(trend)}%</span>
          <span style={{ color: C.muted }}>vs last month</span>
        </div>
      )}
    </div>
  );
}
