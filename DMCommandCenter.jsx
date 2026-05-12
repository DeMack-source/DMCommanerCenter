// DM COMMAND CENTER v2.0 — MVP
// Architecture: modular (see /src/* for individual module files)
// This file is the composed entry point for artifact deployment.

import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  bg: { primary: "#020810", card: "rgba(8,20,35,0.85)", overlay: "rgba(0,0,0,0.9)", glass: "rgba(4,12,24,0.7)" },
  text: { primary: "#e8f4ff", secondary: "#7a9ab0", muted: "#2a4a5a", accent: "#00e5ff" },
  border: { subtle: "rgba(0,229,255,0.07)", normal: "rgba(0,229,255,0.18)", strong: "rgba(0,229,255,0.4)" },
  zones: {
    all:    { accent: "#7a9ab0", dim: "#1a2a35" },
    dev:    { accent: "#00e5ff", dim: "#00252e" },
    social: { accent: "#ff6b35", dim: "#3a1500" },
    art:    { accent: "#c77dff", dim: "#200840" },
    media:  { accent: "#ffd60a", dim: "#2a2000" },
    ops:    { accent: "#39ff14", dim: "#062006" },
  },
  priority: { high: "#ff4444", medium: "#ffd60a", low: "#39ff14" },
  font: { display: "'Share Tech Mono', 'Courier New', monospace", ui: "'Rajdhani', 'Arial Narrow', sans-serif" },
  radius: { sm: "5px", md: "10px", lg: "14px", xl: "20px" },
  glow: (c, i = 0.3) => `0 0 20px ${c}${Math.round(i*255).toString(16).padStart(2,"0")}`,
  trans: { fast: "all 0.15s ease", spring: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════════════════════

const SEED_ZONES = [
  { id:"dev",    label:"DEV / BUILD",        glyph:"◈", accent:"#00e5ff", dim:"#00252e", order:0 },
  { id:"social", label:"SOCIAL / BROADCAST", glyph:"◉", accent:"#ff6b35", dim:"#3a1500", order:1 },
  { id:"art",    label:"ART / STUDIO",        glyph:"◬", accent:"#c77dff", dim:"#200840", order:2 },
  { id:"media",  label:"MEDIA / PERFORM",     glyph:"◎", accent:"#ffd60a", dim:"#2a2000", order:3 },
  { id:"ops",    label:"OPS / INTEL",         glyph:"◇", accent:"#39ff14", dim:"#062006", order:4 },
];

const SEED_APPS = [
  { id:"dev-1", zoneId:"dev", name:"VS Code Web",   icon:"🖥",  url:"https://vscode.dev",                                     pinned:false, order:0 },
  { id:"dev-2", zoneId:"dev", name:"GitHub",        icon:"🐙",  url:"https://github.com/demack-source",                       pinned:true,  order:1 },
  { id:"dev-3", zoneId:"dev", name:"Replit",        icon:"⚡",  url:"https://replit.com",                                     pinned:false, order:2 },
  { id:"dev-4", zoneId:"dev", name:"CodeSandbox",   icon:"📦",  url:"https://codesandbox.io",                                 pinned:false, order:3 },
  { id:"dev-5", zoneId:"dev", name:"StackBlitz",    icon:"🔷",  url:"https://stackblitz.com",                                 pinned:false, order:4 },
  { id:"dev-6", zoneId:"dev", name:"Claude AI",     icon:"🤖",  url:"https://claude.ai",                                      pinned:true,  order:5 },
  { id:"dev-7", zoneId:"dev", name:"Vercel",        icon:"▲",   url:"https://vercel.com",                                     pinned:false, order:6 },
  { id:"dev-8", zoneId:"dev", name:"2nd Chance",    icon:"⚖️",  url:"https://demack-source.github.io/Second-Chance-Manual-/", pinned:true,  order:7 },
  { id:"soc-1", zoneId:"social", name:"Instagram",  icon:"📸",  url:"https://instagram.com",  pinned:true,  order:0 },
  { id:"soc-2", zoneId:"social", name:"TikTok",     icon:"🎵",  url:"https://tiktok.com",     pinned:true,  order:1 },
  { id:"soc-3", zoneId:"social", name:"X / Twitter",icon:"✖",   url:"https://x.com",          pinned:false, order:2 },
  { id:"soc-4", zoneId:"social", name:"Facebook",   icon:"👥",  url:"https://facebook.com",   pinned:false, order:3 },
  { id:"soc-5", zoneId:"social", name:"LinkedIn",   icon:"💼",  url:"https://linkedin.com",   pinned:false, order:4 },
  { id:"soc-6", zoneId:"social", name:"YouTube",    icon:"▶️",  url:"https://youtube.com",    pinned:true,  order:5 },
  { id:"soc-7", zoneId:"social", name:"Pinterest",  icon:"📌",  url:"https://pinterest.com",  pinned:false, order:6 },
  { id:"soc-8", zoneId:"social", name:"Buffer",     icon:"📡",  url:"https://buffer.com",     pinned:false, order:7 },
  { id:"art-1", zoneId:"art", name:"Canva",         icon:"🎨",  url:"https://canva.com",              pinned:true,  order:0 },
  { id:"art-2", zoneId:"art", name:"Adobe Express", icon:"✨",  url:"https://express.adobe.com",      pinned:false, order:1 },
  { id:"art-3", zoneId:"art", name:"Picsart",       icon:"🖌",  url:"https://picsart.com",            pinned:false, order:2 },
  { id:"art-4", zoneId:"art", name:"CapCut",        icon:"🎬",  url:"https://capcut.com",             pinned:true,  order:3 },
  { id:"art-5", zoneId:"art", name:"Procreate Ref", icon:"🖼",  url:"https://procreate.com",          pinned:false, order:4 },
  { id:"art-6", zoneId:"art", name:"Coolors",       icon:"🎭",  url:"https://coolors.co",             pinned:false, order:5 },
  { id:"art-7", zoneId:"art", name:"Behance",       icon:"🏛",  url:"https://behance.net",            pinned:false, order:6 },
  { id:"art-8", zoneId:"art", name:"Dribbble",      icon:"🏀",  url:"https://dribbble.com",           pinned:false, order:7 },
  { id:"med-1", zoneId:"media", name:"Spotify",     icon:"🎧",  url:"https://open.spotify.com",       pinned:true,  order:0 },
  { id:"med-2", zoneId:"media", name:"Netflix",     icon:"🎬",  url:"https://netflix.com",            pinned:true,  order:1 },
  { id:"med-3", zoneId:"media", name:"Prime Video", icon:"🛸",  url:"https://primevideo.com",         pinned:false, order:2 },
  { id:"med-4", zoneId:"media", name:"SoundCloud",  icon:"☁️",  url:"https://soundcloud.com",         pinned:false, order:3 },
  { id:"med-5", zoneId:"media", name:"Tidal",       icon:"🌊",  url:"https://tidal.com",             pinned:false, order:4 },
  { id:"med-6", zoneId:"media", name:"BeatStars",   icon:"🥁",  url:"https://beatstars.com",         pinned:false, order:5 },
  { id:"med-7", zoneId:"media", name:"Filmora",     icon:"🎞",  url:"https://filmora.wondershare.com",pinned:false, order:6 },
  { id:"med-8", zoneId:"media", name:"Looperman",   icon:"🔁",  url:"https://looperman.com",         pinned:false, order:7 },
  { id:"ops-1", zoneId:"ops", name:"Gmail",         icon:"✉️",  url:"https://mail.google.com",        pinned:true,  order:0 },
  { id:"ops-2", zoneId:"ops", name:"Drive",         icon:"💾",  url:"https://drive.google.com",       pinned:false, order:1 },
  { id:"ops-3", zoneId:"ops", name:"Calendar",      icon:"📅",  url:"https://calendar.google.com",    pinned:true,  order:2 },
  { id:"ops-4", zoneId:"ops", name:"Canvas LMS",    icon:"🎓",  url:"https://canvas.instructure.com", pinned:false, order:3 },
  { id:"ops-5", zoneId:"ops", name:"Notion",        icon:"📒",  url:"https://notion.so",              pinned:false, order:4 },
  { id:"ops-6", zoneId:"ops", name:"Docs",          icon:"📄",  url:"https://docs.google.com",        pinned:false, order:5 },
  { id:"ops-7", zoneId:"ops", name:"ChatGPT",       icon:"💬",  url:"https://chatgpt.com",            pinned:false, order:6 },
  { id:"ops-8", zoneId:"ops", name:"Perplexity",    icon:"🔭",  url:"https://perplexity.ai",          pinned:false, order:7 },
];

const SEED_TASKS = [
  { id:"t-1", title:"Finish Miami-Dade county page",   completed:false, priority:"high",   createdAt:new Date().toISOString(), completedAt:null },
  { id:"t-2", title:"Wire dashboard county selector",  completed:false, priority:"high",   createdAt:new Date().toISOString(), completedAt:null },
  { id:"t-3", title:"Post new art piece to Instagram", completed:false, priority:"medium", createdAt:new Date().toISOString(), completedAt:null },
  { id:"t-4", title:"Review BUS class module 6",       completed:false, priority:"medium", createdAt:new Date().toISOString(), completedAt:null },
];

const SEED_NOTES = [
  { id:"n-1", title:"Welcome", content:"DM Command Center is live. Drop ideas, lyrics, code snippets, build plans — anything.", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
];

const QUOTES = [
  "Build the vision. Own the outcome.",
  "The rough ashlar becomes the perfect stone.",
  "Knowledge is the only property they can't confiscate.",
  "Second chances are first moves in disguise.",
  "Every frequency carries a signal. You are the signal.",
  "Art is the blueprint of the soul made visible.",
  "The code is the canvas. The canvas is the code.",
  "From the inside out — architect everything.",
];

const DEFAULT_SETTINGS = { kioskMode:false, denseMode:false, scanlines:true, gridOverlay:true, userName:"DEVYN", sector:"BROWARD FL", version:"v2.0" };

// ═══════════════════════════════════════════════════════════════════════════════
// PERSISTENCE LAYER (localStorage)
// ═══════════════════════════════════════════════════════════════════════════════

const NS = "dm_cc_";
const lsGet = (key, fallback) => { try { const r = localStorage.getItem(NS+key); return r ? JSON.parse(r) : fallback; } catch { return fallback; } };
const lsSet = (key, val) => { try { localStorage.setItem(NS+key, JSON.stringify(val)); } catch {} };
const lsDel = (key) => localStorage.removeItem(NS+key);

const DB = {
  zones:    { get: () => lsGet("zones", SEED_ZONES),    save: v => lsSet("zones", v) },
  apps:     { get: () => lsGet("apps", SEED_APPS),      save: v => lsSet("apps", v) },
  notes:    { get: () => lsGet("notes", SEED_NOTES),    save: v => lsSet("notes", v) },
  tasks:    { get: () => lsGet("tasks", SEED_TASKS),    save: v => lsSet("tasks", v) },
  recent:   { get: () => lsGet("recent", []),           save: v => lsSet("recent", v) },
  settings: { get: () => lsGet("settings", DEFAULT_SETTINGS), save: v => lsSet("settings", v) },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════

function HudCard({ accent=T.text.accent, dim=T.bg.card, children, style, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      position:"relative", background:dim, border:`1px solid ${hov&&onClick?accent+"55":accent+"1a"}`,
      borderRadius:T.radius.lg, padding:"14px 16px", overflow:"hidden",
      cursor:onClick?"pointer":undefined, transition:T.trans.fast, ...style,
    }}>
      <span style={{position:"absolute",top:5,left:5,width:9,height:9,borderTop:`1px solid ${accent}55`,borderLeft:`1px solid ${accent}55`}}/>
      <span style={{position:"absolute",bottom:5,right:5,width:9,height:9,borderBottom:`1px solid ${accent}55`,borderRight:`1px solid ${accent}55`}}/>
      {children}
    </div>
  );
}

function Modal({ title, accent=T.text.accent, onClose, children, maxWidth="480px" }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,background:T.bg.overlay,display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:1000,
      padding:"16px",boxSizing:"border-box",backdropFilter:"blur(8px)",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"linear-gradient(160deg,#06101a,#030c14)",
        border:`1px solid ${accent}44`,borderRadius:T.radius.xl,
        padding:"20px",width:"100%",maxWidth,
        boxShadow:`${T.glow(accent,0.1)},0 32px 80px rgba(0,0,0,0.95)`,
        maxHeight:"88vh",overflowY:"auto",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <span style={{fontFamily:T.font.display,color:accent,fontSize:"12px",letterSpacing:"0.1em",textShadow:T.glow(accent,0.5)}}>{title}</span>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${accent}44`,borderRadius:T.radius.sm,color:accent,fontSize:"16px",cursor:"pointer",width:"26px",height:"26px",fontFamily:"monospace",lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ glyph, label, accent, count, action }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"8px",paddingBottom:"10px",borderBottom:`1px solid ${accent}18`,marginBottom:"12px"}}>
      <span style={{fontFamily:T.font.display,fontSize:"15px",color:accent,textShadow:T.glow(accent,0.4)}}>{glyph}</span>
      <span style={{fontFamily:T.font.ui,fontWeight:700,fontSize:"clamp(10px,2.5vw,13px)",color:accent,letterSpacing:"0.2em"}}>{label}</span>
      <div style={{flex:1,height:"1px",background:`linear-gradient(90deg,${accent}33,transparent)`}}/>
      {count!==undefined&&<span style={{fontFamily:T.font.display,fontSize:"8px",color:accent+"55",letterSpacing:"0.2em"}}>{count} NODES</span>}
      {action&&<button onClick={action.onClick} style={{background:"transparent",border:`1px solid ${accent}44`,borderRadius:T.radius.sm,padding:"2px 9px",color:accent,fontFamily:T.font.ui,fontSize:"9px",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer"}}>{action.label}</button>}
    </div>
  );
}

function HudBtn({ onClick, accent=T.text.accent, dim="transparent", children, full, sm, style }) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background:hov?`${dim}ee`:`linear-gradient(135deg,${dim}cc,${dim}44)`,
      border:`1px solid ${hov?accent:accent+"55"}`,borderRadius:T.radius.md,
      color:accent,fontFamily:T.font.ui,fontSize:sm?"9px":"11px",fontWeight:700,
      letterSpacing:"0.15em",cursor:"pointer",padding:sm?"4px 10px":"9px 16px",
      width:full?"100%":undefined,transition:T.trans.fast,...style,
    }}>{children}</button>
  );
}

function HudInput({ value, onChange, placeholder, accent=T.text.accent, multiline, rows=4, autoFocus, style }) {
  const shared = {
    width:"100%",background:"#030a12",border:`1px solid ${accent}33`,borderRadius:T.radius.md,
    color:T.text.primary,fontFamily:T.font.display,fontSize:"11px",lineHeight:1.6,
    padding:"9px 12px",outline:"none",resize:multiline?"vertical":undefined,
    boxSizing:"border-box",...style,
  };
  return multiline
    ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} autoFocus={autoFocus} style={shared}/>
    : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} style={shared}/>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOCK
// ═══════════════════════════════════════════════════════════════════════════════

function Clock({ userName }) {
  const [now, setNow] = useState(new Date());
  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(id); },[]);
  const pad = n => String(n).padStart(2,"0");
  const h = now.getHours();
  const greeting = h<12?"GOOD MORNING":h<17?"GOOD AFTERNOON":"GOOD EVENING";
  const dateStr = now.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric",year:"numeric"});
  return (
    <div style={{textAlign:"center"}}>
      <div style={{fontFamily:T.font.ui,fontSize:"9px",letterSpacing:"0.45em",color:T.zones.ops.accent,marginBottom:"4px",opacity:0.85}}>{greeting}, {userName}</div>
      <div style={{fontFamily:T.font.display,fontSize:"clamp(46px,11vw,88px)",fontWeight:400,color:T.text.primary,lineHeight:1,letterSpacing:"0.05em",textShadow:`0 0 40px ${T.zones.dev.accent}44,0 0 80px ${T.zones.dev.accent}18`}}>
        {pad(h)}<span style={{color:T.zones.dev.accent,animation:"blink 1s step-end infinite"}}>:</span>{pad(now.getMinutes())}
        <span style={{fontSize:"0.35em",color:T.text.muted,marginLeft:"8px"}}>{pad(now.getSeconds())}</span>
      </div>
      <div style={{fontFamily:T.font.ui,fontSize:"clamp(9px,2vw,12px)",color:T.text.muted,letterSpacing:"0.25em",marginTop:"6px",textTransform:"uppercase"}}>{dateStr}</div>
    </div>
  );
}

function QuoteTicker() {
  const [idx,setIdx]=useState(0); const [vis,setVis]=useState(true);
  useEffect(()=>{
    const id=setInterval(()=>{ setVis(false); setTimeout(()=>{ setIdx(i=>(i+1)%QUOTES.length); setVis(true); },400); },7000);
    return ()=>clearInterval(id);
  },[]);
  return <div style={{fontFamily:T.font.display,fontSize:"clamp(9px,2vw,11px)",color:"#1a5a44",letterSpacing:"0.08em",textAlign:"center",padding:"8px 0 0",opacity:vis?1:0,transition:"opacity 0.4s ease",minHeight:"20px"}}>// {QUOTES[idx]}</div>;
}

function HudStats({ zoneLabel, appCount, pendingTasks, settings }) {
  return (
    <div style={{display:"flex",gap:"clamp(10px,3vw,24px)",justifyContent:"center",padding:"12px 0 0",flexWrap:"wrap"}}>
      {[["ZONE",zoneLabel],["APPS",appCount],["TASKS",pendingTasks],["SECTOR",settings.sector],["BUILD",settings.version]].map(([l,v])=>(
        <div key={l} style={{textAlign:"center"}}>
          <div style={{fontFamily:T.font.display,fontSize:"7px",color:T.text.muted,letterSpacing:"0.35em"}}>{l}</div>
          <div style={{fontFamily:T.font.ui,fontSize:"clamp(10px,2.5vw,13px)",fontWeight:700,color:T.text.accent,letterSpacing:"0.08em"}}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE NAV
// ═══════════════════════════════════════════════════════════════════════════════

function ZoneNav({ zones, activeId, onSelect }) {
  return (
    <nav style={{display:"flex",gap:"5px",justifyContent:"center",flexWrap:"wrap",padding:"16px 0 0"}}>
      {[{id:"all",label:"ALL",glyph:"◈",accent:T.text.secondary,dim:"#1a2a35"},...zones].map(z=>{
        const active = activeId===z.id;
        return (
          <button key={z.id} onClick={()=>onSelect(z.id)} aria-pressed={active} style={{
            background:active?`${z.dim}dd`:"transparent",
            border:`1px solid ${active?z.accent:T.border.subtle}`,
            borderRadius:T.radius.sm,padding:"5px 11px",
            fontFamily:T.font.ui,fontSize:"clamp(8px,2vw,10px)",fontWeight:700,
            letterSpacing:"0.15em",color:active?z.accent:T.text.muted,
            cursor:"pointer",transition:T.trans.fast,
            boxShadow:active?T.glow(z.accent,0.1):"none",
            display:"flex",alignItems:"center",gap:"4px",
          }}>
            <span style={{fontSize:"10px"}}>{z.glyph}</span>{z.label.split(" / ")[0]}
          </button>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP TILE + ZONE PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function AppTile({ app, zone, onOpen, onPin, onDelete, idx=0, dense }) {
  const [pressed,setPressed]=useState(false);
  const [mounted,setMounted]=useState(false);
  const [menu,setMenu]=useState(false);
  const pressTimer = useRef(null);

  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),idx*30); return ()=>clearTimeout(t); },[idx]);

  const handlePD = () => { pressTimer.current=setTimeout(()=>setMenu(true),550); };
  const handlePU = () => { clearTimeout(pressTimer.current); setPressed(false); if(!menu) onOpen(app); };

  return (
    <div style={{position:"relative"}}>
      <button
        onPointerDown={()=>{ setPressed(true); handlePD(); }}
        onPointerUp={handlePU}
        onPointerLeave={()=>{ clearTimeout(pressTimer.current); setPressed(false); }}
        aria-label={`Open ${app.name}`}
        style={{
          background:pressed?`${zone.dim}ff`:`linear-gradient(135deg,${zone.dim}cc,${zone.dim}66)`,
          border:`1px solid ${pressed?zone.accent:zone.accent+"30"}`,
          borderRadius:T.radius.md,
          padding:dense?"10px 4px":"clamp(10px,2.5vw,15px) 5px",
          cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:dense?"4px":"6px",
          width:"100%",minHeight:dense?"66px":"78px",
          transform:pressed?"scale(0.92)":mounted?"scale(1)":"scale(0.8)",
          opacity:mounted?1:0,transition:T.trans.spring,
          boxShadow:pressed?`0 0 16px ${zone.accent}55,inset 0 0 8px ${zone.accent}18`:"0 4px 12px rgba(0,0,0,0.5)",
          position:"relative",overflow:"hidden",
        }}
      >
        <span style={{position:"absolute",top:3,left:3,width:7,height:7,borderTop:`1px solid ${zone.accent}66`,borderLeft:`1px solid ${zone.accent}66`}}/>
        <span style={{position:"absolute",bottom:3,right:3,width:7,height:7,borderBottom:`1px solid ${zone.accent}66`,borderRight:`1px solid ${zone.accent}66`}}/>
        {app.pinned&&<span style={{position:"absolute",top:3,right:5,fontSize:"6px",color:zone.accent,opacity:0.9}}>★</span>}
        <span style={{fontSize:dense?"18px":"clamp(18px,5vw,26px)",lineHeight:1}}>{app.icon}</span>
        <span style={{fontFamily:T.font.ui,fontSize:dense?"7px":"clamp(7px,1.8vw,10px)",color:zone.accent,letterSpacing:"0.04em",fontWeight:700,textAlign:"center",lineHeight:1.1,wordBreak:"break-word",maxWidth:"100%"}}>
          {app.name.toUpperCase()}
        </span>
      </button>

      {menu&&(
        <div onPointerDown={e=>e.stopPropagation()} style={{
          position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",
          background:"#060f1a",border:`1px solid ${zone.accent}66`,borderRadius:T.radius.md,
          zIndex:200,minWidth:"120px",boxShadow:"0 8px 32px rgba(0,0,0,0.9)",overflow:"hidden",marginTop:"4px",
        }}>
          {[
            {label:app.pinned?"☆ Unpin":"★ Pin", fn:()=>{onPin(app.id);setMenu(false);}},
            {label:"↗ Open",                       fn:()=>{onOpen(app);setMenu(false);}},
            ...(onDelete?[{label:"✕ Remove",       fn:()=>{onDelete(app.id);setMenu(false);}}]:[]),
            {label:"╳ Cancel",                     fn:()=>setMenu(false)},
          ].map(item=>(
            <button key={item.label} onClick={item.fn} style={{display:"block",width:"100%",padding:"9px 14px",background:"transparent",border:"none",borderBottom:`1px solid ${zone.accent}18`,color:zone.accent,fontFamily:T.font.ui,fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",textAlign:"left"}}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ZonePanel({ zone, apps, onOpen, onPin, onDelete, onAddApp, dense }) {
  return (
    <div style={{marginBottom:"26px"}}>
      <SectionHeader glyph={zone.glyph} label={zone.label} accent={zone.accent} count={apps.length} action={{label:"+ ADD",onClick:onAddApp}}/>
      {apps.length===0
        ? <div style={{textAlign:"center",padding:"20px",color:T.text.muted,fontFamily:T.font.display,fontSize:"10px",letterSpacing:"0.1em"}}>NO NODES — TAP + ADD</div>
        : <div style={{display:"grid",gridTemplateColumns:dense?"repeat(5,1fr)":"repeat(4,1fr)",gap:dense?"5px":"clamp(5px,1.5vw,9px)"}}>
            {apps.map((app,i)=><AppTile key={app.id} app={app} zone={zone} onOpen={onOpen} onPin={onPin} onDelete={onDelete} idx={i} dense={dense}/>)}
          </div>
      }
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGETS
// ═══════════════════════════════════════════════════════════════════════════════

function PinnedWidget({ apps, onOpen, onUnpin }) {
  return (
    <HudCard accent={T.zones.dev.accent} dim={T.zones.dev.dim+"55"}>
      <SectionHeader glyph="★" label="PINNED" accent={T.zones.dev.accent} count={apps.length}/>
      {apps.length===0
        ? <div style={{fontFamily:T.font.display,fontSize:"9px",color:T.text.muted,textAlign:"center",padding:"8px 0"}}>LONG-PRESS ANY APP TO PIN</div>
        : <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
            {apps.map(app=>(
              <div key={app.id} style={{display:"flex",alignItems:"center",gap:"5px",background:T.zones.dev.dim+"88",border:`1px solid ${T.zones.dev.accent}30`,borderRadius:"20px",padding:"4px 10px"}}>
                <span style={{fontSize:"12px"}}>{app.icon}</span>
                <button onClick={()=>onOpen(app)} style={{background:"none",border:"none",color:T.zones.dev.accent,fontFamily:T.font.ui,fontSize:"10px",fontWeight:700,cursor:"pointer",letterSpacing:"0.04em"}}>{app.name}</button>
                <button onClick={()=>onUnpin(app.id)} style={{background:"none",border:"none",color:T.text.muted,cursor:"pointer",fontSize:"11px",lineHeight:1}}>×</button>
              </div>
            ))}
          </div>
      }
    </HudCard>
  );
}

function RecentWidget({ recent, onOpen, onClear }) {
  const timeAgo = d => { const m=Math.floor((Date.now()-new Date(d))/ 60000); return m<1?"NOW":m<60?m+"M":Math.floor(m/60)+"H"; };
  return (
    <HudCard accent={T.zones.social.accent} dim={T.zones.social.dim+"55"}>
      <SectionHeader glyph="◉" label="RECENT" accent={T.zones.social.accent} action={recent.length>0?{label:"CLEAR",onClick:onClear}:undefined}/>
      {recent.length===0
        ? <div style={{fontFamily:T.font.display,fontSize:"9px",color:T.text.muted,textAlign:"center",padding:"8px 0"}}>NO RECENT ACTIVITY</div>
        : <div style={{display:"flex",flexDirection:"column",gap:"3px"}}>
            {recent.slice(0,6).map(item=>(
              <button key={item.id} onClick={()=>onOpen(item.url)} style={{display:"flex",alignItems:"center",gap:"8px",background:"transparent",border:"none",cursor:"pointer",padding:"5px 0",textAlign:"left"}}>
                <span style={{fontSize:"12px"}}>{item.icon}</span>
                <span style={{fontFamily:T.font.ui,fontSize:"11px",color:T.text.secondary,flex:1,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</span>
                <span style={{fontFamily:T.font.display,fontSize:"8px",color:T.text.muted,flexShrink:0}}>{timeAgo(item.openedAt)}</span>
              </button>
            ))}
          </div>
      }
    </HudCard>
  );
}

function NotesWidget({ notes, onOpen }) {
  const n = notes[0];
  return (
    <HudCard accent={T.zones.ops.accent} dim={T.zones.ops.dim+"55"} onClick={onOpen} style={{cursor:"pointer"}}>
      <SectionHeader glyph="◇" label="NOTES" accent={T.zones.ops.accent} count={notes.length}/>
      {n
        ? <>
            <div style={{fontFamily:T.font.ui,fontSize:"11px",color:T.zones.ops.accent,fontWeight:700,marginBottom:"4px"}}>{n.title}</div>
            <p style={{fontFamily:T.font.display,fontSize:"9px",color:T.text.secondary,lineHeight:1.5,margin:0}}>{n.content.slice(0,90)}{n.content.length>90?"…":""}</p>
          </>
        : <div style={{fontFamily:T.font.display,fontSize:"9px",color:T.text.muted,textAlign:"center",padding:"8px 0"}}>TAP TO ADD A NOTE</div>
      }
    </HudCard>
  );
}

function TasksWidget({ tasks, onToggle, onOpen }) {
  const pending = tasks.filter(t=>!t.completed).slice(0,4);
  return (
    <HudCard accent={T.zones.media.accent} dim={T.zones.media.dim+"55"}>
      <SectionHeader glyph="◎" label="TASKS" accent={T.zones.media.accent} count={tasks.filter(t=>!t.completed).length} action={{label:"ALL",onClick:onOpen}}/>
      {pending.length===0
        ? <div style={{fontFamily:T.font.display,fontSize:"9px",color:T.text.muted,textAlign:"center",padding:"8px 0"}}>ALL CLEAR ✓</div>
        : <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
            {pending.map(t=>(
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:"7px"}}>
                <button onClick={()=>onToggle(t.id)} style={{width:"13px",height:"13px",flexShrink:0,border:`1px solid ${T.priority[t.priority]}`,borderRadius:"2px",background:"transparent",cursor:"pointer"}}/>
                <div style={{width:4,height:4,borderRadius:"50%",background:T.priority[t.priority],flexShrink:0}}/>
                <span style={{fontFamily:T.font.ui,fontSize:"11px",color:T.text.secondary,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</span>
              </div>
            ))}
          </div>
      }
    </HudCard>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div style={{position:"relative"}}>
      <span style={{position:"absolute",left:"11px",top:"50%",transform:"translateY(-50%)",fontFamily:T.font.display,fontSize:"13px",color:T.text.muted,pointerEvents:"none"}}>⌕</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder="SEARCH APPS..." style={{width:"100%",boxSizing:"border-box",background:T.bg.card,border:`1px solid ${value?T.border.normal:T.border.subtle}`,borderRadius:T.radius.lg,color:T.text.primary,fontFamily:T.font.display,fontSize:"10px",letterSpacing:"0.08em",padding:"8px 12px 8px 28px",outline:"none",transition:T.trans.fast}}/>
      {value&&<button onClick={()=>onChange("")} style={{position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.text.muted,cursor:"pointer",fontSize:"14px"}}>×</button>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════════════════════

function NotesModal({ notes, onAdd, onUpdate, onDelete, onClose }) {
  const [view, setView] = useState("list"); // list | edit | create
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ title:"", content:"" });
  const ACC = T.zones.ops.accent;

  const startCreate = () => { setDraft({title:"",content:""}); setView("create"); };
  const startEdit = n => { setDraft({title:n.title,content:n.content}); setEditing(n); setView("edit"); };
  const save = () => {
    if(!draft.content.trim()) return;
    view==="create" ? onAdd({title:draft.title||"Untitled",content:draft.content}) : onUpdate(editing.id,draft);
    setView("list");
  };

  return (
    <Modal title="// NOTES" accent={ACC} onClose={onClose} maxWidth="500px">
      {view==="list"&&(
        <>
          <HudBtn onClick={startCreate} accent={ACC} dim={T.zones.ops.dim} full style={{marginBottom:"12px"}}>+ NEW NOTE</HudBtn>
          <div style={{display:"flex",flexDirection:"column",gap:"7px",maxHeight:"54vh",overflowY:"auto"}}>
            {notes.length===0&&<div style={{textAlign:"center",color:T.text.muted,fontFamily:T.font.display,fontSize:"10px",padding:"20px 0"}}>NO NOTES YET</div>}
            {notes.map(n=>(
              <HudCard key={n.id} accent={ACC} dim={T.zones.ops.dim+"44"} onClick={()=>startEdit(n)} style={{padding:"10px 13px",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"5px"}}>
                  <span style={{fontFamily:T.font.ui,fontWeight:700,fontSize:"11px",color:ACC}}>{n.title}</span>
                  <button onClick={e=>{e.stopPropagation();onDelete(n.id);}} style={{background:"none",border:"none",color:T.text.muted,cursor:"pointer",fontSize:"12px"}}>×</button>
                </div>
                <p style={{fontFamily:T.font.display,fontSize:"9px",color:T.text.secondary,lineHeight:1.5,margin:0}}>{n.content.slice(0,100)}{n.content.length>100?"…":""}</p>
              </HudCard>
            ))}
          </div>
        </>
      )}
      {(view==="create"||view==="edit")&&(
        <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
          <HudInput value={draft.title} onChange={v=>setDraft(d=>({...d,title:v}))} placeholder="Title" accent={ACC}/>
          <HudInput value={draft.content} onChange={v=>setDraft(d=>({...d,content:v}))} placeholder="Write your note..." accent={ACC} multiline rows={9} autoFocus/>
          <div style={{display:"flex",gap:"7px"}}>
            <HudBtn onClick={save} accent={ACC} dim={T.zones.ops.dim} full>SAVE</HudBtn>
            <HudBtn onClick={()=>setView("list")} accent={T.text.muted} dim="transparent">CANCEL</HudBtn>
          </div>
        </div>
      )}
    </Modal>
  );
}

function TasksModal({ tasks, onAdd, onToggle, onDelete, onClose }) {
  const [input, setInput] = useState("");
  const [pri, setPri] = useState("medium");
  const ACC = T.zones.media.accent;
  const pending = tasks.filter(t=>!t.completed);
  const done = tasks.filter(t=>t.completed);

  const submit = () => { if(!input.trim()) return; onAdd({title:input.trim(),priority:pri}); setInput(""); };

  return (
    <Modal title="// TASKS" accent={ACC} onClose={onClose} maxWidth="460px">
      <div style={{display:"flex",gap:"7px",marginBottom:"10px"}}>
        <HudInput value={input} onChange={setInput} placeholder="New task..." accent={ACC} autoFocus style={{flex:1}}/>
        <HudBtn onClick={submit} accent={ACC} dim={T.zones.media.dim}>ADD</HudBtn>
      </div>
      <div style={{display:"flex",gap:"5px",marginBottom:"14px"}}>
        {["high","medium","low"].map(p=>(
          <button key={p} onClick={()=>setPri(p)} style={{flex:1,padding:"5px",background:pri===p?T.priority[p]+"22":"transparent",border:`1px solid ${pri===p?T.priority[p]:T.text.muted+"44"}`,borderRadius:T.radius.sm,color:pri===p?T.priority[p]:T.text.muted,fontFamily:T.font.ui,fontSize:"9px",fontWeight:700,letterSpacing:"0.15em",cursor:"pointer",textTransform:"uppercase"}}>{p}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"5px",maxHeight:"48vh",overflowY:"auto"}}>
        {pending.length===0&&done.length===0&&<div style={{textAlign:"center",color:T.text.muted,fontFamily:T.font.display,fontSize:"10px",padding:"18px 0"}}>NO TASKS — ALL CLEAR</div>}
        {pending.map(t=><TaskRow key={t.id} task={t} onToggle={onToggle} onDelete={onDelete}/>)}
        {done.length>0&&<>
          <div style={{height:"1px",background:T.border.subtle,margin:"6px 0"}}/>
          <div style={{fontFamily:T.font.display,fontSize:"8px",color:T.text.muted,letterSpacing:"0.2em",marginBottom:"3px"}}>COMPLETED ({done.length})</div>
          {done.slice(0,5).map(t=><TaskRow key={t.id} task={t} onToggle={onToggle} onDelete={onDelete}/>)}
        </>}
      </div>
    </Modal>
  );
}

function TaskRow({ task, onToggle, onDelete }) {
  const pc = T.priority[task.priority];
  return (
    <div style={{display:"flex",alignItems:"center",gap:"9px",padding:"8px 11px",background:task.completed?"transparent":T.bg.card,border:`1px solid ${task.completed?T.border.subtle:pc+"28"}`,borderRadius:T.radius.sm,opacity:task.completed?0.45:1,transition:T.trans.fast}}>
      <button onClick={()=>onToggle(task.id)} style={{width:"15px",height:"15px",flexShrink:0,border:`1px solid ${pc}`,borderRadius:"3px",background:task.completed?pc+"44":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:pc,fontSize:"9px"}}>{task.completed?"✓":""}</button>
      <div style={{width:4,height:4,borderRadius:"50%",background:pc,flexShrink:0}}/>
      <span style={{flex:1,fontFamily:T.font.ui,fontSize:"12px",fontWeight:600,color:task.completed?T.text.muted:T.text.primary,textDecoration:task.completed?"line-through":"none",letterSpacing:"0.02em"}}>{task.title}</span>
      <button onClick={()=>onDelete(task.id)} style={{background:"none",border:"none",color:T.text.muted,cursor:"pointer",fontSize:"13px",flexShrink:0}}>×</button>
    </div>
  );
}

function AddAppModal({ zones, defaultZoneId, onAdd, onClose }) {
  const [form, setForm] = useState({name:"",url:"",icon:"🔗",zoneId:defaultZoneId||zones[0]?.id||""});
  const submit = () => { if(!form.name.trim()||!form.url.trim()) return; onAdd(form); onClose(); };
  return (
    <Modal title="// ADD APP" accent={T.text.accent} onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
        <div style={{display:"flex",gap:"8px"}}>
          <HudInput value={form.icon} onChange={v=>setForm(f=>({...f,icon:v}))} placeholder="🔗" style={{width:"56px",textAlign:"center",fontSize:"20px"}}/>
          <HudInput value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="App name" autoFocus style={{flex:1}}/>
        </div>
        <HudInput value={form.url} onChange={v=>setForm(f=>({...f,url:v}))} placeholder="https://..."/>
        <select value={form.zoneId} onChange={e=>setForm(f=>({...f,zoneId:e.target.value}))} style={{background:T.bg.card,border:`1px solid ${T.border.subtle}`,borderRadius:T.radius.md,color:T.text.primary,fontFamily:T.font.ui,fontSize:"11px",padding:"9px 12px",outline:"none"}}>
          {zones.map(z=><option key={z.id} value={z.id}>{z.label}</option>)}
        </select>
        <div style={{display:"flex",gap:"7px"}}>
          <HudBtn onClick={submit} accent={T.text.accent} dim={T.zones.dev.dim} full>ADD TO LAUNCHER</HudBtn>
          <HudBtn onClick={onClose} accent={T.text.muted} dim="transparent">CANCEL</HudBtn>
        </div>
      </div>
    </Modal>
  );
}

function SettingsModal({ settings, onPatch, onClose }) {
  const [s, setS] = useState({...settings});
  const ACC = T.zones.art.accent;
  const tog = k => setS(p=>({...p,[k]:!p[k]}));
  const save = () => { onPatch(s); onClose(); };

  const Toggle = ({label,k}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:T.font.ui,fontSize:"11px",fontWeight:600,color:T.text.secondary,letterSpacing:"0.1em"}}>{label}</span>
      <button onClick={()=>tog(k)} role="switch" aria-checked={s[k]} style={{width:"38px",height:"20px",background:s[k]?ACC+"44":T.bg.card,border:`1px solid ${s[k]?ACC:T.border.subtle}`,borderRadius:"10px",cursor:"pointer",position:"relative",transition:T.trans.fast,flexShrink:0}}>
        <div style={{position:"absolute",top:"3px",left:s[k]?"19px":"3px",width:"12px",height:"12px",borderRadius:"50%",background:s[k]?ACC:T.text.muted,transition:T.trans.spring,boxShadow:s[k]?T.glow(ACC,0.5):""}}/>
      </button>
    </div>
  );

  return (
    <Modal title="// SETTINGS" accent={ACC} onClose={onClose} maxWidth="420px">
      <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
        <div>
          <div style={{fontFamily:T.font.display,fontSize:"8px",color:T.text.muted,letterSpacing:"0.3em",marginBottom:"10px"}}>PROFILE</div>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {[["NAME","userName"],["SECTOR","sector"]].map(([l,k])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontFamily:T.font.ui,fontSize:"11px",fontWeight:600,color:T.text.secondary,letterSpacing:"0.1em"}}>{l}</span>
                <HudInput value={s[k]} onChange={v=>setS(p=>({...p,[k]:v}))} accent={ACC} style={{width:"160px"}}/>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontFamily:T.font.display,fontSize:"8px",color:T.text.muted,letterSpacing:"0.3em",marginBottom:"10px"}}>DISPLAY</div>
          <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
            <Toggle label="KIOSK MODE"   k="kioskMode"/>
            <Toggle label="DENSE MODE"   k="denseMode"/>
            <Toggle label="SCANLINES"    k="scanlines"/>
            <Toggle label="GRID OVERLAY" k="gridOverlay"/>
          </div>
        </div>
        <div style={{display:"flex",gap:"7px",paddingTop:"4px"}}>
          <HudBtn onClick={save} accent={ACC} dim={T.zones.art.dim} full>SAVE</HudBtn>
          <HudBtn onClick={onClose} accent={T.text.muted} dim="transparent">CANCEL</HudBtn>
        </div>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM DOCK
// ═══════════════════════════════════════════════════════════════════════════════

function BottomDock({ onNotes, onTasks, onSettings, pendingCount, noteCount, kioskMode }) {
  const items = [
    { icon:"📝", label:"NOTES",    badge:noteCount>0?noteCount:null,    action:onNotes },
    { icon:"✓",  label:"TASKS",    badge:pendingCount>0?pendingCount:null, action:onTasks },
    { icon:"⊕",  label:"SCROLL ▲", badge:null, action:()=>window.scrollTo({top:0,behavior:"smooth"}) },
    { icon:"⚙",  label:"SETTINGS", badge:null, action:onSettings },
  ];
  return (
    <div style={{
      position:"fixed",bottom:0,left:0,right:0,
      background:"linear-gradient(0deg,#020810 55%,transparent)",
      padding:"10px 16px 18px",display:"flex",justifyContent:"center",gap:"10px",zIndex:100,
    }}>
      {items.map(item=>(
        <button key={item.label} onClick={item.action} style={{
          background:"rgba(0,229,255,0.05)",border:"1px solid rgba(0,229,255,0.15)",
          borderRadius:"40px",padding:"8px 14px",display:"flex",alignItems:"center",gap:"5px",
          cursor:"pointer",color:T.text.accent,fontFamily:T.font.ui,
          fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",transition:T.trans.fast,
          position:"relative",
        }}>
          <span style={{fontSize:"12px"}}>{item.icon}</span>{item.label}
          {item.badge&&<span style={{position:"absolute",top:"-5px",right:"-5px",background:"#ff4444",color:"#fff",borderRadius:"50%",width:"16px",height:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",fontFamily:T.font.display,fontWeight:700}}>{item.badge}</span>}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND FX
// ═══════════════════════════════════════════════════════════════════════════════

function BgFx({ scanlines, gridOverlay }) {
  return <>
    {gridOverlay&&<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:`linear-gradient(rgba(0,229,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.022) 1px,transparent 1px)`,backgroundSize:"48px 48px"}}/>}
    {scanlines&&<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:500,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px)"}}/>}
    <div style={{position:"fixed",top:"-60px",left:"50%",transform:"translateX(-50%)",width:"700px",height:"280px",background:"radial-gradient(ellipse,rgba(0,229,255,0.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
  </>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function DMCommandCenter() {
  // ── State ──
  const [zones]    = useState(()=>DB.zones.get());
  const [apps,     setApps]     = useState(()=>DB.apps.get());
  const [notes,    setNotes]    = useState(()=>DB.notes.get());
  const [tasks,    setTasks]    = useState(()=>DB.tasks.get());
  const [recent,   setRecent]   = useState(()=>DB.recent.get());
  const [settings, setSettings] = useState(()=>DB.settings.get());
  const [activeZoneId, setActiveZoneId] = useState("all");
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(null); // notes|tasks|settings|addApp
  const [addZoneId,setAddZoneId]= useState(null);
  const [booted,   setBooted]   = useState(false);

  useEffect(()=>{
    const link=document.createElement("link");
    link.href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap";
    link.rel="stylesheet"; document.head.appendChild(link);
    setTimeout(()=>setBooted(true),350);
  },[]);

  // ── Persist helpers ──
  const saveApps  = a => { setApps(a);  DB.apps.save(a); };
  const saveNotes = n => { setNotes(n); DB.notes.save(n); };
  const saveTasks = t => { setTasks(t); DB.tasks.save(t); };
  const saveRecent= r => { setRecent(r);DB.recent.save(r); };

  // ── App actions ──
  const openApp = useCallback(app=>{
    const existing = recent.filter(r=>r.appLinkId!==app.id);
    const entry = {id:crypto.randomUUID(),appLinkId:app.id,name:app.name,icon:app.icon,url:app.url,openedAt:new Date().toISOString()};
    saveRecent([entry,...existing].slice(0,12));
    window.open(app.url,"_blank","noopener,noreferrer");
  },[recent]);

  const togglePin = useCallback(id=>{
    saveApps(apps.map(a=>a.id===id?{...a,pinned:!a.pinned}:a));
  },[apps]);

  const deleteApp = useCallback(id=>saveApps(apps.filter(a=>a.id!==id)),[apps]);

  const addApp = useCallback(data=>{
    let url=data.url.trim(); if(!url.startsWith("http")) url="https://"+url;
    const app={id:crypto.randomUUID(),...data,url,pinned:false,order:999};
    saveApps([...apps,app]);
  },[apps]);

  // ── Note actions ──
  const addNote = d => { const n={id:crypto.randomUUID(),title:d.title||"Untitled",content:d.content,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}; saveNotes([n,...notes]); };
  const updateNote = (id,d) => saveNotes(notes.map(n=>n.id===id?{...n,...d,updatedAt:new Date().toISOString()}:n));
  const deleteNote = id => saveNotes(notes.filter(n=>n.id!==id));

  // ── Task actions ──
  const addTask = d => { const t={id:crypto.randomUUID(),title:d.title,priority:d.priority||"medium",completed:false,createdAt:new Date().toISOString(),completedAt:null}; saveTasks([t,...tasks]); };
  const toggleTask = id => saveTasks(tasks.map(t=>t.id===id?{...t,completed:!t.completed,completedAt:!t.completed?new Date().toISOString():null}:t));
  const deleteTask = id => saveTasks(tasks.filter(t=>t.id!==id));

  // ── Settings ──
  const patchSettings = patch => { const s={...settings,...patch}; setSettings(s); DB.settings.save(s); };

  // ── Computed ──
  const visibleZones = activeZoneId==="all" ? zones : zones.filter(z=>z.id===activeZoneId);
  const appsForZone  = zId => apps.filter(a=>a.zoneId===zId && (!search||a.name.toLowerCase().includes(search.toLowerCase())||a.url.toLowerCase().includes(search.toLowerCase())));
  const pinnedApps   = apps.filter(a=>a.pinned);
  const pendingTasks = tasks.filter(t=>!t.completed).length;
  const activeZoneLabel = activeZoneId==="all"?"ALL":zones.find(z=>z.id===activeZoneId)?.label.split(" / ")[0]||"ALL";
  const totalVisible = visibleZones.reduce((s,z)=>s+appsForZone(z.id).length,0);
  const { denseMode, kioskMode } = settings;

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${T.bg.primary} 0%,#040d18 50%,${T.bg.primary} 100%)`,color:T.text.primary,opacity:booted?1:0,transition:"opacity 0.5s ease",paddingBottom:"80px",overflowX:"hidden"}}>
      <BgFx scanlines={settings.scanlines} gridOverlay={settings.gridOverlay}/>

      <div style={{position:"relative",zIndex:1,maxWidth:"740px",margin:"0 auto",padding:"0 14px"}}>

        {/* ── Header strip ── */}
        <div style={{borderBottom:`1px solid ${T.border.subtle}`,padding:"13px 0 0",marginBottom:"4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:T.font.display,fontSize:"8px",color:"#0a2535",letterSpacing:"0.35em"}}>DM_COMMAND_CENTER {settings.version} ▸ {kioskMode?"KIOSK":"DASHBOARD"} ▸ ACTIVE</span>
          <div style={{display:"flex",gap:"5px"}}>
            {[T.zones.ops.accent,T.zones.media.accent,T.zones.social.accent].map((c,i)=>(
              <div key={i} style={{width:6,height:6,borderRadius:"50%",background:c,boxShadow:`0 0 5px ${c}`}}/>
            ))}
          </div>
        </div>

        {/* ── Clock ── */}
        <div style={{padding:"16px 0 0"}}><Clock userName={settings.userName}/></div>
        <QuoteTicker/>
        <HudStats zoneLabel={activeZoneLabel} appCount={totalVisible} pendingTasks={pendingTasks} settings={settings}/>

        {/* ── Zone Nav ── */}
        <ZoneNav zones={zones} activeId={activeZoneId} onSelect={setActiveZoneId}/>

        {/* ── Search ── */}
        <div style={{padding:"14px 0 0"}}><SearchBar value={search} onChange={setSearch}/></div>

        {/* ── Divider ── */}
        <div style={{margin:"14px 0",height:"1px",background:`linear-gradient(90deg,transparent,${T.border.normal},transparent)`}}/>

        {/* ── Widget Row (hidden in kiosk) ── */}
        {!kioskMode&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"20px"}}>
            <PinnedWidget apps={pinnedApps} onOpen={openApp} onUnpin={togglePin}/>
            <RecentWidget recent={recent} onOpen={url=>window.open(url,"_blank","noopener,noreferrer")} onClear={()=>saveRecent([])}/>
            <NotesWidget notes={notes} onOpen={()=>setModal("notes")}/>
            <TasksWidget tasks={tasks} onToggle={toggleTask} onOpen={()=>setModal("tasks")}/>
          </div>
        )}

        {/* ── Zone Panels ── */}
        {search&&totalVisible===0
          ? <div style={{textAlign:"center",padding:"40px 0",color:T.text.muted,fontFamily:T.font.display,fontSize:"11px",letterSpacing:"0.1em"}}>NO APPS MATCH "{search.toUpperCase()}"</div>
          : visibleZones.map(zone=>(
              <ZonePanel
                key={zone.id}
                zone={zone}
                apps={appsForZone(zone.id)}
                onOpen={openApp}
                onPin={togglePin}
                onDelete={deleteApp}
                dense={denseMode}
                onAddApp={()=>{ setAddZoneId(zone.id); setModal("addApp"); }}
              />
            ))
        }

        {/* ── Footer ── */}
        <div style={{borderTop:`1px solid ${T.border.subtle}`,padding:"14px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:T.font.display,fontSize:"7px",color:"#0a1e2a",letterSpacing:"0.25em"}}>DEVYN MACK ▸ BROWARD FL ▸ BUILDER / ARTIST / AUTHOR</span>
          <span style={{fontFamily:T.font.display,fontSize:"7px",color:"#0a1e2a",letterSpacing:"0.2em"}}>{new Date().getFullYear()} ◈</span>
        </div>
      </div>

      {/* ── Dock ── */}
      <BottomDock
        onNotes={()=>setModal("notes")}
        onTasks={()=>setModal("tasks")}
        onSettings={()=>setModal("settings")}
        pendingCount={pendingTasks}
        noteCount={notes.length}
        kioskMode={kioskMode}
      />

      {/* ── Modals ── */}
      {modal==="notes"    && <NotesModal    notes={notes}  onAdd={addNote}  onUpdate={updateNote} onDelete={deleteNote} onClose={()=>setModal(null)}/>}
      {modal==="tasks"    && <TasksModal    tasks={tasks}  onAdd={addTask}  onToggle={toggleTask} onDelete={deleteTask} onClose={()=>setModal(null)}/>}
      {modal==="settings" && <SettingsModal settings={settings} onPatch={patchSettings} onClose={()=>setModal(null)}/>}
      {modal==="addApp"   && <AddAppModal   zones={zones}  defaultZoneId={addZoneId} onAdd={addApp} onClose={()=>setModal(null)}/>}

      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:#020810;overscroll-behavior:none;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.1}}
        button{outline:none;-webkit-tap-highlight-color:transparent;}
        input,textarea,select{color-scheme:dark;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(0,229,255,0.2);border-radius:4px;}
        input::placeholder,textarea::placeholder{color:#2a4a5a;}
      `}</style>
    </div>
  );
}
