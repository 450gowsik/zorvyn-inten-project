import { useState } from "react";
import { 
  Shield, Eye, Check, ChevronDown, LayoutDashboard, CreditCard, TrendingUp,
  ArrowUpRight, ArrowDownRight, Wallet 
} from "lucide-react";
import { C } from "./UI";

export function Sidebar({ page, setPage }) {
  const nav = [
    { id:"dashboard",    label:"Dashboard",    Icon:LayoutDashboard },
    { id:"transactions", label:"Transactions", Icon:CreditCard },
    { id:"insights",     label:"Insights",     Icon:TrendingUp },
  ];
  return (
    <div style={{position:"fixed",top:0,left:0,width:220,height:"100vh",
      background:C.surface,borderRight:`1px solid ${C.border}`,
      display:"flex",flexDirection:"column",zIndex:100}}>
      <div style={{padding:"28px 24px 24px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,
          color:C.gold,letterSpacing:1}}>FinTrack</div>
        <div style={{fontSize:10,color:C.muted,marginTop:3,letterSpacing:2,textTransform:"uppercase"}}>
          Finance Dashboard
        </div>
      </div>
      <nav style={{flex:1,padding:"20px 12px"}}>
        {nav.map(({ id, label, Icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => setPage(id)} style={{
              display:"flex",alignItems:"center",gap:12,width:"100%",
              padding:"10px 12px",borderRadius:8,border:"none",cursor:"pointer",
              background: active ? C.goldDim : "transparent",
              color: active ? C.gold : C.dim,
              fontSize:13,fontWeight: active ? 600 : 400,
              borderLeft: active ? `2px solid ${C.gold}` : "2px solid transparent",
              marginBottom:4,transition:"all 0.15s",textAlign:"left",
            }}>
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"16px 24px",borderTop:`1px solid ${C.border}`,fontSize:11,color:C.muted}}>
        © 2026 FinTrack
      </div>
    </div>
  );
}

export function Header({ role, setRole }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:36}}>
      <div style={{fontSize:12,color:C.muted,letterSpacing:1}}>
        {role === "admin"
          ? <span style={{color:C.gold}}>⬡ Admin Mode — full edit access</span>
          : <span>⬡ Viewer Mode — read only</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{position:"relative"}}>
          <button onClick={() => setOpen(o => !o)} style={{
            display:"flex",alignItems:"center",gap:8,padding:"8px 14px",
            background:C.surface2,border:`1px solid ${C.border}`,
            borderRadius:8,color:C.text,cursor:"pointer",fontSize:13,fontWeight:500,
          }}>
            {role === "admin" ? <Shield size={13} color={C.gold} /> : <Eye size={13} color={C.blue} />}
            {role === "admin" ? "Admin" : "Viewer"}
            <ChevronDown size={12} color={C.muted} />
          </button>
          {open && (
            <div style={{position:"absolute",right:0,top:"calc(100% + 4px)",zIndex:200,
              background:C.surface2,border:`1px solid ${C.border}`,
              borderRadius:8,overflow:"hidden",minWidth:140}}>
              {["viewer","admin"].map(r => (
                <button key={r} onClick={() => { setRole(r); setOpen(false); }} style={{
                  display:"flex",alignItems:"center",gap:8,width:"100%",
                  padding:"10px 16px",border:"none",cursor:"pointer",fontSize:13,
                  background: role === r ? C.goldDim : "transparent",
                  color: role === r ? C.gold : C.dim,
                }}>
                  {r === "admin" ? <Shield size={13}/> : <Eye size={13}/>}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                  {role === r && <Check size={11} style={{marginLeft:"auto"}}/>}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{width:34,height:34,borderRadius:"50%",
          background:`linear-gradient(135deg,${C.gold},#b88a20)`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:700,color:"#1a1200"}}>G</div>
      </div>
    </div>
  );
}

export function PageTitle({ title, sub }) {
  return (
    <div style={{marginBottom:24}}>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:700,
        color:C.text,margin:0,letterSpacing:-0.5}}>{title}</h1>
      {sub && <p style={{color:C.muted,margin:"4px 0 0",fontSize:13}}>{sub}</p>}
    </div>
  );
}

export function SCard({ title, value, sub, trend, color, Icon }) {
  const up = trend >= 0;
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,
      padding:"20px 22px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-24,right:-24,width:88,height:88,
        borderRadius:"50%",background:color+"18"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
            {title}
          </div>
          <div style={{fontFamily:"monospace",fontSize:22,fontWeight:700,color:C.text,letterSpacing:-0.5}}>
            {value}
          </div>
          {sub && <div style={{fontSize:11,color:C.muted,marginTop:5}}>{sub}</div>}
        </div>
        <div style={{width:38,height:38,borderRadius:10,
          background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Icon size={17} color={color}/>
        </div>
      </div>
      {trend !== undefined && (
        <div style={{display:"flex",alignItems:"center",gap:4,marginTop:12,fontSize:12}}>
          {up ? <ArrowUpRight size={12} color={C.green}/> : <ArrowDownRight size={12} color={C.red}/>}
          <span style={{color: up ? C.green : C.red}}>{Math.abs(trend)}%</span>
          <span style={{color:C.muted}}>vs last month</span>
        </div>
      )}
    </div>
  );
}
