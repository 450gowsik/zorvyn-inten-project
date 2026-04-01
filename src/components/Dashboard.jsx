import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid 
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { C, CAT_COLOR } from "./UI";
import { SCard, PageTitle } from "./Layout";

const fmt = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);

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

export function ChartCard({ title, sub, children }) {
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

export function DashboardPage({ txs, monthlyData, catEmoji }) {
  const income   = txs.filter(t => t.type==="income").reduce((s,t) => s+t.amount,0);
  const expenses = txs.filter(t => t.type==="expense").reduce((s,t) => s+t.amount,0);
  const balance  = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income-expenses)/income)*100) : 0;

  const catMap = {};
  txs.filter(t=>t.type==="expense").forEach(t => { catMap[t.category]=(catMap[t.category]||0)+t.amount; });
  const pieData = Object.entries(catMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  const recent = [...txs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);

  return (
    <div className="fade-in">
      <PageTitle title="Overview" sub="Financial health at a glance"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <SCard title="Balance"    value={fmt(balance)} trend={8.2}  color={C.gold}  Icon={Wallet}/>
        <SCard title="Income"     value={fmt(income)}  trend={5.1}  color={C.green} Icon={TrendingUp}/>
        <SCard title="Expenses"   value={fmt(expenses)} trend={-3.4} color={C.red}   Icon={TrendingDown}/>
        <SCard title="Savings"    value={`${savingsRate}%`} trend={2.1} color={C.blue} Icon={CreditCard}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:14,marginBottom:14}}>
        <ChartCard title="Monthly Cash Flow" sub="Income vs Expenses">
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthlyData} margin={{top:5,right:5,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.red} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={C.red} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="income" stroke={C.green} fill="url(#gI)" strokeWidth={2}/>
              <Area type="monotone" dataKey="expenses" stroke={C.red} fill="url(#gE)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Spending Breakdown" sub="By category">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value">
                {pieData.map(e => <Cell key={e.name} fill={CAT_COLOR[e.name]||C.muted}/>)}
              </Pie>
              <Tooltip formatter={v=>[`₹${v.toLocaleString()}`,"Amount"]} contentStyle={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:6}}>
            {pieData.slice(0,5).map(d => (
              <div key={d.name} style={{display:"flex",alignItems:"center",gap:8,fontSize:11}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:CAT_COLOR[d.name],flexShrink:0}}/>
                <span style={{color:C.dim,flex:1}}>{d.name}</span>
                <span style={{color:C.text}}>₹{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Recent Transactions" sub="Latest activity">
        {recent.map((tx,i) => (
          <div key={tx.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<recent.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:9,background:CAT_COLOR[tx.category]+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
              {catEmoji(tx.category)}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.description}</div>
              <div style={{fontSize:11,color:C.muted}}>{new Date(tx.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</div>
            </div>
            <div style={{fontFamily:"monospace",fontSize:13,fontWeight:600,color:tx.type==="income"?C.green:C.red}}>
              {tx.type==="income"?"+":"−"}₹{tx.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </ChartCard>
    </div>
  );
}
