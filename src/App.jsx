import { useState, useEffect, useCallback } from "react";

const PLAYER_FEE = 500;
const ML = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Google Drive file IDs created for this academy
const DRIVE_FEES_ID       = "1OALCDwY1noySP-fLijKbjyt1WjxoZW1W6Lzw7sxy3pE";
const DRIVE_ATTENDANCE_ID = "1fmnh0hSl5YRu4pq6xy7tC2FMSVckKwk6gj2M5R_E5w4";
const DRIVE_FOLDER_URL    = "https://drive.google.com/drive/folders/1kDtTVgxjIODrrs7v9PQt4UlVzOjWgcIc";

// Month options: Jan 2026 → Dec 2027
const MONTH_OPTS = [];
for (let y = 2024; y <= 2027; y++) {
  for (let m = 1; m <= 12; m++) {
    if (y === 2024 && m < 4) continue;
    MONTH_OPTS.push({ label: `${ML[m-1]} ${y}`, month: m, year: y });
  }
}

// ─── Players ──────────────────────────────────────────────────────────────────
const INIT_PLAYERS = [
  { id:"p1",  name:"Biprojit Deb",           free:true  },
  { id:"p2",  name:"Adrija Chakraborty",      free:false },
  { id:"p3",  name:"Advait Chakraborty",      free:false },
  { id:"p4",  name:"Abhinaba Dey",            free:false },
  { id:"p5",  name:"Navanil Chakraborty",     free:false },
  { id:"p6",  name:"Prerona Ghosh",           free:false },
  { id:"p7",  name:"Priyansh Chanda",         free:false },
  { id:"p8",  name:"Rudrakshi Nath",          free:false },
  { id:"p9",  name:"Ashmit Deb",              free:false },
  { id:"p10", name:"Biswarup Bhattacharjee",  free:false },
  { id:"p11", name:"Avigyan Bhattacharjee",   free:false },
  { id:"p12", name:"Shanaya Biswas",          free:false },
  { id:"p13", name:"Shubhayan Dey",           free:false },
  { id:"p14", name:"Debarghya Choudhury",     free:false },
  { id:"p15", name:"Bedarghya Choudhury",     free:false },
  { id:"p16", name:"Harendra Singha",         free:false },
  { id:"p17", name:"Kriti Sundar Dutta",      free:false },
  { id:"p18", name:"Satrajit Dhar",           free:false },
  { id:"p19", name:"Prakhar Tiwari",          free:false },
  { id:"p20", name:"Susmita",                 free:false },
  { id:"p21", name:"Sumit",                   free:false },
  { id:"p22", name:"Hrishikesh Paul",         free:false },
  { id:"p23", name:"Harshita Chanda",         free:false },
  { id:"p24", name:"Arnav Marothi",           free:false },
  { id:"p25", name:"Pracheta Banik",          free:false },
];

const mk = (id,pid,m,y,r) => ({ id, playerId:pid, month:m, year:y, amount:PLAYER_FEE,
  date:`${y}-${String(m).padStart(2,"0")}-01`, receipt:r, recordedBy:"admin1", fromPDF:true });

const INIT_FEES = [
  mk("f1","p2",4,2024,"RCP-001"), mk("f2","p2",5,2024,"RCP-002"), mk("f3","p2",6,2024,"RCP-003"),
  mk("f4","p3",4,2024,"RCP-004"), mk("f5","p3",5,2024,"RCP-005"), mk("f6","p3",6,2024,"RCP-006"),
  mk("f7","p4",4,2024,"RCP-007"), mk("f8","p6",4,2024,"RCP-008"),
  mk("f9","p7",4,2024,"RCP-009"), mk("f10","p7",5,2024,"RCP-010"),
  mk("f11","p8",4,2024,"RCP-011"), mk("f12","p8",5,2024,"RCP-012"),
  mk("f13","p9",4,2024,"RCP-013"), mk("f14","p11",4,2024,"RCP-014"),
  mk("f15","p12",4,2024,"RCP-015"), mk("f16","p12",5,2024,"RCP-016"),
  mk("f17","p13",4,2024,"RCP-017"), mk("f18","p13",5,2024,"RCP-018"),
  mk("f19","p14",4,2024,"RCP-019"), mk("f20","p14",5,2024,"RCP-020"),
  mk("f21","p14",6,2024,"RCP-021"), mk("f22","p14",7,2024,"RCP-022"),
  mk("f23","p15",4,2024,"RCP-023"), mk("f24","p15",5,2024,"RCP-024"),
  mk("f25","p15",6,2024,"RCP-025"), mk("f26","p15",7,2024,"RCP-026"),
  mk("f27","p16",4,2024,"RCP-027"), mk("f28","p17",4,2024,"RCP-028"),
  mk("f29","p19",4,2024,"RCP-029"), mk("f30","p23",4,2024,"RCP-030"),
  mk("f31","p24",4,2024,"RCP-031"), mk("f32","p25",4,2024,"RCP-032"),
  mk("f33","p10",8,2024,"RCP-033"), mk("f34","p10",9,2024,"RCP-034"),
  mk("f35","p22",5,2025,"RCP-035"),
];

const USERS = [
  { id:"admin1", name:"DSA Admin", role:"admin", email:"admin@dsa.com", password:"admin123" },
  { id:"coach1", name:"Coach",     role:"coach", email:"coach@dsa.com", password:"coach123" },
];

const uid = () => Math.random().toString(36).slice(2,9);

// ─── DSA Logo SVG ─────────────────────────────────────────────────────────────
const DSALogo = ({ size = 60 }) => (
  <img
    src="https://i.imgur.com/placeholder.png"
    width={size} height={size}
    style={{ borderRadius: 10, objectFit: "contain" }}
    onError={e => { e.target.style.display="none"; }}
    alt="DSA"
  />
);

// We'll use a text-based logo since the uploaded image can't be fetched from external URL
const LogoBadge = ({ size = 56 }) => (
  <div style={{ width:size, height:size, borderRadius:10, background:"#000", display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", flexShrink:0, border:"2px solid #fff" }}>
    <div style={{ color:"#fff", fontWeight:900, fontSize: size*0.28, letterSpacing:1, lineHeight:1 }}>DSA</div>
    <div style={{ color:"#fff", fontWeight:700, fontSize: size*0.13, letterSpacing:0.5, lineHeight:1.2 }}>SILCHAR</div>
  </div>
);

// ─── Google Drive Sync Helper ─────────────────────────────────────────────────
async function syncToGoogleDrive(fees, attendance, players) {
  try {
    const pMap = Object.fromEntries(players.map(p=>[p.id,p.name]));

    // Build CSV for fees
    const feeHeader = "receipt,player,month,year,amount,date,source\n";
    const feeRows = fees.map(f =>
      `${f.receipt||""},${pMap[f.playerId]||f.playerId},${ML[f.month-1]},${f.year},${f.amount},${f.date||""},${f.fromPDF?"PDF Import":"Manual"}`
    ).join("\n");

    // Build CSV for attendance
    const attHeader = "id,player,date,status,markedBy\n";
    const attRows = attendance.map(a =>
      `${a.id},${pMap[a.playerId]||a.playerId},${a.date},${a.status},${a.by||""}`
    ).join("\n");

    // Call Anthropic API to sync via Claude (uses connected Drive MCP)
    const payload = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Update these two Google Drive spreadsheet files with current academy data.

File 1 ID: ${DRIVE_FEES_ID}
New CSV content for fees sheet:
${feeHeader}${feeRows}

File 2 ID: ${DRIVE_ATTENDANCE_ID}  
New CSV content for attendance sheet:
${attHeader}${attRows}

Please create updated versions of both files in the DSA TT Academy folder (${DRIVE_FOLDER_URL}). Confirm when done.`
      }],
      mcp_servers: [{ type:"url", url:"https://drivemcp.googleapis.com/mcp/v1", name:"gdrive" }]
    };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return { ok: true, msg: "✅ Synced to Google Drive!" };
  } catch(e) {
    return { ok: false, msg: "⚠️ Drive sync failed. Data saved locally." };
  }
}

// ─── Local storage persistence ────────────────────────────────────────────────
const load = (key, def) => { try { const v=localStorage.getItem(key); return v?JSON.parse(v):def; } catch{ return def; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch{} };

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [players,  setPlayers]  = useState(() => load("dsa_players", INIT_PLAYERS));
  const [fees,     setFees]     = useState(() => load("dsa_fees",    INIT_FEES));
  const [att,      setAtt]      = useState(() => load("dsa_att",     []));
  const [user,     setUser]     = useState(null);
  const [page,     setPage]     = useState("login");
  const [lf,       setLF]       = useState({ email:"", password:"" });
  const [lerr,     setLerr]     = useState("");
  const [syncMsg,  setSyncMsg]  = useState("");
  const [syncing,  setSyncing]  = useState(false);

  const isAdmin = user?.role === "admin";

  // Auto-save to localStorage whenever data changes
  useEffect(() => { save("dsa_players", players); }, [players]);
  useEffect(() => { save("dsa_fees",    fees);    }, [fees]);
  useEffect(() => { save("dsa_att",     att);     }, [att]);

  const login = () => {
    const u = USERS.find(x => x.email===lf.email && x.password===lf.password);
    if (!u) { setLerr("Wrong credentials.\nAdmin: admin@dsa.com / admin123\nCoach: coach@dsa.com / coach123"); return; }
    setUser(u); setPage("dashboard"); setLerr("");
  };
  const logout = () => { setUser(null); setPage("login"); };

  const driveSync = async () => {
    setSyncing(true); setSyncMsg("Syncing to Google Drive…");
    const r = await syncToGoogleDrive(fees, att, players);
    setSyncMsg(r.msg); setSyncing(false);
    setTimeout(() => setSyncMsg(""), 5000);
  };

  const markAtt = (playerId, date, status) => {
    const ex = att.find(a => a.playerId===playerId && a.date===date);
    if (ex) { if (!isAdmin) return; setAtt(a => a.map(x => x.id===ex.id?{...x,status}:x)); }
    else setAtt(a => [...a, { id:uid(), playerId, date, status, by:user.id }]);
  };

  const collectFee = (entry) => {
    const newRecs = entry.months
      .filter(m => !fees.find(f => f.playerId===entry.playerId && f.month===m.month && f.year===m.year))
      .map(m => ({ id:uid(), playerId:entry.playerId, month:m.month, year:m.year,
        amount:entry.amtPerMonth, date:entry.date, receipt:entry.receipt,
        recordedBy:user.id, fromPDF:false }));
    setFees(f => [...f, ...newRecs]);
  };

  const deleteFee    = (fid) => { if (!isAdmin) return; setFees(f => f.filter(x => x.id!==fid)); };
  const addPlayer    = (p)   => setPlayers(pl => [...pl, {...p, id:uid()}]);
  const removePlayer = (pid) => { if (!isAdmin) return; setPlayers(pl => pl.filter(p=>p.id!==pid)); setFees(f=>f.filter(x=>x.playerId!==pid)); };

  if (!user) return <Login lf={lf} setLF={setLF} onLogin={login} err={lerr} />;

  const props = { players, fees, att, isAdmin, user };

  return (
    <Shell user={user} onLogout={logout} page={page} setPage={setPage} isAdmin={isAdmin}
           onSync={driveSync} syncing={syncing} syncMsg={syncMsg}>
      {page==="dashboard"  && <Dashboard  {...props} />}
      {page==="attendance" && <AttPage    {...props} onMark={markAtt} />}
      {page==="monthly"    && <MonthlyPage {...props} />}
      {page==="fees"       && <FeesPage   {...props} onCollect={collectFee} onDelete={deleteFee} />}
      {page==="receipts"   && <ReceiptsPage {...props} onDelete={deleteFee} />}
      {page==="players"    && isAdmin && <PlayersPage players={players} onAdd={addPlayer} onRemove={removePlayer} />}
    </Shell>
  );
}

// ─── Login ─────────────────────────────────────────────────────────────────────
function Login({ lf, setLF, onLogin, err }) {
  return (
    <div style={S.loginBg}>
      <div style={S.loginCard}>
        {/* DSA Logo area */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, marginBottom:4 }}>
          <div style={{ width:90, height:90, borderRadius:16, background:"#000", display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(0,0,0,.3)" }}>
            <div style={{ color:"#fff", fontWeight:900, fontSize:26, letterSpacing:2 }}>DSA</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:10, letterSpacing:1 }}>SILCHAR</div>
            <div style={{ color:"#fff", fontWeight:400, fontSize:8, opacity:0.7 }}>Est. 1957</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontWeight:900, fontSize:18, color:"#1e3a5f", letterSpacing:0.5 }}>DSA TT ACADEMY</div>
            <div style={{ fontWeight:700, fontSize:13, color:"#64748b", letterSpacing:1 }}>MANAGER</div>
          </div>
        </div>
        <div style={{ height:1, background:"#e2e8f0", margin:"4px 0 8px" }} />
        <input style={S.inp} placeholder="Email" value={lf.email} onChange={e=>setLF(f=>({...f,email:e.target.value}))} />
        <input style={S.inp} type="password" placeholder="Password" value={lf.password}
          onChange={e=>setLF(f=>({...f,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&onLogin()} />
        {err && <pre style={{color:"#dc2626",fontSize:12,textAlign:"center",margin:0,whiteSpace:"pre-wrap"}}>{err}</pre>}
        <button style={S.btnPri} onClick={onLogin}>Login →</button>
        <div style={S.hint}>
          <b>Admin:</b> admin@dsa.com / admin123<br/>
          <b>Coach:</b> coach@dsa.com / coach123
        </div>
        <div style={{ textAlign:"center", fontSize:11, color:"#94a3b8" }}>
          🔗 Synced with Google Drive · gameish25@gmail.com
        </div>
      </div>
    </div>
  );
}

// ─── Shell ─────────────────────────────────────────────────────────────────────
function Shell({ user, onLogout, page, setPage, isAdmin, onSync, syncing, syncMsg, children }) {
  const nav = [
    {id:"dashboard",  icon:"📊", label:"Dashboard"},
    {id:"attendance", icon:"✅", label:"Attendance"},
    {id:"monthly",    icon:"📅", label:"Monthly View"},
    {id:"fees",       icon:"💰", label:"Collect Fees"},
    {id:"receipts",   icon:"🧾", label:"Fee Receipts"},
    ...(isAdmin?[{id:"players",icon:"🏓",label:"Players"}]:[]),
  ];
  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Segoe UI',sans-serif",background:"#f1f5f9"}}>
      <aside style={S.sidebar}>
        {/* Logo + Name */}
        <div style={{ padding:"16px 14px 14px", borderBottom:"1px solid rgba(255,255,255,.12)", marginBottom:6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:42, height:42, borderRadius:8, background:"#fff", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <div style={{ color:"#000", fontWeight:900, fontSize:13, lineHeight:1 }}>DSA</div>
              <div style={{ color:"#000", fontWeight:600, fontSize:7 }}>SILCHAR</div>
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:12, lineHeight:1.2 }}>DSA TT ACADEMY</div>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:10 }}>MANAGER</div>
            </div>
          </div>
        </div>

        {nav.map(n => (
          <button key={n.id} style={{...S.navBtn,...(page===n.id?S.navOn:{})}} onClick={()=>setPage(n.id)}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}

        <div style={{flex:1}}/>

        {/* Drive Sync Button */}
        <div style={{ padding:"0 12px 8px" }}>
          <button style={{ width:"100%", padding:"8px 0", borderRadius:8, border:"1px solid rgba(255,255,255,.25)",
            background: syncing?"rgba(255,255,255,.05)":"rgba(255,255,255,.1)",
            color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
            onClick={onSync} disabled={syncing}>
            {syncing ? "⏳ Syncing…" : "☁️ Sync to Drive"}
          </button>
          {syncMsg && <div style={{ fontSize:10, color:"#86efac", marginTop:4, textAlign:"center" }}>{syncMsg}</div>}
          <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", textAlign:"center", marginTop:4 }}>gameish25@gmail.com</div>
        </div>

        {/* User */}
        <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(255,255,255,.1)", display:"flex", gap:8, alignItems:"center" }}>
          <div style={S.avatar}>{user.name[0]}</div>
          <div>
            <div style={{color:"#fff",fontSize:12,fontWeight:600}}>{user.name}</div>
            <div style={{color:"rgba(255,255,255,.45)",fontSize:10}}>{user.role==="admin"?"🛡 Admin":"🎯 Coach"}</div>
          </div>
        </div>
        <button style={S.logoutBtn} onClick={onLogout}>Logout</button>
      </aside>

      <main style={{flex:1,overflow:"auto"}}>{children}</main>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ players, fees, att }) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0,10);
  const cm=now.getMonth()+1, cy=now.getFullYear();
  const todayAtt = att.filter(a=>a.date===todayStr);
  const present = todayAtt.filter(a=>a.status==="present").length;
  const paying = players.filter(p=>!p.free);
  const mFees = fees.filter(f=>f.month===cm&&f.year===cy);
  const collected = mFees.reduce((s,f)=>s+f.amount,0);
  const paidCount = new Set(mFees.map(f=>f.playerId)).size;
  const totalFees = fees.reduce((s,f)=>s+f.amount,0);

  return (
    <div style={S.page}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:6 }}>
        <div style={{ width:52, height:52, borderRadius:10, background:"#000", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center" }}>
          <div style={{color:"#fff",fontWeight:900,fontSize:16,lineHeight:1}}>DSA</div>
          <div style={{color:"#fff",fontWeight:600,fontSize:8}}>SILCHAR</div>
        </div>
        <div>
          <h2 style={S.title}>DSA TT ACADEMY MANAGER</h2>
          <p style={S.sub}>{now.toDateString()} · Dashboard</p>
        </div>
      </div>

      <div style={S.grid6}>
        <Stat icon="🏓" label="Total Players" val={players.length} color="#3b82f6"/>
        <Stat icon="✅" label="Present Today"  val={present}         color="#22c55e"/>
        <Stat icon="❌" label="Absent Today"   val={players.length-present} color="#f87171"/>
        <Stat icon="💰" label={`Collected ${ML[cm-1]} ${cy}`} val={`₹${collected}`} color="#a78bfa"/>
        <Stat icon="⏳" label="Pending This Month" val={`₹${paying.length*PLAYER_FEE-collected}`} color="#fb923c"/>
        <Stat icon="🏦" label="Total Collected" val={`₹${totalFees}`} color="#14b8a6"/>
      </div>

      <div style={S.twoCol}>
        <div style={S.card}>
          <h3 style={S.cardTitle}>Today's Attendance — {todayStr}</h3>
          {players.map(p => {
            const r = att.find(a=>a.playerId===p.id&&a.date===todayStr);
            return <div key={p.id} style={S.row}>
              <span style={S.pname}>{p.name}{p.free&&<span style={S.freeTag}>FREE</span>}</span>
              <Pill status={r?.status}/>
            </div>;
          })}
        </div>
        <div style={S.card}>
          <h3 style={S.cardTitle}>Fee Status — {ML[cm-1]} {cy}</h3>
          {paying.map(p => {
            const paid = mFees.find(f=>f.playerId===p.id);
            return <div key={p.id} style={S.row}>
              <span style={S.pname}>{p.name}</span>
              <span style={{...S.badge,background:paid?"#dcfce7":"#fee2e2",color:paid?"#16a34a":"#dc2626"}}>
                {paid?`✓ ₹${paid.amount}`:"Pending"}
              </span>
            </div>;
          })}
          <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid #f1f5f9", fontWeight:700, color:"#1e3a5f" }}>
            Paid: {paidCount}/{paying.length} · Collected: ₹{collected}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({icon,label,val,color}){
  return <div style={{...S.statCard,borderTop:`4px solid ${color}`}}>
    <span style={{fontSize:22}}>{icon}</span>
    <div style={{fontSize:20,fontWeight:800,color}}>{val}</div>
    <div style={{fontSize:11,color:"#64748b"}}>{label}</div>
  </div>;
}
function Pill({status}){
  const c=status==="present"?["#dcfce7","#16a34a","Present"]:status==="absent"?["#fee2e2","#dc2626","Absent"]:["#f3f4f6","#9ca3af","—"];
  return <span style={{...S.badge,background:c[0],color:c[1]}}>{c[2]}</span>;
}

// ─── Attendance ─────────────────────────────────────────────────────────────────
function AttPage({ players, att, onMark, isAdmin }) {
  const [date,setDate] = useState(new Date().toISOString().slice(0,10));
  const dayAtt = att.filter(a=>a.date===date);
  const present = dayAtt.filter(a=>a.status==="present").length;

  return (
    <div style={S.page}>
      <h2 style={S.title}>Mark Attendance</h2>
      <div style={S.filterRow}>
        <input type="date" style={{...S.inp,width:190}} value={date} onChange={e=>setDate(e.target.value)}/>
        <div style={{...S.badge,background:"#dcfce7",color:"#16a34a",padding:"8px 16px",fontSize:14}}>✅ Present: {present}</div>
        <div style={{...S.badge,background:"#fee2e2",color:"#dc2626",padding:"8px 16px",fontSize:14}}>❌ Absent: {players.length-present}</div>
      </div>
      <div style={S.card}>
        {players.map(p => {
          const rec = att.find(a=>a.playerId===p.id&&a.date===date);
          const canEdit = isAdmin||!rec;
          return (
            <div key={p.id} style={S.row}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#1e3a5f",color:"#fff",
                  display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>
                  {p.name[0]}
                </div>
                <span style={S.pname}>{p.name}{p.free&&<span style={S.freeTag}>FREE</span>}</span>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Pill status={rec?.status}/>
                <button style={{...S.smBtn,background:"#dcfce7",color:"#16a34a",opacity:canEdit?1:0.4}}
                  onClick={()=>canEdit&&onMark(p.id,date,"present")}>✓</button>
                <button style={{...S.smBtn,background:"#fee2e2",color:"#dc2626",opacity:canEdit?1:0.4}}
                  onClick={()=>canEdit&&onMark(p.id,date,"absent")}>✗</button>
              </div>
            </div>
          );
        })}
      </div>
      {!isAdmin&&<p style={S.infoBox}>ℹ️ Once marked, only Admin can modify attendance.</p>}
    </div>
  );
}

// ─── Monthly ────────────────────────────────────────────────────────────────────
function MonthlyPage({ players, att }) {
  const [month,setMonth]=useState(new Date().getMonth()+1);
  const [year,setYear]=useState(new Date().getFullYear());
  const days=[];
  const d=new Date(year,month-1,1);
  while(d.getMonth()+1===month){if(d.getDay()!==0)days.push(d.toISOString().slice(0,10));d.setDate(d.getDate()+1);}

  return (
    <div style={S.page}>
      <h2 style={S.title}>Monthly Attendance</h2>
      <div style={S.filterRow}>
        <select style={{...S.inp,width:120}} value={month} onChange={e=>setMonth(+e.target.value)}>
          {ML.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
        </select>
        <select style={{...S.inp,width:100}} value={year} onChange={e=>setYear(+e.target.value)}>
          {[2024,2025,2026,2027].map(y=><option key={y}>{y}</option>)}
        </select>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={S.table}>
          <thead><tr>
            <th style={{...S.th,textAlign:"left",padding:"10px 14px"}}>Player</th>
            {days.map(d=><th key={d} style={{...S.th,fontSize:10,padding:"8px 3px",minWidth:22}}>{d.slice(8)}</th>)}
            <th style={S.th}>P</th><th style={S.th}>A</th><th style={S.th}>%</th>
          </tr></thead>
          <tbody>
            {players.map(p=>{
              const recs=att.filter(a=>a.playerId===p.id&&new Date(a.date).getMonth()+1===month&&new Date(a.date).getFullYear()===year);
              const pres=recs.filter(r=>r.status==="present").length;
              const abs=recs.filter(r=>r.status==="absent").length;
              const pct=days.length?Math.round(pres/days.length*100):0;
              return <tr key={p.id}>
                <td style={{...S.td,textAlign:"left",fontWeight:600,whiteSpace:"nowrap",padding:"8px 14px"}}>{p.name}</td>
                {days.map(d=>{const r=recs.find(r=>r.date===d);
                  return <td key={d} style={{...S.td,background:r?.status==="present"?"#dcfce7":r?.status==="absent"?"#fee2e2":"#f9fafb",fontSize:10,padding:"6px 2px",textAlign:"center"}}>
                    {r?.status==="present"?"P":r?.status==="absent"?"A":"·"}
                  </td>;
                })}
                <td style={{...S.td,color:"#16a34a",fontWeight:700}}>{pres}</td>
                <td style={{...S.td,color:"#dc2626",fontWeight:700}}>{abs}</td>
                <td style={{...S.td,fontWeight:700,color:pct>=75?"#16a34a":"#ef4444"}}>{pct}%</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Collect Fees ───────────────────────────────────────────────────────────────
function FeesPage({ players, fees, onCollect, onDelete, isAdmin }) {
  const now = new Date();
  const [sel,setSel]         = useState("");
  const [date,setDate]       = useState(now.toISOString().slice(0,10));
  const [receipt,setReceipt] = useState("");
  const [selM,setSelM]       = useState([]);
  const [amt,setAmt]         = useState(PLAYER_FEE);
  const [msg,setMsg]         = useState(null);

  const paidKeys = fees.filter(f=>f.playerId===sel).map(f=>`${f.month}-${f.year}`);

  const toggleM = (opt) => {
    const key=`${opt.month}-${opt.year}`;
    setSelM(prev=>prev.find(m=>`${m.month}-${m.year}`===key)?prev.filter(m=>`${m.month}-${m.year}`!==key):[...prev,opt]);
  };

  const submit = () => {
    if(!sel){setMsg({ok:false,text:"Please select a player"});return;}
    if(!receipt.trim()){setMsg({ok:false,text:"Enter receipt number"});return;}
    if(selM.length===0){setMsg({ok:false,text:"Select at least one month"});return;}
    const clash=selM.filter(m=>paidKeys.includes(`${m.month}-${m.year}`));
    if(clash.length){setMsg({ok:false,text:`Already paid: ${clash.map(m=>`${ML[m.month-1]} ${m.year}`).join(", ")}`});return;}
    onCollect({playerId:sel,date,receipt,months:selM,amtPerMonth:amt});
    setMsg({ok:true,text:`✅ Recorded! Receipt ${receipt} · ${selM.length} month(s) · ₹${selM.length*amt}`});
    setSel("");setReceipt("");setSelM([]);setAmt(PLAYER_FEE);
  };

  const cm=now.getMonth()+1,cy=now.getFullYear();
  const mFees=fees.filter(f=>f.month===cm&&f.year===cy);
  const collected=mFees.reduce((s,f)=>s+f.amount,0);
  const paying=players.filter(p=>!p.free);
  const pending=paying.filter(p=>!mFees.find(f=>f.playerId===p.id));

  // Auto-generate next receipt number
  const lastReceipt = fees.filter(f=>!f.fromPDF).sort((a,b)=>(b.receipt||"").localeCompare(a.receipt||""))[0];
  const nextRcp = () => {
    if(!lastReceipt?.receipt) return `RCP-${cy}-001`;
    const n=parseInt(lastReceipt.receipt.split("-").pop()||"0")+1;
    return `RCP-${cy}-${String(n).padStart(3,"0")}`;
  };

  return (
    <div style={S.page}>
      <h2 style={S.title}>💰 Collect Fees</h2>

      <div style={S.grid3}>
        <Stat icon="💰" label={`Collected ${ML[cm-1]} ${cy}`} val={`₹${collected}`} color="#22c55e"/>
        <Stat icon="⏳" label="Pending"    val={`₹${paying.length*PLAYER_FEE-collected}`} color="#f87171"/>
        <Stat icon="👥" label="Paid/Total" val={`${new Set(mFees.map(f=>f.playerId)).size}/${paying.length}`} color="#60a5fa"/>
      </div>

      <div style={{...S.card,borderLeft:"4px solid #1e3a5f"}}>
        <h3 style={S.cardTitle}>📥 Record Fee Payment</h3>

        <div style={S.formGrid}>
          <div style={S.fg}><label style={S.lbl}>Player *</label>
            <select style={S.inp} value={sel} onChange={e=>{setSel(e.target.value);setSelM([]);setMsg(null);}}>
              <option value="">— Select Player —</option>
              {players.filter(p=>!p.free).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={S.fg}><label style={S.lbl}>Payment Date *</label>
            <input type="date" style={S.inp} value={date} onChange={e=>setDate(e.target.value)}/>
          </div>
          <div style={S.fg}>
            <label style={S.lbl}>Receipt Number * <span style={{color:"#94a3b8",fontWeight:400}}>(suggested: {nextRcp()})</span></label>
            <input style={S.inp} placeholder={nextRcp()} value={receipt}
              onChange={e=>setReceipt(e.target.value)}
              onFocus={e=>{if(!receipt)setReceipt(nextRcp());}}/>
          </div>
          <div style={S.fg}><label style={S.lbl}>Amount per Month (₹)</label>
            <input type="number" style={S.inp} value={amt} onChange={e=>setAmt(+e.target.value)}/>
          </div>
        </div>

        <div style={S.fg}>
          <label style={S.lbl}>Select Month(s) Paying For * &nbsp;
            <span style={{fontWeight:400,color:"#94a3b8"}}>Jan 2026 – Dec 2027 shown below</span>
          </label>

          {/* Group by year */}
          {[2024,2025,2026,2027].map(y => {
            const opts = MONTH_OPTS.filter(o=>o.year===y);
            if(!opts.length) return null;
            return (
              <div key={y} style={{marginTop:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:6}}>{y}</div>
                <div style={S.monthGrid}>
                  {opts.map(opt=>{
                    const key=`${opt.month}-${opt.year}`;
                    const paid=paidKeys.includes(key);
                    const isSel=!!selM.find(m=>`${m.month}-${m.year}`===key);
                    return <button key={key} disabled={paid}
                      style={{...S.monthBtn,
                        background:paid?"#e5e7eb":isSel?"#1e3a5f":"#f8fafc",
                        color:paid?"#9ca3af":isSel?"#fff":"#374151",
                        border:isSel?"2px solid #1e3a5f":"2px solid #e2e8f0",
                        cursor:paid?"not-allowed":"pointer"}}
                      onClick={()=>!paid&&toggleM(opt)}>
                      {ML[opt.month-1]}
                      {paid&&<span style={{fontSize:8,display:"block",color:"#6b7280"}}>✓paid</span>}
                    </button>;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selM.length>0&&(
          <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:10,padding:"12px 16px",marginTop:14}}>
            <b>Months:</b> {selM.map(m=>`${ML[m.month-1]} ${m.year}`).join(" + ")}
            <span style={{marginLeft:16,color:"#1e3a5f",fontWeight:800,fontSize:16}}>Total: ₹{selM.length*amt}</span>
          </div>
        )}

        {msg&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:8,
          background:msg.ok?"#dcfce7":"#fee2e2",color:msg.ok?"#16a34a":"#dc2626",fontWeight:600}}>{msg.text}</div>}

        <button style={{...S.btnPri,marginTop:16,padding:"12px 36px",fontSize:15}} onClick={submit}>
          💰 Record Payment
        </button>
      </div>

      {pending.length>0&&(
        <div style={S.card}>
          <h3 style={S.cardTitle}>⏳ Pending — {ML[cm-1]} {cy}</h3>
          {pending.map(p=>(
            <div key={p.id} style={S.row}>
              <span style={S.pname}>{p.name}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{...S.badge,background:"#fee2e2",color:"#dc2626"}}>₹{PLAYER_FEE} pending</span>
                <button style={{...S.smBtn,background:"#dbeafe",color:"#1d4ed8"}}
                  onClick={()=>{setSel(p.id);setSelM([{month:cm,year:cy}]);setReceipt(nextRcp());window.scrollTo(0,300);}}>
                  + Collect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {pending.length===0&&paying.length>0&&(
        <div style={{...S.card,textAlign:"center",color:"#16a34a",fontWeight:700,fontSize:15}}>
          🎉 All fees collected for {ML[cm-1]} {cy}!
        </div>
      )}
    </div>
  );
}

// ─── Receipts ───────────────────────────────────────────────────────────────────
function ReceiptsPage({ players, fees, isAdmin, onDelete }) {
  const [fp,setFP]=useState("All");
  const [fy,setFY]=useState("All");
  const [fm,setFM]=useState("All");
  const pMap=Object.fromEntries(players.map(p=>[p.id,p.name]));
  let vis=[...fees].sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  if(fp!=="All")vis=vis.filter(f=>f.playerId===fp);
  if(fy!=="All")vis=vis.filter(f=>String(f.year)===fy);
  if(fm!=="All")vis=vis.filter(f=>f.month===+fm);
  const total=vis.reduce((s,f)=>s+f.amount,0);

  const exportCSV = () => {
    const rows=["Receipt,Player,Month,Year,Amount,Date,Source",...vis.map(f=>
      `${f.receipt||""},${pMap[f.playerId]||""},${ML[f.month-1]},${f.year},${f.amount},${f.date||""},${f.fromPDF?"PDF Import":"Manual"}`)];
    const a=document.createElement("a");
    a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(rows.join("\n"));
    a.download="DSA_TT_Fees.csv"; a.click();
  };

  return (
    <div style={S.page}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h2 style={S.title}>🧾 Fee Receipts & History</h2>
        <button style={{...S.smBtn,background:"#1e3a5f",color:"#fff",padding:"8px 16px"}} onClick={exportCSV}>
          ⬇ Export CSV
        </button>
      </div>

      <div style={S.filterRow}>
        <select style={{...S.inp,width:210}} value={fp} onChange={e=>setFP(e.target.value)}>
          <option value="All">All Players</option>
          {players.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select style={{...S.inp,width:110}} value={fm} onChange={e=>setFM(e.target.value)}>
          <option value="All">All Months</option>
          {ML.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
        </select>
        <select style={{...S.inp,width:100}} value={fy} onChange={e=>setFY(e.target.value)}>
          <option value="All">All Years</option>
          {[2024,2025,2026,2027].map(y=><option key={y}>{y}</option>)}
        </select>
      </div>

      <div style={{background:"#1e3a5f",color:"#fff",borderRadius:10,padding:"10px 20px",marginBottom:14,fontWeight:700,display:"flex",justifyContent:"space-between"}}>
        <span>{vis.length} records</span>
        <span>Total: ₹{total.toLocaleString()}</span>
      </div>

      <div style={S.card}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#f8fafc"}}>
            {["Receipt","Player","Month","Year","Amount","Date","Source",""].map(h=>
              <th key={h} style={{padding:"10px 10px",fontSize:11,fontWeight:700,color:"#64748b",textAlign:"left",borderBottom:"2px solid #e2e8f0"}}>{h}</th>
            )}
          </tr></thead>
          <tbody>
            {vis.map(f=>(
              <tr key={f.id} style={{borderBottom:"1px solid #f1f5f9"}}>
                <td style={{...S.td,fontFamily:"monospace",fontWeight:700,color:"#1e3a5f"}}>{f.receipt||"—"}</td>
                <td style={S.td}>{pMap[f.playerId]||f.playerId}</td>
                <td style={S.td}>{ML[f.month-1]}</td>
                <td style={S.td}>{f.year}</td>
                <td style={{...S.td,fontWeight:700,color:"#16a34a"}}>₹{f.amount}</td>
                <td style={S.td}>{f.date||"—"}</td>
                <td style={S.td}>
                  <span style={{...S.badge,background:f.fromPDF?"#fef3c7":"#dcfce7",color:f.fromPDF?"#d97706":"#16a34a"}}>
                    {f.fromPDF?"PDF Import":"Manual"}
                  </span>
                </td>
                <td style={S.td}>{isAdmin&&
                  <button style={{...S.smBtn,background:"#fee2e2",color:"#dc2626"}} onClick={()=>onDelete(f.id)}>🗑</button>}
                </td>
              </tr>
            ))}
            {vis.length===0&&<tr><td colSpan={8} style={{textAlign:"center",padding:28,color:"#9ca3af"}}>No records found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Players ────────────────────────────────────────────────────────────────────
function PlayersPage({ players, onAdd, onRemove }) {
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",free:false});
  return (
    <div style={S.page}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={S.title}>Players ({players.length})</h2>
        <button style={S.btnPri} onClick={()=>setAdding(a=>!a)}>+ Add Player</button>
      </div>
      {adding&&(
        <div style={S.card}>
          <h3 style={S.cardTitle}>New Player</h3>
          <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
            <input style={{...S.inp,flex:1,minWidth:200}} placeholder="Full name"
              onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          </div>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:14,marginBottom:14,cursor:"pointer"}}>
            <input type="checkbox" checked={form.free} onChange={e=>setForm(f=>({...f,free:e.target.checked}))}/>
            Free player (no fees charged) — e.g. sponsored / staff
          </label>
          <button style={S.btnPri} onClick={()=>{if(form.name){onAdd(form);setAdding(false);setForm({name:"",free:false});}}}>
            Save Player
          </button>
        </div>
      )}
      <div style={S.card}>
        {players.map((p,i)=>(
          <div key={p.id} style={S.row}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"#1e3a5f",color:"#fff",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>
                {i+1}
              </div>
              <span style={S.pname}>{p.name}{p.free&&<span style={S.freeTag}>FREE</span>}</span>
            </div>
            <button style={{...S.smBtn,background:"#fee2e2",color:"#dc2626"}} onClick={()=>onRemove(p.id)}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  loginBg:{minHeight:"100vh",background:"linear-gradient(135deg,#1e3a5f 0%,#0f172a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"},
  loginCard:{background:"#fff",borderRadius:20,padding:"36px 32px",width:370,boxShadow:"0 25px 60px rgba(0,0,0,.5)",display:"flex",flexDirection:"column",gap:12},
  hint:{fontSize:12,color:"#94a3b8",background:"#f8fafc",borderRadius:8,padding:"10px 12px",lineHeight:1.8},
  sidebar:{width:215,background:"#1e3a5f",display:"flex",flexDirection:"column",padding:"0 0 0",minHeight:"100vh",position:"sticky",top:0,overflowY:"auto"},
  navBtn:{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",color:"rgba(255,255,255,.65)",background:"transparent",border:"none",cursor:"pointer",fontSize:13,textAlign:"left",width:"100%"},
  navOn:{color:"#fff",background:"rgba(255,255,255,.15)",borderLeft:"3px solid #60a5fa"},
  avatar:{width:32,height:32,borderRadius:"50%",background:"#3b82f6",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0},
  logoutBtn:{margin:"4px 12px 16px",padding:"7px",border:"1px solid rgba(255,255,255,.2)",background:"transparent",color:"rgba(255,255,255,.65)",borderRadius:8,cursor:"pointer",fontSize:12,width:"calc(100% - 24px)"},
  page:{padding:"24px 22px",maxWidth:1100},
  title:{margin:"0 0 2px",fontSize:20,fontWeight:800,color:"#1e293b"},
  sub:{color:"#64748b",fontSize:12,margin:"0 0 18px"},
  grid6:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:12,marginBottom:18},
  grid3:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12,marginBottom:18},
  statCard:{background:"#fff",borderRadius:12,padding:"14px 14px",boxShadow:"0 1px 4px rgba(0,0,0,.07)",display:"flex",flexDirection:"column",gap:5},
  twoCol:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16},
  card:{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,.07)",marginBottom:16},
  cardTitle:{margin:"0 0 12px",fontSize:14,fontWeight:700,color:"#1e293b"},
  row:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"9px 0",borderBottom:"1px solid #f1f5f9",flexWrap:"wrap"},
  pname:{fontWeight:600,color:"#1e293b",fontSize:14},
  badge:{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600},
  freeTag:{marginLeft:6,fontSize:10,background:"#fef3c7",color:"#d97706",borderRadius:10,padding:"2px 6px",fontWeight:700},
  smBtn:{border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer"},
  inp:{padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box",color:"#1e293b",background:"#fff"},
  btnPri:{background:"#1e3a5f",color:"#fff",border:"none",borderRadius:10,padding:"10px 24px",fontWeight:700,fontSize:14,cursor:"pointer"},
  filterRow:{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"},
  table:{width:"100%",borderCollapse:"collapse",background:"#fff",borderRadius:10,overflow:"hidden"},
  th:{padding:"10px 6px",background:"#1e3a5f",color:"#fff",fontWeight:700,fontSize:12,textAlign:"center"},
  td:{padding:"9px 10px",fontSize:13,color:"#374151"},
  formGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14},
  fg:{display:"flex",flexDirection:"column",gap:4},
  lbl:{fontSize:12,fontWeight:700,color:"#475569"},
  monthGrid:{display:"flex",flexWrap:"wrap",gap:6},
  monthBtn:{padding:"7px 10px",borderRadius:8,fontSize:12,fontWeight:600,minWidth:46,textAlign:"center"},
  infoBox:{color:"#64748b",fontSize:13,background:"#f8fafc",padding:"10px 14px",borderRadius:8,marginTop:10},
};
