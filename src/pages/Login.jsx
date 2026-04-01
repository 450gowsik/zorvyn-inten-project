import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C, Label, Input, Select } from "../components/UI";
import { Shield, Eye, LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ name: "", email: "", role: "viewer" });
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, skip login page
  if (user) return <Navigate to="/dashboard" replace />;

  const isInvalid = !form.name.trim() || !form.email.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvalid) {
      setError("Please enter required fields");
      return;
    }
    setError("");
    login(form);
    navigate("/");
  };

  return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: C.bg, fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        width: 400, padding: 40, background: C.surface, borderRadius: 16,
        border: `1px solid ${C.border}`, boxShadow: "0 24px 80px rgba(0,0,0,0.4)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: C.gold }}>FinTrack</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Finance Dashboard Submission</div>
        </div>

        <form onSubmit={handleSubmit}>
          <Label>Full Name</Label>
          <Input 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            placeholder="Enter your name" 
            style={{ 
              borderColor: error && !form.name ? C.red : C.border,
              marginBottom: 14 
            }}
          />

          <Label>Email Address</Label>
          <Input 
            type="email" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            placeholder="name@company.com" 
            style={{ 
              borderColor: error && !form.email ? C.red : C.border,
              marginBottom: 14 
            }}
          />

          <Label>Access Role</Label>
          <Select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="viewer">Viewer — Read Only</option>
            <option value="admin">Admin — Full Access</option>
          </Select>

          {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 16, textAlign: "center" }}>{error}</div>}

          <button 
            type="submit" 
            disabled={isInvalid}
            style={{
              width: "100%", padding: "12px", 
              background: isInvalid ? C.surface2 : C.gold, 
              border: "none",
              borderRadius: 8, 
              color: isInvalid ? C.muted : "#1a1200", 
              fontSize: 14, fontWeight: 700,
              cursor: isInvalid ? "not-allowed" : "pointer", 
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s"
            }}
          >
            <LogIn size={16} /> Access Dashboard
          </button>
        </form>

        <div style={{ marginTop: 24, padding: "12px", background: C.surface2, borderRadius: 8, fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 10 }}>
          <Shield size={14} color={C.gold} />
          <span>Role-based access control simulated with localStorage.</span>
        </div>
      </div>
    </div>
  );
}
