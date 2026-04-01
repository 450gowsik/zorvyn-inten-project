import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { C, CAT_COLOR } from "./UI";
import { PageTitle } from "./Layout";

function InsightCard({ title, children }) {
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 22px"}}>
      <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>{title}</div>
      {children}
    </div>
  );
}

export function InsightsPage({ txs }) {
  const expenses = txs.filter(t=>t.type==="expense");
  const income = txs.filter(t=>t.type==="income");
  const totalExp = expenses.reduce((s,t)=>s+t.amount,0);
  const totalInc = income.reduce((s,t)=>s+t.amount,0);
  const savings = totalInc > 0 ? Math.round(((totalInc-totalExp)/totalInc)*100) : 0;

  const catMap = {};
  expenses.forEach(t=>{ catMap[t.category]=(catMap[t.category]||0)+t.amount; });
  const catList = Object.entries(catMap).map(([n,v])=>({name:n,value:v})).sort((a,b)=>b.value-a.value);
  const topCat = catList[0];

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
  const bestMon = monList.length ? monList.reduce((a,b)=>a.net>b.net?a:b) : null;
  const last2 = monList.slice(-2);
  const momDiff = last2.length===2 ? last2[1].net - last2[0].net : null;

  return (
    <div className="fade-in">
      <PageTitle title="Insights" sub="Patterns and observations from your financial data"/>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:14}}>
        <InsightCard title="Top Spending Category">
          {topCat ? <>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:10,height:10,borderRadius:"50%",background:CAT_COLOR[topCat.name]}}/> <span style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:C.text}}>{topCat.name}</span></div>
            <div style={{fontFamily:"monospace",fontSize:22,color:C.red,fontWeight:700}}>₹{topCat.value.toLocaleString()}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:5}}>{Math.round((topCat.value/totalExp)*100)}% of total spending</div>
          </> : <div style={{color:C.muted}}>No data</div>}
        </InsightCard>

        <InsightCard title="Best Month">
          {bestMon ? <>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:10}}>{bestMon.month}</div>
            <div style={{fontFamily:"monospace",fontSize:22,color:C.green,fontWeight:700}}>+₹{bestMon.net.toLocaleString()}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:5}}>Highest net savings</div>
          </> : <div style={{color:C.muted}}>No data</div>}
        </InsightCard>

        <InsightCard title="Savings Rate">
          <div style={{fontFamily:"monospace",fontSize:36,fontWeight:700,color:savings>=20?C.green:savings>=10?C.gold:C.red}}>{savings}%</div>
          <div style={{fontSize:12,color:C.muted,marginTop:8}}>{savings>=20?"✦ Excellent savings habit":savings>=10?"◈ Good — room to improve":"◎ Consider cutting expenses"}</div>
          {momDiff !== null && <div style={{fontSize:12,marginTop:12,color:momDiff>=0?C.green:C.red}}>{momDiff>=0?"▲":"▼"} ₹{Math.abs(momDiff).toLocaleString()} vs prev month</div>}
        </InsightCard>
      </div>

      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 24px",marginBottom:14}}>
        <div style={{marginBottom:16}}><div style={{fontSize:14,fontWeight:600,color:C.text}}>Spending by Category</div></div>
        {catList.length===0 ? <div style={{color:C.muted}}>No data</div> : catList.map(({name,value})=>(
          <div key={name} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:CAT_COLOR[name]}}/><span style={{color:C.dim}}>{name}</span></div>
              <span style={{fontFamily:"monospace",color:C.text}}>₹{value.toLocaleString()}</span>
            </div>
            <div style={{height:5,background:C.surface3,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round((value/totalExp)*100)}%`,background:CAT_COLOR[name],borderRadius:3}}/></div>
          </div>
        ))}
      </div>

      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 24px"}}>
        <div style={{marginBottom:16}}><div style={{fontSize:14,fontWeight:600,color:C.text}}>Monthly Net Savings</div></div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monList} margin={{top:0,right:5,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}k`}/>
            <Tooltip contentStyle={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}}/>
            <Bar dataKey="net" radius={[4,4,0,0]}>{monList.map((e,i)=><Cell key={i} fill={e.net>=0?C.green:C.red} opacity={0.75}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
