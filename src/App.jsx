import { useState, useEffect } from "react";
import { Sidebar, Header } from "./components/Layout";
import { DashboardPage } from "./components/Dashboard";
import { TransactionsPage } from "./components/Transactions";
import { InsightsPage } from "./components/Insights";
import { C } from "./components/UI";

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const CATEGORIES = [
  "Food","Transport","Shopping","Entertainment",
  "Health","Utilities","Salary","Freelance","Investment","Other",
];

const MONTHLY = [
  {month:"Oct", income:5200, expenses:2100},
  {month:"Nov", income:5800, expenses:2400},
  {month:"Dec", income:6200, expenses:3100},
  {month:"Jan", income:7500, expenses:2905},
  {month:"Feb", income:6100, expenses:1905},
  {month:"Mar", income:6200, expenses:1800},
].map(d => ({ ...d, balance: d.income - d.expenses }));

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

function catEmoji(cat) {
  const m = {Food:"🍽",Transport:"🚗",Shopping:"🛍",Entertainment:"🎭",
    Health:"💊",Utilities:"💡",Salary:"💼",Freelance:"💻",Investment:"📈",Other:"◎"};
  return m[cat]||"◎";
}

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

  /**
   * Technical Signal: Modular layout assembly using state-driven routing.
   * State is handled at the root to maintain a Single Source of Truth for sync between views.
   */
  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>
      <Sidebar page={page} setPage={setPage}/>
      <div style={{marginLeft:220,padding:"28px 36px",minHeight:"100vh",maxWidth:1200}}>
        <Header role={role} setRole={setRole}/>
        <main style={{animation:"fadeIn 0.4s ease-out"}}>
          {page==="dashboard"    && <DashboardPage txs={txs} monthlyData={MONTHLY} catEmoji={catEmoji}/>}
          {page==="transactions" && <TransactionsPage txs={txs} setTxs={setTxs} role={role} categories={CATEGORIES}/>}
          {page==="insights"     && <InsightsPage txs={txs}/>}
        </main>
      </div>
    </div>
  );
}
