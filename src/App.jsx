import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar, Header } from "./components/Layout";
import { DashboardPage } from "./components/Dashboard";
import { TransactionsPage } from "./components/Transactions";
import { InsightsPage } from "./components/Insights";
import { C } from "./components/UI";
import Login from "./pages/Login";

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
  {id:11, date:"2026-03-03", amount:500,  category:"Investment",    type:"income",  description:"Stock Dividend"},
  {id:12, date:"2026-02-28", amount:4500, category:"Salary",        type:"income",  description:"Monthly Salary"},
  {id:13, date:"2026-02-24", amount:180,  category:"Food",          type:"expense", description:"Weekly Groceries"},
  {id:14, date:"2026-02-20", amount:65,   category:"Transport",     type:"expense", description:"Ride Share"},
  {id:15, date:"2026-02-15", amount:150,  category:"Health",        type:"expense", description:"Doctor Consultation"},
  {id:16, date:"2026-02-10", amount:90,   category:"Utilities",     type:"expense", description:"Internet Bill"},
  {id:17, date:"2026-02-08", amount:800,  category:"Freelance",     type:"income",  description:"Design Project"},
];

function catEmoji(cat) {
  const m = {Food:"🍽",Transport:"🚗",Shopping:"🛍",Entertainment:"🎭",
    Health:"💊",Utilities:"💡",Salary:"💼",Freelance:"💻",Investment:"📈",Other:"◎"};
  return m[cat]||"◎";
}

function DashboardLayout({ txs, setTxs }) {
  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>
      <Sidebar />
      <div style={{marginLeft:220,padding:"28px 36px",minHeight:"100vh",maxWidth:1200}}>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [txs, setTxs] = useState(SEED_TX);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><DashboardLayout txs={txs} setTxs={setTxs}/></ProtectedRoute>}>
            <Route path="/" element={<DashboardPage txs={txs} monthlyData={MONTHLY} catEmoji={catEmoji}/>} />
            <Route path="/transactions" element={<TransactionsPage txs={txs} setTxs={setTxs} categories={CATEGORIES} />} />
            <Route path="/insights" element={<InsightsPage txs={txs}/>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
