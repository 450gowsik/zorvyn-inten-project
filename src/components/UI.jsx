import { 
  Shield, Eye, Check, ChevronDown, LayoutDashboard, CreditCard, TrendingUp 
} from "lucide-react";

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
export const C = {
  bg:        "#07090f",
  surface:   "#0d1120",
  surface2:  "#131927",
  surface3:  "#192035",
  border:    "#1c2338",
  gold:      "#e8b84b",
  goldDim:   "rgba(232,184,75,0.13)",
  green:     "#34d399",
  greenDim:  "rgba(52,211,153,0.10)",
  red:       "#fb7185",
  redDim:    "rgba(251,113,133,0.10)",
  blue:      "#818cf8",
  text:      "#e4e8f5",
  dim:       "#8090b0",
  muted:     "#4a5570",
};

export const CAT_COLOR = {
  Food:"#f59e0b", Transport:"#3b82f6", Shopping:"#a78bfa",
  Entertainment:"#ec4899", Health:"#34d399", Utilities:"#64748b",
  Salary:"#e8b84b", Freelance:"#60a5fa", Investment:"#10b981", Other:"#94a3b8",
};

/* ─── SHARED UI COMPONENTS ────────────────────────────────────────────────── */
export function Badge({ cat }) {
  const color = CAT_COLOR[cat] || "#94a3b8";
  return (
    <span style={{display:"inline-flex",alignItems:"center",padding:"2px 10px",borderRadius:20,
      fontSize:11,fontWeight:500,background:color+"22",color,border:`1px solid ${color}33`}}>
      {cat}
    </span>
  );
}

export function TypePill({ type }) {
  const income = type === "income";
  return (
    <span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:20,
      fontSize:11,fontWeight:500,
      background: income ? C.greenDim : C.redDim,
      color: income ? C.green : C.red}}>
      {type}
    </span>
  );
}

export function Label({ children }) {
  return <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{children}</div>;
}

export function Input({ ...props }) {
  return (
    <input {...props} style={{width:"100%",padding:"10px 12px",
      background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,
      color:C.text,fontSize:13,outline:"none",
      boxSizing:"border-box",marginBottom:14,display:"block"}}/>
  );
}

export function Select({ children, ...props }) {
  return (
    <select {...props} style={{width:"100%",padding:"10px 12px",
      background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,
      color:C.text,fontSize:13,outline:"none",display:"block",
      marginBottom:14,boxSizing:"border-box"}}>
      {children}
    </select>
  );
}
