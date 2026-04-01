import { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, X, Download, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import { C, Badge, TypePill, Label, Input, Select } from "./UI";
import { PageTitle } from "./Layout";
import { useAuth } from "../context/AuthContext";

const fmtD = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

export function TxModal({ tx, onClose, onSave, categories }) {
  const [form, setForm] = useState(
    tx || { date:new Date().toISOString().split("T")[0], description:"", category:"Food", type:"expense", amount:"" }
  );
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const ok  = form.description && form.amount && form.date;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:32,width:420,boxShadow:"0 24px 80px rgba(0,0,0,0.6)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:C.text}}>{tx?"Edit":"New"} Transaction</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}><X size={18}/></button>
        </div>
        <Label>Description</Label>
        <Input value={form.description} onChange={e=>set("description",e.target.value)} placeholder="e.g. Monthly Salary"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="0"/></div>
          <div><Label>Date</Label><Input type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
          <div><Label>Category</Label><Select value={form.category} onChange={e=>set("category",e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</Select></div>
          <div><Label>Type</Label><Select value={form.type} onChange={e=>set("type",e.target.value)}><option value="income">Income</option><option value="expense">Expense</option></Select></div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"11px",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,color:C.dim,fontSize:13}}>Cancel</button>
          <button onClick={()=>ok&&onSave({...form,amount:parseFloat(form.amount)})} disabled={!ok} style={{flex:1,padding:"11px",background:ok?C.gold:"#3a3010",border:"none",borderRadius:8,color:ok?"#1a1200":C.muted,cursor:ok?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>{tx?"Save Changes":"Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}

export function TransactionsPage({ txs, setTxs, categories }) {
  const { user } = useAuth();
  const role = user?.role || "viewer";
  const [search, setSearch] = useState("");
  const [fType, setFType] = useState("all");
  const [fCat, setFCat] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [modal, setModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const filtered = useMemo(() => {
    let list = [...txs];
    if (search) list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (fType !== "all") list = list.filter(t => t.type === fType);
    if (fCat !== "all") list = list.filter(t => t.category === fCat);
    list.sort((a,b) => {
      const d = sortDir === "asc" ? 1 : -1;
      return sortBy === "date" ? d*(new Date(a.date)-new Date(b.date)) : d*(a.amount-b.amount);
    });
    return list;
  }, [txs, search, fType, fCat, sortBy, sortDir]);

  const toggleSort = k => {
    if (sortBy === k) setSortDir(d => d==="asc"?"desc":"asc");
    else { setSortBy(k); setSortDir("desc"); }
  };

  const onSave = data => {
    if (editTx) setTxs(ts => ts.map(t => t.id===editTx.id ? {...data,id:editTx.id} : t));
    else setTxs(ts => [{...data,id:Date.now()}, ...ts]);
    setModal(false);
  };

  const exportCSV = () => {
    const rows = [["Date","Description","Category","Type","Amount"],...filtered.map(t=>[t.date,t.description,t.category,t.type,t.amount])];
    const csv = rows.map(r=>r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    const a = document.createElement("a"); a.href=url; a.download="transactions.csv"; a.click();
  };

  const SortArrow = ({ k }) => sortBy===k ? (sortDir==="asc" ? <ChevronUp size={11}/> : <ChevronDown size={11}/>) : <ChevronDown size={11} style={{opacity:0.3}}/>;
  const cols = role==="admin" ? "130px 1fr 130px 90px 130px 80px" : "130px 1fr 130px 90px 130px";

  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
        <PageTitle title="Transactions" sub={`${filtered.length} records found`}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={exportCSV} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.dim,fontSize:12,cursor:"pointer"}}><Download size={13}/> Export CSV</button>
          {role==="admin" && <button onClick={()=>{setEditTx(null); setModal(true)}} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",background:C.gold,border:"none",borderRadius:8,color:"#1a1200",fontSize:13,fontWeight:700,cursor:"pointer"}}><Plus size={14}/> Add Transaction</button>}
        </div>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:18,alignItems:"center"}}>
        <div style={{position:"relative",flex:1}}><Search size={13} color={C.muted} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"9px 12px 9px 33px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12,outline:"none"}}/></div>
        <div style={{display:"flex",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>{["all","income","expense"].map(t => <button key={t} onClick={()=>setFType(t)} style={{padding:"9px 14px",border:"none",cursor:"pointer",fontSize:12,background:fType===t?C.goldDim:"transparent",color:fType===t?C.gold:C.dim}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}</div>
        <select value={fCat} onChange={e=>setFCat(e.target.value)} style={{padding:"9px 12px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12,outline:"none"}}><option value="all">All Categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
      </div>

      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:cols,padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.surface2,fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>
          <div onClick={()=>toggleSort("date")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>Date <SortArrow k="date"/></div>
          <div>Description</div>
          <div>Category</div>
          <div>Type</div>
          <div onClick={()=>toggleSort("amount")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>Amount <SortArrow k="amount"/></div>
          {role==="admin"&&<div>Actions</div>}
        </div>
        {filtered.length===0 ? <div style={{padding:60,textAlign:"center",color:C.muted}}><AlertCircle size={28} style={{opacity:0.3,marginBottom:10}}/><div>No results found</div></div> : filtered.map((tx,i) => (
          <div key={tx.id} style={{display:"grid",gridTemplateColumns:cols,padding:"13px 20px",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",alignItems:"center",fontSize:13}}>
            <div style={{fontSize:11,color:C.muted}}>{fmtD(tx.date)}</div>
            <div style={{color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:8}}>{tx.description}</div>
            <div><Badge cat={tx.category}/></div>
            <div><TypePill type={tx.type}/></div>
            <div style={{fontFamily:"monospace",fontWeight:600,color:tx.type==="income"?C.green:C.red}}>{tx.type==="income"?"+":"−"}₹{tx.amount.toLocaleString()}</div>
            {role==="admin"&&<div style={{display:"flex",gap:4}}><button onClick={()=>{setEditTx(tx); setModal(true)}} style={{background:"none",border:"none",cursor:"pointer",color:C.blue}}><Edit2 size={13}/></button><button onClick={()=>setTxs(ts => ts.filter(t => t.id !== tx.id))} style={{background:"none",border:"none",cursor:"pointer",color:C.red}}><Trash2 size={13}/></button></div>}
          </div>
        ))}
      </div>
      {modal && <TxModal tx={editTx} onClose={()=>setModal(false)} onSave={onSave} categories={categories}/>}
    </div>
  );
}
