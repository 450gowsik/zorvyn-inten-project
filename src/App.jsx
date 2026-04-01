import { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from "recharts";
import {
  Wallet, TrendingUp, TrendingDown, CreditCard, Search,
  Plus, Edit2, Trash2, X, Check, LayoutDashboard,
  ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight,
  Shield, Eye, Download, AlertCircle,
} from "lucide-react";

/* ─── PALETTE ────────────────────────────────────────────────────────────── */
const C = {
  bg:        "#07090f",
  surface:   "#0d1120",
  surface2:  "#131927",
  surface3:  "#192035",
  border:    "#1c2338",
  borderHov: "#2a3550",
  gold:      "#e8b84b",
  goldDim:   "rgba(232,184,75,0.13)",
  goldBr:    "#f5cc6a",
  green:     "#34d399",
  greenDim:  "rgba(52,211,153,0.10)",
  red:       "#fb7185",
  redDim:    "rgba(251,113,133,0.10)",
  blue:      "#818cf8",
  blueDim:   "rgba(129,140,248,0.10)",
  text:      "#e4e8f5",
  dim:       "#8090b0",
  muted:     "#4a5570",
};

/* ─── STATIC DATA ────────────────────────────────────────────────────────── */
const CATEGORIES = [
  "Food","Transport","Shopping","Entertainment",
  "Health","Utilities","Salary","Freelance","Investment","Other",
];

const CAT_COLOR = {
  Food:"#f59e0b", Transport:"#3b82f6", Shopping:"#a78bfa",
  Entertainment:"#ec4899", Health:"#34d399", Utilities:"#64748b",
  Salary:"#e8b84b", Freelance:"#60a5fa", Investment:"#10b981", Other:"#94a3b8",
};

const MONTHLY = [
  {month:"Oct", income:5200, expenses:2100},
  {month:"Nov", income:5800, expenses:2400},
  {month:"Dec", income:6200, expenses:3100},
  {month:"Jan", income:7500, expenses:2905},
  {month:"Feb", income:6100, expenses:1905},
  {month:"Mar", income:6200, expenses:1800},
].map(d => ({ ...d, balance: d.income - d.expenses }));

let _nextId = 26;
const SEED_TX = [
  {id:1,  date:"2026-03-28", amount:4500, category:"Salary",        type:"income",  description:"Monthly Salary"},
  {id:2,  date:"2026-03-25", amount:850,  category:"Shopping",      type:"expense", description:"Electronics Purchase"},
  {id:3,  date:"2026-03-22", amount:120,  category:"Food",          type:"expense", description:"Grocery Store"},
  {id:4,  date:"2026-03-20", amount:45,   category:"Transport",     type:"expense", description:"Fuel Refill"},
  {id:5,  date:"2026-03-18", amount:200,  category:"Entertainment", type:"expense", description:"Concert Tickets"},
  {id:6,  date:"2026-03-15", amount:1200, category:"Freelance",     type:"income",  description:"Client Project"},
  {id:7,  date:"2026-03-12", amount:80,   category:"Health",        type:"expense", description:"Gym Membership"},
  {id:8,  date:"2026-03-10", amount:95,   category:"Utilities",     type:"expense", description:"Electricity Bill"},
  {id:9,  date:"2026-03-08", amount:350,  category:"Shopping",      type:"expense", description:"Clothing Haul"},
  {id:10, date:"2026-03-05", amount:60,   category:"Food",          type:"expense", description:"Restaurant Dinner"},
  {id:11, date:"2026-03-03", amount:500,  category:"Investment",    type:"income",  description:"Stock Dividend"},
  {id:12, date:"2026-02-28", amount:4500, category:"Salary",        type:"income",  description:"Monthly Salary"},
  {id:13, date:"2026-02-24", amount:180,  category:"Food",          type:"expense", description:"Weekly Groceries"},
  {id:14, date:"2026-02-20", amount:65,   category:"Transport",     type:"expense", description:"Ride Share"},
  {id:15, date:"2026-02-15", amount:150,  category:"Health",        type:"expense", description:"Doctor Consultation"},
  {id:16, date:"2026-02-10", amount:90,   category:"Utilities",     type:"expense", description:"Internet Bill"},
  {id:17, date:"2026-02-08", amount:800,  category:"Freelance",     type:"income",  description:"Design Project"},
  {id:18, date:"2026-02-05", amount:420,  category:"Shopping",      type:"expense", description:"Home Decor"},
  {id:19, date:"2026-02-01", amount:100,  category:"Entertainment", type:"expense", description:"Streaming & Games"},
  {id:20, date:"2026-01-30", amount:4500, category:"Salary",        type:"income",  description:"Monthly Salary"},
  {id:21, date:"2026-01-25", amount:200,  category:"Food",          type:"expense", description:"Grocery & Dining"},
  {id:22, date:"2026-01-20", amount:1500, category:"Investment",    type:"income",  description:"Stock Dividend"},
  {id:23, date:"2026-01-15", amount:550,  category:"Shopping",      type:"expense", description:"New Shoes & Bag"},
  {id:24, date:"2026-01-10", amount:85,   category:"Utilities",     type:"expense", description:"Gas Bill"},
  {id:25, date:"2026-01-05", amount:70,   category:"Transport",     type:"expense", description:"Monthly Bus Pass"},
];

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const fmt  = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const fmtD = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const s    = (base, extra={}) => ({ ...base, ...extra });

/* ─── SHARED UI ──────────────────────────────────────────────────────────── */
function Badge({ cat }) {
  const color = CAT_COLOR[cat] || "#94a3b8";
  return (
    <span style={{display:"inline-flex",alignItems:"center",padding:"2px 10px",borderRadius:20,
      fontSize:11,fontWeight:500,background:color+"22",color,border:`1px solid ${color}33`}}>
      {cat}
    </span>
  );
}

function TypePill({ type }) {
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

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontSize:12}}>
      <div style={{color:C.gold,fontWeight:600,marginBottom:6}}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{display:"flex",gap:8,marginBottom:2}}>
          <span style={{color:C.dim}}>{p.name}:</span>
          <span style={{fontFamily:"monospace",color:p.color}}>₹{(p.value||0).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
function Sidebar({ page, setPage }) {
  const nav = [
    { id:"dashboard",    label:"Dashboard",    Icon:LayoutDashboard },
    { id:"transactions", label:"Transactions", Icon:CreditCard },
    { id:"insights",     label:"Insights",     Icon:TrendingUp },
  ];
  return (
    <div style={{position:"fixed",top:0,left:0,width:220,height:"100vh",
      background:C.surface,borderRight:`1px solid ${C.border}`,
      display:"flex",flexDirection:"column",zIndex:100}}>
      {/* Logo */}
      <div style={{padding:"28px 24px 24px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,
          color:C.gold,letterSpacing:1}}>FinTrack</div>
        <div style={{fontSize:10,color:C.muted,marginTop:3,letterSpacing:2,textTransform:"uppercase"}}>
          Finance Dashboard
        </div>
      </div>
      {/* Nav */}
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

/* ─── HEADER ─────────────────────────────────────────────────────────────── */
function Header({ role, setRole }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:36}}>
      <div style={{fontSize:12,color:C.muted,letterSpacing:1}}>
        {role === "admin"
          ? <span style={{color:C.gold}}>⬡ Admin Mode — full edit access</span>
          : <span>⬡ Viewer Mode — read only</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {/* Role switcher */}
        <div style={{position:"relative"}}>
          <button onClick={() => setOpen(o => !o)} style={{
            display:"flex",alignItems:"center",gap:8,padding:"8px 14px",
            background:C.surface2,border:`1px solid ${C.border}`,
            borderRadius:8,color:C.text,cursor:"pointer",fontSize:13,fontWeight:500,
          }}>
            {role === "admin"
              ? <Shield size={13} color={C.gold} />
              : <Eye size={13} color={C.blue} />}
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
        {/* Avatar */}
        <div style={{width:34,height:34,borderRadius:"50%",
          background:`linear-gradient(135deg,${C.gold},#b88a20)`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:700,color:"#1a1200"}}>G</div>
      </div>
    </div>
  );
}

/* ─── SUMMARY CARD ───────────────────────────────────────────────────────── */
function SCard({ title, value, sub, trend, color, Icon }) {
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

/* ─── DASHBOARD PAGE ─────────────────────────────────────────────────────── */
function DashboardPage({ txs }) {
  const income   = txs.filter(t => t.type==="income").reduce((s,t) => s+t.amount,0);
  const expenses = txs.filter(t => t.type==="expense").reduce((s,t) => s+t.amount,0);
  const balance  = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income-expenses)/income)*100) : 0;

  // Category pie data
  const catMap = {};
  txs.filter(t=>t.type==="expense").forEach(t => { catMap[t.category]=(catMap[t.category]||0)+t.amount; });
  const pieData = Object.entries(catMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);

  // Recent 5 txs
  const recent = [...txs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);

  return (
    <div>
      <PageTitle title="Overview" sub="Your financial snapshot at a glance"/>

      {/* Summary Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <SCard title="Total Balance"  value={fmt(balance)}     sub="All time net"      trend={8.2}  color={C.gold}  Icon={Wallet}/>
        <SCard title="Total Income"   value={fmt(income)}      sub="All sources"       trend={5.1}  color={C.green} Icon={TrendingUp}/>
        <SCard title="Total Expenses" value={fmt(expenses)}    sub="All spending"      trend={-3.4} color={C.red}   Icon={TrendingDown}/>
        <SCard title="Savings Rate"   value={`${savingsRate}%`} sub="Income retained"  trend={2.1}  color={C.blue}  Icon={CreditCard}/>
      </div>

      {/* Charts Row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:14,marginBottom:14}}>
        {/* Area chart */}
        <ChartCard title="Monthly Cash Flow" sub="Income vs Expenses — last 6 months">
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={MONTHLY} margin={{top:5,right:5,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.green} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.red} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.red} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}
                tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="income"   name="Income"   stroke={C.green} fill="url(#gI)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke={C.red}   fill="url(#gE)" strokeWidth={2} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Donut */}
        <ChartCard title="Spending Breakdown" sub="By category — all time">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={68}
                paddingAngle={3} dataKey="value">
                {pieData.map(e => <Cell key={e.name} fill={CAT_COLOR[e.name]||C.muted}/>)}
              </Pie>
              <Tooltip formatter={v=>[`₹${v.toLocaleString()}`,"Amount"]}
                contentStyle={{background:C.surface2,border:`1px solid ${C.border}`,
                borderRadius:8,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:6}}>
            {pieData.slice(0,5).map(d => (
              <div key={d.name} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                <div style={{width:7,height:7,borderRadius:"50%",
                  background:CAT_COLOR[d.name]||C.muted,flexShrink:0}}/>
                <span style={{color:C.dim,flex:1}}>{d.name}</span>
                <span style={{fontFamily:"monospace",color:C.text}}>
                  ₹{d.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent Transactions */}
      <ChartCard title="Recent Transactions" sub="Latest activity">
        {recent.map((tx,i) => (
          <div key={tx.id} style={{display:"flex",alignItems:"center",gap:12,
            padding:"10px 0",borderBottom:i<recent.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:9,flexShrink:0,
              background:(CAT_COLOR[tx.category]||"#94a3b8")+"22",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:16}}>
              {catEmoji(tx.category)}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,color:C.text,marginBottom:2,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {tx.description}
              </div>
              <div style={{fontSize:11,color:C.muted}}>{fmtD(tx.date)}</div>
            </div>
            <Badge cat={tx.category}/>
            <div style={{fontFamily:"monospace",fontSize:14,fontWeight:600,flexShrink:0,
              color:tx.type==="income"?C.green:C.red}}>
              {tx.type==="income"?"+":"−"}₹{tx.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </ChartCard>
    </div>
  );
}

/* ─── TRANSACTIONS PAGE ──────────────────────────────────────────────────── */
function TransactionsPage({ txs, setTxs, role }) {
  const [search,  setSearch]  = useState("");
  const [fType,   setFType]   = useState("all");
  const [fCat,    setFCat]    = useState("all");
  const [sortBy,  setSortBy]  = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [modal,   setModal]   = useState(false);
  const [editTx,  setEditTx]  = useState(null);

  const filtered = useMemo(() => {
    let list = [...txs];
    if (search) list = list.filter(t =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()));
    if (fType !== "all") list = list.filter(t => t.type === fType);
    if (fCat  !== "all") list = list.filter(t => t.category === fCat);
    list.sort((a,b) => {
      const d = sortDir === "asc" ? 1 : -1;
      return sortBy === "date"
        ? d*(new Date(a.date)-new Date(b.date))
        : d*(a.amount-b.amount);
    });
    return list;
  }, [txs, search, fType, fCat, sortBy, sortDir]);

  const toggleSort = k => {
    if (sortBy === k) setSortDir(d => d==="asc"?"desc":"asc");
    else { setSortBy(k); setSortDir("desc"); }
  };

  const openAdd  = ()   => { setEditTx(null); setModal(true); };
  const openEdit = (tx) => { setEditTx(tx);   setModal(true); };
  const doDelete = id   => setTxs(ts => ts.filter(t => t.id !== id));

  const onSave = data => {
    if (editTx) setTxs(ts => ts.map(t => t.id===editTx.id ? {...data,id:editTx.id} : t));
    else         setTxs(ts => [{...data,id:_nextId++},...ts]);
    setModal(false);
  };

  const exportCSV = () => {
    const rows = [["Date","Description","Category","Type","Amount"],...filtered.map(t=>[t.date,t.description,t.category,t.type,t.amount])];
    const csv  = rows.map(r=>r.join(",")).join("\n");
    const url  = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    const a    = document.createElement("a"); a.href=url; a.download="transactions.csv"; a.click();
  };

  const SortArrow = ({ k }) => sortBy===k
    ? (sortDir==="asc" ? <ChevronUp size={11} color={C.gold}/> : <ChevronDown size={11} color={C.gold}/>)
    : <ChevronDown size={11} color={C.muted}/>;

  const cols = role==="admin"
    ? "130px 1fr 130px 90px 130px 80px"
    : "130px 1fr 130px 90px 130px";

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
        <PageTitle title="Transactions" sub={`${filtered.length} record${filtered.length!==1?"s":""} found`}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={exportCSV} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",
            background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,
            color:C.dim,cursor:"pointer",fontSize:12,fontWeight:500}}>
            <Download size={13}/> Export CSV
          </button>
          {role==="admin" && (
            <button onClick={openAdd} style={{display:"flex",alignItems:"center",gap:7,
              padding:"9px 18px",background:C.gold,border:"none",borderRadius:8,
              color:"#1a1200",cursor:"pointer",fontSize:13,fontWeight:700}}>
              <Plus size={14}/> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 200px",minWidth:160}}>
          <Search size={13} color={C.muted} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name or category…"
            style={{width:"100%",padding:"9px 12px 9px 33px",background:C.surface,
              border:`1px solid ${C.border}`,borderRadius:8,color:C.text,
              fontSize:12,outline:"none",boxSizing:"border-box"}}/>
        </div>

        {/* Type filter */}
        <div style={{display:"flex",background:C.surface,border:`1px solid ${C.border}`,
          borderRadius:8,overflow:"hidden"}}>
          {["all","income","expense"].map(t => (
            <button key={t} onClick={()=>setFType(t)} style={{
              padding:"9px 14px",border:"none",cursor:"pointer",fontSize:12,fontWeight:500,
              background: fType===t ? C.goldDim : "transparent",
              color:      fType===t ? C.gold    : C.dim,
            }}>{t==="all"?"All":t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>

        {/* Category filter */}
        <select value={fCat} onChange={e=>setFCat(e.target.value)} style={{
          padding:"9px 12px",background:C.surface,border:`1px solid ${C.border}`,
          borderRadius:8,color:fCat==="all"?C.muted:C.text,fontSize:12,outline:"none"}}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        {/* Header */}
        <div style={{display:"grid",gridTemplateColumns:cols,padding:"12px 20px",
          borderBottom:`1px solid ${C.border}`,background:C.surface2}}>
          {[["date","Date"],["","Description"],["","Category"],["","Type"],["amount","Amount"]].map(([k,l])=>(
            <div key={l} onClick={()=>k&&toggleSort(k)} style={{fontSize:10,color:C.muted,
              textTransform:"uppercase",letterSpacing:1,cursor:k?"pointer":"default",
              display:"flex",alignItems:"center",gap:4}}>
              {l}{k&&<SortArrow k={k}/>}
            </div>
          ))}
          {role==="admin"&&<div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>
            Actions
          </div>}
        </div>

        {filtered.length===0 ? (
          <div style={{padding:"60px 20px",textAlign:"center",color:C.muted}}>
            <AlertCircle size={28} style={{opacity:0.3,marginBottom:10}}/>
            <div style={{fontSize:14}}>No transactions match your filters</div>
          </div>
        ) : filtered.map((tx,i) => (
          <div key={tx.id} style={{display:"grid",gridTemplateColumns:cols,
            padding:"13px 20px",
            borderBottom: i<filtered.length-1?`1px solid ${C.border}`:"none",
            alignItems:"center",transition:"background 0.1s"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.surface2}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:11,color:C.muted}}>{fmtD(tx.date)}</div>
            <div style={{fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:8}}>
              {tx.description}
            </div>
            <div><Badge cat={tx.category}/></div>
            <div><TypePill type={tx.type}/></div>
            <div style={{fontFamily:"monospace",fontSize:13,fontWeight:600,
              color:tx.type==="income"?C.green:C.red}}>
              {tx.type==="income"?"+":"−"}₹{tx.amount.toLocaleString()}
            </div>
            {role==="admin"&&(
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>openEdit(tx)} style={{background:"none",border:"none",
                  cursor:"pointer",padding:4,color:C.blue,borderRadius:4}}>
                  <Edit2 size={13}/>
                </button>
                <button onClick={()=>doDelete(tx.id)} style={{background:"none",border:"none",
                  cursor:"pointer",padding:4,color:C.red,borderRadius:4}}>
                  <Trash2 size={13}/>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {modal && <TxModal tx={editTx} onClose={()=>setModal(false)} onSave={onSave}/>}
    </div>
  );
}

/* ─── TRANSACTION MODAL ──────────────────────────────────────────────────── */
function TxModal({ tx, onClose, onSave }) {
  const [form, setForm] = useState(
    tx || { date:new Date().toISOString().split("T")[0], description:"", category:"Food", type:"expense", amount:"" }
  );
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const ok  = form.description && form.amount && form.date;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:500,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,
        padding:32,width:420,boxShadow:"0 24px 80px rgba(0,0,0,0.6)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:C.text}}>
            {tx?"Edit":"New"} Transaction
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}>
            <X size={18}/>
          </button>
        </div>

        <Label>Description</Label>
        <Input value={form.description} onChange={e=>set("description",e.target.value)}
          placeholder="e.g. Monthly Salary"/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <Label>Amount (₹)</Label>
            <Input type="number" value={form.amount} onChange={e=>set("amount",e.target.value)}
              placeholder="0"/>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={e=>set("date",e.target.value)}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onChange={e=>set("category",e.target.value)}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select value={form.type} onChange={e=>set("type",e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"11px",
            background:C.surface2,border:`1px solid ${C.border}`,
            borderRadius:8,color:C.dim,cursor:"pointer",fontSize:13}}>
            Cancel
          </button>
          <button onClick={()=>ok&&onSave({...form,amount:parseFloat(form.amount)})}
            disabled={!ok}
            style={{flex:1,padding:"11px",background:ok?C.gold:"#3a3010",
              border:"none",borderRadius:8,color:ok?"#1a1200":C.muted,
              cursor:ok?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>
            {tx?"Save Changes":"Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── INSIGHTS PAGE ──────────────────────────────────────────────────────── */
function InsightsPage({ txs }) {
  const expenses  = txs.filter(t=>t.type==="expense");
  const income    = txs.filter(t=>t.type==="income");
  const totalExp  = expenses.reduce((s,t)=>s+t.amount,0);
  const totalInc  = income.reduce((s,t)=>s+t.amount,0);
  const savings   = totalInc > 0 ? Math.round(((totalInc-totalExp)/totalInc)*100) : 0;

  // Category breakdown
  const catMap = {};
  expenses.forEach(t=>{ catMap[t.category]=(catMap[t.category]||0)+t.amount; });
  const catList = Object.entries(catMap).map(([n,v])=>({name:n,value:v})).sort((a,b)=>b.value-a.value);
  const topCat  = catList[0];

  // Monthly net
  const monMap = {};
  txs.forEach(t => {
    const m = t.date.slice(0,7);
    if (!monMap[m]) monMap[m]={income:0,expenses:0};
    if (t.type==="income") monMap[m].income+=t.amount;
    else monMap[m].expenses+=t.amount;
  });
  const monList = Object.entries(monMap).sort().map(([m,d])=>({
    month: new Date(m+"-01").toLocaleDateString("en",{month:"short",year:"2-digit"}),
    ...d, net:d.income-d.expenses,
  }));
  const bestMon  = monList.length ? monList.reduce((a,b)=>a.net>b.net?a:b) : null;
  const worstMon = monList.length ? monList.reduce((a,b)=>a.net<b.net?a:b) : null;

  // MoM comparison (last 2 months)
  const last2 = monList.slice(-2);
  const momDiff = last2.length===2 ? last2[1].net - last2[0].net : null;

  return (
    <div>
      <PageTitle title="Insights" sub="Patterns and observations from your financial data"/>

      {/* Top stat row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:14}}>
        <InsightCard title="Highest Spending Category">
          {topCat ? <>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:CAT_COLOR[topCat.name]||C.muted}}/>
              <span style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:C.text}}>
                {topCat.name}
              </span>
            </div>
            <div style={{fontFamily:"monospace",fontSize:22,color:C.red,fontWeight:700}}>
              ₹{topCat.value.toLocaleString()}
            </div>
            <div style={{fontSize:12,color:C.muted,marginTop:5}}>
              {Math.round((topCat.value/totalExp)*100)}% of total spending
            </div>
          </> : <Empty/>}
        </InsightCard>

        <InsightCard title="Best Month">
          {bestMon ? <>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:10}}>
              {bestMon.month}
            </div>
            <div style={{fontFamily:"monospace",fontSize:22,color:C.green,fontWeight:700}}>
              +₹{bestMon.net.toLocaleString()}
            </div>
            <div style={{fontSize:12,color:C.muted,marginTop:5}}>Highest net savings</div>
          </> : <Empty/>}
        </InsightCard>

        <InsightCard title="Savings Rate">
          <div style={{fontFamily:"monospace",fontSize:36,fontWeight:700,
            color: savings>=20?C.green:savings>=10?C.gold:C.red}}>
            {savings}%
          </div>
          <div style={{fontSize:12,color:C.muted,marginTop:8}}>
            {savings>=20?"✦ Excellent savings habit"
              :savings>=10?"◈ Good — room to improve"
              :"◎ Consider cutting expenses"}
          </div>
          {momDiff !== null && (
            <div style={{fontSize:12,marginTop:12,color:momDiff>=0?C.green:C.red}}>
              {momDiff>=0?"▲":"▼"} ₹{Math.abs(momDiff).toLocaleString()} vs prev month
            </div>
          )}
        </InsightCard>
      </div>

      {/* Category progress bars */}
      <ChartCard title="Spending by Category" sub="All time — sorted by amount">
        {catList.length===0 ? <Empty/> : catList.map(({name,value})=>(
          <div key={name} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:7,height:7,borderRadius:"50%",
                  background:CAT_COLOR[name]||C.muted}}/>
                <span style={{color:C.dim}}>{name}</span>
              </div>
              <span style={{fontFamily:"monospace",color:C.text}}>
                ₹{value.toLocaleString()}
              </span>
            </div>
            <div style={{height:5,background:C.surface3,borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",
                width:`${Math.round((value/totalExp)*100)}%`,
                background:CAT_COLOR[name]||C.muted,borderRadius:3}}/>
            </div>
          </div>
        ))}
      </ChartCard>

      {/* Monthly net bar chart */}
      <div style={{marginTop:14}}>
        <ChartCard title="Monthly Net Savings" sub="Income minus expenses per month">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monList} margin={{top:0,right:5,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}
                tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="net" name="Net Savings" radius={[4,4,0,0]}>
                {monList.map((e,i) => (
                  <Cell key={i} fill={e.net>=0?C.green:C.red} opacity={0.75}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* ─── MICRO COMPONENTS ───────────────────────────────────────────────────── */
function PageTitle({ title, sub }) {
  return (
    <div style={{marginBottom:24}}>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:700,
        color:C.text,margin:0,letterSpacing:-0.5}}>{title}</h1>
      {sub && <p style={{color:C.muted,margin:"4px 0 0",fontSize:13}}>{sub}</p>}
    </div>
  );
}

function ChartCard({ title, sub, children }) {
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 24px"}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:600,color:C.text}}>{title}</div>
        {sub && <div style={{fontSize:12,color:C.muted,marginTop:2}}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function InsightCard({ title, children }) {
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 22px"}}>
      <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{children}</div>;
}

function Input({ ...props }) {
  return (
    <input {...props} style={{width:"100%",padding:"10px 12px",
      background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,
      color:C.text,fontSize:13,outline:"none",
      boxSizing:"border-box",marginBottom:14,display:"block"}}/>
  );
}

function Select({ children, ...props }) {
  return (
    <select {...props} style={{width:"100%",padding:"10px 12px",
      background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,
      color:C.text,fontSize:13,outline:"none",display:"block",
      marginBottom:14,boxSizing:"border-box"}}>
      {children}
    </select>
  );
}

function Empty() {
  return <div style={{color:C.muted,fontSize:13}}>No data available</div>;
}

function catEmoji(cat) {
  const m = {Food:"🍽",Transport:"🚗",Shopping:"🛍",Entertainment:"🎭",
    Health:"💊",Utilities:"💡",Salary:"💼",Freelance:"💻",Investment:"📈",Other:"◎"};
  return m[cat]||"◎";
}

/* ─── APP ROOT ───────────────────────────────────────────────────────────── */
export default function App() {
  const [role, setRole] = useState("viewer");
  const [page, setPage] = useState("dashboard");
  const [txs,  setTxs]  = useState(SEED_TX);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:C.bg,
      minHeight:"100vh",color:C.text}}>
      <Sidebar page={page} setPage={setPage}/>
      <div style={{marginLeft:220,padding:"28px 36px",minHeight:"100vh",maxWidth:1200}}>
        <Header role={role} setRole={setRole}/>
        {page==="dashboard"    && <DashboardPage    txs={txs}/>}
        {page==="transactions" && <TransactionsPage txs={txs} setTxs={setTxs} role={role}/>}
        {page==="insights"     && <InsightsPage     txs={txs}/>}
      </div>
    </div>
  );
}
