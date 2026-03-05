import React, { useState, useEffect } from 'react';
import {
  BrainCircuit, Heart, LogIn as LoginIcon, Rocket, Clock, Users, Mic,
  MapPin, Bell, Shield, UserPlus, Menu, X, Activity, Smartphone,
  Star, ArrowRight, CheckCircle, CalendarCheck, Pill, Calendar,
  User, LogOut, Home, Bot, AlarmClock, XCircle, Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FontDownload, Google } from '@mui/icons-material';

/* ─── Phone Mockup ─────────────────────────────────────────────────────────── */
const PhoneMockup = () => {
  const T = { fontFamily: "'Nunito', sans-serif" };
  const stats = [
    { n:'3', label:'TOTAL',    bg:'#e8f5e9', nc:'#2d9134', Icon: Layers      },
    { n:'1', label:'UPCOMING', bg:'#fff8e1', nc:'#e8920a', Icon: AlarmClock  },
    { n:'2', label:'DONE',     bg:'#e8f5e9', nc:'#2d9134', Icon: CheckCircle },
    { n:'0', label:'MISSED',   bg:'#fde8e8', nc:'#e53935', Icon: XCircle     },
  ];

  const tabs = [
    { Icon: Home,          label:'Home',     active:true,  fab:false },
    { Icon: Users,         label:'Contacts', active:false, fab:false },
    { Icon: Bot,           label:'Help',     active:false, fab:true  },
    { Icon: CalendarCheck, label:'My Day',   active:false, fab:false },
    { Icon: User,          label:'Me',       active:false, fab:false },
  ];

  return (
    <div style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center' }}>
      {/* glow */}
      <div style={{ position:'absolute', inset:-40, borderRadius:'50%', background:'radial-gradient(circle, rgba(45,145,52,.12) 0%, transparent 65%)', pointerEvents:'none' }} />

      {/* shell */}
      <div style={{
        position:'relative', zIndex:1,
        width:256, height:530,
        background:'linear-gradient(165deg, #1e1e1e 0%, #2a2a2a 100%)',
        borderRadius:52,
        padding:'14px 8px 10px',
        boxShadow:'0 0 0 1px rgba(255,255,255,.07), 0 40px 80px rgba(0,0,0,.52), inset 0 1px 0 rgba(255,255,255,.1)',
        animation:'phoneFloat 5s ease-in-out infinite',
      }}>
        {/* physical buttons */}
        <div style={{ position:'absolute', right:-3, top:112, width:3, height:46, background:'#3a3a3a', borderRadius:'0 2px 2px 0' }} />
        <div style={{ position:'absolute', left:-3, top:96,  width:3, height:28, background:'#3a3a3a', borderRadius:'2px 0 0 2px' }} />
        <div style={{ position:'absolute', left:-3, top:134, width:3, height:28, background:'#3a3a3a', borderRadius:'2px 0 0 2px' }} />
        {/* dynamic island */}
        <div style={{ position:'absolute', top:17, left:'50%', transform:'translateX(-50%)', width:80, height:22, background:'#0a0a0a', borderRadius:11, zIndex:10 }} />

        {/* screen */}
        <div style={{ height:'100%', borderRadius:40, background:'#eef4ee', overflow:'hidden', display:'flex', flexDirection:'column' }}>

          {/* top bar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'32px 14px 10px', background:'#eef4ee', flexShrink:0,marginBottom:'14px'}}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:30, height:30, borderRadius:9, background:'#e0f0e0', border:'1.5px solid #c3dfc3', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <BrainCircuit size={15} color="#2d9134" strokeWidth={2} />
              </div>
              <span style={{ ...T, fontSize:13.5, fontWeight:800, color:'#111', letterSpacing:'-0.2px' }}>
                Care<span style={{ fontWeight:400 }}>Mind</span>
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Bell   size={15} color="#2d9134" strokeWidth={2} />
              <LogOut size={15} color="#2d9134" strokeWidth={2} />
            </div>
          </div>

          {/* body */}
          <div style={{ flex:1, overflowY:'hidden', padding:'0 10px 4px', display:'flex', flexDirection:'column', gap:8 }}>

            {/* greeting card — NO priority badge */}
            <div style={{ background:'linear-gradient(135deg, #1b5e20 0%, #2d7d32 55%, #388e3c 100%)', borderRadius:18, padding:'15px 15px 17px', position:'relative', overflow:'hidden', flexShrink:0, marginBottom:'6px' }}>
              <div style={{ position:'absolute', right:-16, top:-16, width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,.08)' }} />
              <div style={{ position:'absolute', right:16, bottom:-20, width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,.06)' }} />
              <p style={{ ...T, fontSize:15.5, fontWeight:800, color:'#fff', margin:'0 0 7px', lineHeight:1.2 }}>Good Evening, johnny</p>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <Calendar size={10} color="rgba(255,255,255,.7)" strokeWidth={2} />
                <span style={{ ...T, fontSize:9, color:'rgba(255,255,255,.7)', fontWeight:500 }}>Monday, March 2, 2026</span>
              </div>
            </div>

            {/* activities card */}
            <div style={{ background:'#fff', borderRadius:16, padding:'11px 12px 13px', boxShadow:'0 2px 8px rgba(0,0,0,.07)', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                <CalendarCheck size={12} color="#2d9134" strokeWidth={2.5} />
                <span style={{ ...T, fontSize:10.5, fontWeight:800, color:'#111' }}>Today's Activities</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
                {stats.map((s,i) => (
                  <div key={i} style={{ background:s.bg, borderRadius:11, padding:'8px 3px 7px', textAlign:'center' }}>
                    <s.Icon size={11} color={s.nc} strokeWidth={2.5} style={{ display:'block', margin:'0 auto 3px' }} />
                    <div style={{ ...T, fontSize:16, fontWeight:900, color:s.nc, lineHeight:1 }}>{s.n}</div>
                    <div style={{ ...T, fontSize:6.5, fontWeight:700, color:'#9ca3af', marginTop:2, letterSpacing:.5, textTransform:'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* tasks */}
            <div style={{ flexShrink:0 }}>
              <p style={{ ...T, fontSize:11, fontWeight:800, color:'#111', margin:'0 1px 7px',marginBottom:'8px', marginTop:'8px' }}>Today's Tasks</p>
              {/* tabs */}
              <div style={{ display:'flex', gap:5, marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:4, background:'#2d9134', borderRadius:999, padding:'4px 10px', flexShrink:0 }}>
                  <Clock size={8} color="#fff" strokeWidth={2.5} />
                  <span style={{ ...T, fontSize:8, fontWeight:800, color:'#fff' }}>Upcoming 1</span>
                </div>
                {[{ Icon:XCircle, label:'Missed 0' },{ Icon:CheckCircle, label:'Completed 2' }].map((tb,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:4, background:'#fff', border:'1.5px solid #d1d5db', borderRadius:999, padding:'3px 8px', flexShrink:0 }}>
                    <tb.Icon size={8} color="#9ca3af" strokeWidth={2} />
                    <span style={{ ...T, fontSize:8, fontWeight:600, color:'#6b7280' }}>{tb.label}</span>
                  </div>
                ))}
              </div>
              {/* task card */}
              <div style={{ background:'#fff', borderRadius:14, padding:'9px 11px 9px 10px', display:'flex', alignItems:'center', gap:9, boxShadow:'0 2px 8px rgba(0,0,0,.07)', borderLeft:'3.5px solid #2d9134' }}>
                <div style={{ width:34, height:34, borderRadius:11, background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Pill size={15} color="#2d9134" strokeWidth={2} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ ...T, fontSize:9.5, fontWeight:800, color:'#111', margin:'0 0 3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Metformin Hydrochloride</p>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <Clock size={8} color="#9ca3af" strokeWidth={2} />
                    <span style={{ ...T, fontSize:8, color:'#9ca3af' }}>7:30 PM</span>
                  </div>
                </div>
                <Clock size={13} color="#2d9134" strokeWidth={2} />
              </div>
            </div>

   

          </div>

          {/* bottom nav */}
          <div style={{ background:'#fff', borderTop:'1px solid #e8ece8', display:'flex', alignItems:'center', padding:'7px 4px 8px', boxShadow:'0 -2px 10px rgba(0,0,0,.05)', flexShrink:0 }}>
            {tabs.map((tab,i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                {tab.fab ? (
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#2d9134,#43a84b)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(45,145,52,.5)', marginTop:-20 }}>
                    <tab.Icon size={19} color="#fff" strokeWidth={2} />
                  </div>
                ) : (
                  <tab.Icon size={17} color={tab.active ? '#2d9134' : '#b0bec5'} strokeWidth={tab.active ? 2.5 : 1.8}
                    fill={tab.active && tab.label === 'Home' ? '#2d9134' : 'none'} />
                )}
                <span style={{ ...T, fontSize:7.5, fontWeight:tab.active ? 800 : 500, color:tab.active ? '#2d9134' : '#b0bec5', marginTop:tab.fab ? 3 : 0 }}>{tab.label}</span>
              </div>
            ))}
          </div>

          {/* android bar */}
          <div style={{ background:'#eef4ee', padding:'5px 0 7px', display:'flex', justifyContent:'center', alignItems:'center', gap:24, flexShrink:0 }}>
            <div style={{ width:9, height:9, border:'1.5px solid #9ca3af', borderRadius:2 }} />
            <div style={{ width:9, height:9, border:'1.5px solid #9ca3af', borderRadius:'50%' }} />
            <div style={{ width:0, height:0, borderTop:'5px solid transparent', borderBottom:'5px solid transparent', borderRight:'8px solid #9ca3af' }} />
          </div>

        </div>
      </div>
    </div>
  );
};

/* ─── Landing Page ─────────────────────────────────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const features = [
    { Icon:Clock,        color:'#2d9134', title:'Smart Reminders',       desc:'Adaptive medication and routine scheduling with priority-based alerts for elderly and dementia patients.'  },
    { Icon:BrainCircuit, color:'#1b6e20', title:'Memory Reinforcement',  desc:'AI analyses forgetting patterns and reinforces critical information for those with cognitive decline.'     },
    { Icon:Activity,     color:'#43a84b', title:'Routine Stabilization', desc:'Structured daily activities maintain cognitive function and reduce confusion in dementia patients.'        },
    { Icon:Mic,          color:'#2d9134', title:'Voice Assistant',       desc:'Natural voice commands and conversation support for elderly users with limited tech experience.'            },
    { Icon:MapPin,       color:'#1b6e20', title:'Safety Tracking',       desc:'Emergency location sharing and geofencing alerts for wandering prevention in dementia care.'               },
    { Icon:Bell,         color:'#43a84b', title:'Caregiver Alerts',      desc:'Real-time notifications for missed routines, medication lapses, and potential emergencies.'                },
  ];

  const roles = [
    { Icon:Shield,     color:'#1b6e20', badge:'Web Portal', title:'Admin',    hl:false,
      desc:'Oversee multiple caregivers, monitor system-wide compliance, and manage care facility configurations.',
      pts:['Manage caregiver accounts','System-wide compliance','Facility configuration'] },
    { Icon:Users,      color:'#2d9134', badge:'Web Portal', title:'Caregiver', hl:false,
      desc:'Register patients, set personalised routines, track medication adherence, and receive safety alerts.',
      pts:['Add & manage patients','Set medicines & routines','Monitor via dashboard'] },
    { Icon:Smartphone, color:'#43a84b', badge:'Mobile App', title:'Patient',   hl:true,
      desc:'Patients use the CareMind mobile app for gentle reminders, AI voice assistant, and emergency SOS.',
      pts:['Medication reminders','AI health assistant','Emergency SOS button'] },
  ];

  const G = !scrolled; // is-green nav state
  const ff = "'Nunito', sans-serif";
  const serif = "'DM Serif Display', serif";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { font-family:'Nunito',sans-serif; background:#fff; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }

        @keyframes phoneFloat {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-13px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gradShift {
          0%,100% { background-position:0% 50%; }
          50%      { background-position:100% 50%; }
        }

        .fu  { animation:fadeUp .6s ease both; }
        .d1  { animation-delay:.08s; }
        .d2  { animation-delay:.17s; }
        .d3  { animation-delay:.26s; }
        .d4  { animation-delay:.35s; }

        .lift { transition:transform .22s ease, box-shadow .22s ease; cursor:pointer; }
        .lift:hover { transform:translateY(-5px); box-shadow:0 18px 44px rgba(45,145,52,.12); }

        .shine {
          background:linear-gradient(270deg, #1b6e20, #2d9134, #56c45d, #2d9134, #1b6e20);
          background-size:300% 300%;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:gradShift 5s ease infinite;
        }

        @media(max-width:880px) {
          .nl { display:none !important; }
          .nb { display:none !important; }
          .hb { display:flex !important; }
          .hi { grid-template-columns:1fr !important; }
          .pc { display:flex; justify-content:center; padding-top:32px; }
        }
        @media(min-width:881px) { .hb { display:none !important; } }
      `}</style>

      <div style={{ background:'#fff', overflowX:'hidden' }}>

        {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
        <nav style={{
          position:'fixed', top:0, left:0, right:0, zIndex:100,
          background: G ? 'linear-gradient(135deg,#1b6e20 0%,#2d9134 55%,#43a84b 100%)' : 'rgba(255,255,255,.97)',
          backdropFilter: G ? 'none' : 'blur(18px)',
          boxShadow: G ? 'none' : '0 1px 0 rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.06)',
          transition:'all .28s ease',
        }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px', display:'flex', alignItems:'center', justifyContent:'space-between', height:68 }}>
            {/* logo */}
            <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
              <div style={{ width:38, height:38, borderRadius:11, background: G ? 'rgba(255,255,255,.18)' : 'linear-gradient(135deg,#2d9134,#43a84b)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <BrainCircuit size={20} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ fontSize:25, fontWeight:900, color:'black',fontFamily:G, letterSpacing:'-0.3px' }}>
                Care<span style={{ fontWeight:100,color:'#dce6de',paddingLeft:'3px' }}>Mind</span>
              </span>
            </div>
            {/* nav links */}
            <div className="nl" style={{ display:'flex', gap:36, alignItems:'center' }}>
              {['Home','Features','Roles','About'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  style={{ fontSize:14, fontWeight:600, color: G ? 'rgba(255,255,255,.88)' : '#555', transition:'color .2s', fontFamily:ff }}
                  onMouseEnter={e=>{ e.currentTarget.style.color = G ? '#fff' : '#2d9134'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.color = G ? 'rgba(255,255,255,.88)' : '#555'; }}
                >{l}</a>
              ))}
            </div>
            {/* cta */}
            <div className="nb" style={{ display:'flex', gap:10, alignItems:'center' }}>
              <button onClick={()=>navigate('/login')} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 20px', background: G ? 'rgba(255,255,255,.12)' : 'transparent', border:`1.5px solid ${G ? 'rgba(255,255,255,.35)' : '#2d9134'}`, borderRadius:10, cursor:'pointer', color: G ? '#fff' : '#2d9134', fontWeight:700, fontSize:13, fontFamily:ff, transition:'all .2s' }}>
                <LoginIcon size={14} />Login
              </button>
              <button onClick={()=>navigate('/register')} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 20px', background: G ? '#fff' : 'linear-gradient(135deg,#2d9134,#43a84b)', border:'none', borderRadius:10, cursor:'pointer', color: G ? '#2d9134' : '#fff', fontWeight:800, fontSize:13, fontFamily:ff, boxShadow:'0 4px 14px rgba(45,145,52,.28)', transition:'all .2s' }}>
                <UserPlus size={14} />Sign Up Free
              </button>
            </div>
            {/* hamburger */}
            <button className="hb" onClick={()=>setMenuOpen(v=>!v)} style={{ display:'none', background:'rgba(255,255,255,.15)', border:'none', borderRadius:9, padding:8, cursor:'pointer', alignItems:'center', justifyContent:'center' }}>
              {menuOpen ? <X size={22} color="#fff" /> : <Menu size={22} color="#fff" />}
            </button>
          </div>
          {menuOpen && (
            <div style={{ padding:'8px 32px 20px', borderTop:'1px solid rgba(255,255,255,.12)' }}>
              {['Home','Features','Roles','About'].map(l=>(
                <a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setMenuOpen(false)}
                  style={{ display:'block', padding:'11px 0', color:'rgba(255,255,255,.9)', fontWeight:600, fontSize:15, borderBottom:'1px solid rgba(255,255,255,.08)', fontFamily:ff }}>
                  {l}
                </a>
              ))}
              <div style={{ display:'flex', gap:10, marginTop:16 }}>
                <button onClick={()=>{navigate('/login');setMenuOpen(false);}} style={{ flex:1, padding:12, background:'rgba(255,255,255,.12)', border:'1.5px solid rgba(255,255,255,.28)', borderRadius:10, color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:ff }}>Login</button>
                <button onClick={()=>{navigate('/register');setMenuOpen(false);}} style={{ flex:1, padding:12, background:'#fff', border:'none', borderRadius:10, color:'#2d9134', fontWeight:800, cursor:'pointer', fontFamily:ff }}>Sign Up</button>
              </div>
            </div>
          )}
        </nav>
        <div style={{ height:68 }} />

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section id="home" style={{ padding:'96px 40px 88px', background:'linear-gradient(155deg,#f4fbf4 0%,#ffffff 50%,#f4fbf4 100%)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:30, right:-60, width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(45,145,52,.06) 0%,transparent 68%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-60, left:-60, width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(45,145,52,.04) 0%,transparent 68%)', pointerEvents:'none' }} />

          <div className="hi" style={{ maxWidth:1160, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 290px', gap:72, alignItems:'center' }}>
            {/* left */}
            <div className="fu">
              <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#dcfce7', border:'1px solid #bbf7d0', borderRadius:999, padding:'5px 14px', marginBottom:24 }}>
                <Star size={11} color="#2d9134" fill="#2d9134" />
                <span style={{ fontSize:12, fontWeight:700, color:'#2d9134', fontFamily:ff }}>AI-Powered Dementia &amp; Elder Care</span>
              </div>

              <h1 style={{ fontFamily:serif, fontSize:'clamp(38px,5vw,64px)', lineHeight:1.1, color:'#0d1f0e', marginBottom:22, letterSpacing:'-1.5px' }}>
                Caring for <span className="shine">Aging Minds</span>,<br />
                <span style={{ color:'#2d9134' }}>Together.</span>
              </h1>

              <p style={{ fontSize:17, color:'#4a5568', lineHeight:1.78, maxWidth:500, marginBottom:32, fontFamily:ff }}>
                An AI-powered memory reinforcement system supporting elderly and dementia patients through intelligent reminders, voice assistance, and real-time caregiver monitoring.
              </p>

              {/* platform badge */}
              <div style={{ display:'inline-flex', background:'#fff', border:'1.5px solid #d1fae5', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 18px rgba(45,145,52,.1)', marginBottom:36 }}>
                {[
                  { Icon:Smartphone, top:'PATIENTS USE',   btm:'CareMind Mobile App' },
                  { Icon:Shield,     top:'CAREGIVERS USE', btm:'Web Dashboard'        },
                ].map((item,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 22px', borderRight: i===0 ? '1.5px solid #d1fae5' : 'none' }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <item.Icon size={16} color="#2d9134" strokeWidth={2} />
                    </div>
                    <div>
                      <p style={{ fontSize:10, fontWeight:700, color:'#9ca3af', letterSpacing:.8, fontFamily:ff, lineHeight:1 }}>{item.top}</p>
                      <p style={{ fontSize:13, fontWeight:800, color:'#0d1f0e', fontFamily:ff, marginTop:2, lineHeight:1 }}>{item.btm}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <button onClick={()=>navigate('/register')} style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 28px', background:'linear-gradient(135deg,#1b6e20,#2d9134,#43a84b)', border:'none', borderRadius:13, cursor:'pointer', color:'#fff', fontWeight:800, fontSize:15, fontFamily:ff, boxShadow:'0 8px 24px rgba(45,145,52,.36)', transition:'all .22s' }}>
                  <Rocket size={17} />Get Started Free<ArrowRight size={15} />
                </button>
                <button onClick={()=>navigate('/login')} style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 28px', background:'#fff', border:'2px solid #e2e8f0', borderRadius:13, cursor:'pointer', color:'#374151', fontWeight:700, fontSize:15, fontFamily:ff, transition:'all .22s' }}>
                  <LoginIcon size={17} />Login
                </button>
              </div>
            </div>

            {/* right — phone */}
            <div className="pc fu d2">
              <PhoneMockup />
            </div>
          </div>
        </section>

        {/* wave */}
        <svg viewBox="0 0 1440 50" style={{ display:'block', background:'#f4fbf4', marginTop:-1 }}><path d="M0,25 C480,50 960,0 1440,25 L1440,50 L0,50 Z" fill="#fff" /></svg>

        {/* ── FEATURES ───────────────────────────────────────────────────────── */}
        <section id="features" style={{ padding:'96px 40px', background:'#fff' }}>
          <div style={{ maxWidth:1160, margin:'0 auto' }}>
            <div className="fu" style={{ textAlign:'center', marginBottom:60 }}>
              <p style={{ fontSize:12, fontWeight:700, color:'#2d9134', letterSpacing:2.5, textTransform:'uppercase', marginBottom:12, fontFamily:ff }}>What We Offer</p>
              <h2 style={{ fontFamily:serif, fontSize:'clamp(28px,4vw,48px)', color:'#0d1f0e', lineHeight:1.14, marginBottom:14 }}>
                Designed for <span style={{ color:'#2d9134' }}>Dementia &amp; Elder</span> Care
              </h2>
              <p style={{ fontSize:17, color:'#6b7280', maxWidth:500, margin:'0 auto', lineHeight:1.74, fontFamily:ff }}>
                Thoughtfully built features that make daily care simpler for patients, caregivers, and families.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
              {features.map((f,i) => (
                <div key={i} className={`lift fu d${(i%4)+1}`} style={{ background:'#fff', borderRadius:22, padding:'28px 26px', border:'1.5px solid #e8f5e8', boxShadow:'0 2px 12px rgba(0,0,0,.04)' }}>
                  <div style={{ width:52, height:52, borderRadius:15, background:`${f.color}14`, border:`1.5px solid ${f.color}28`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                    <f.Icon size={24} color={f.color} strokeWidth={1.75} />
                  </div>
                  <h3 style={{ fontSize:17, fontWeight:800, color:'#0d1f0e', marginBottom:10, letterSpacing:'-0.2px', fontFamily:ff }}>{f.title}</h3>
                  <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.72, fontFamily:ff }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* wave */}
        <svg viewBox="0 0 1440 50" style={{ display:'block', background:'#fff', marginBottom:-1 }}><path d="M0,25 C480,0 960,50 1440,25 L1440,50 L0,50 Z" fill="#f4fbf4" /></svg>

        {/* ── ROLES ──────────────────────────────────────────────────────────── */}
        <section id="roles" style={{ padding:'96px 40px', background:'#f4fbf4' }}>
          <div style={{ maxWidth:940, margin:'0 auto' }}>
            <div className="fu" style={{ textAlign:'center', marginBottom:60 }}>
              <p style={{ fontSize:12, fontWeight:700, color:'#2d9134', letterSpacing:2.5, textTransform:'uppercase', marginBottom:12, fontFamily:ff }}>Who Is It For</p>
              <h2 style={{ fontFamily:serif, fontSize:'clamp(28px,4vw,48px)', color:'#0d1f0e', lineHeight:1.14, marginBottom:14 }}>
                Built for <span style={{ color:'#2d9134' }}>Everyone</span> in the Care Circle
              </h2>
              <p style={{ fontSize:17, color:'#6b7280', maxWidth:480, margin:'0 auto', lineHeight:1.74, fontFamily:ff }}>
                Role-based access for seamless dementia care coordination.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {roles.map((role,i) => (
                <div key={i} className={`lift fu d${i+1}`} style={{ background: role.hl ? 'linear-gradient(135deg,#1b6e20 0%,#2d9134 55%,#43a84b 100%)' : '#fff', borderRadius:24, padding:'32px 36px', border: role.hl ? 'none' : '1.5px solid #e2f0e3', boxShadow: role.hl ? '0 16px 48px rgba(45,145,52,.28)' : '0 2px 12px rgba(0,0,0,.04)', display:'flex', alignItems:'center', gap:28, flexWrap:'wrap', position:'relative', overflow:'hidden' }}>
                  {role.hl && <div style={{ position:'absolute', top:-44, right:-44, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }} />}
                  {role.hl && <div style={{ position:'absolute', bottom:-44, left:-44, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />}
                  {/* icon block */}
                  <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                    <div style={{ width:72, height:72, borderRadius:22, background: role.hl ? 'rgba(255,255,255,.18)' : `${role.color}12`, border: role.hl ? '1.5px solid rgba(255,255,255,.22)' : `1.5px solid ${role.color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <role.Icon size={30} color={role.hl ? '#fff' : role.color} strokeWidth={1.6} />
                    </div>
                    <span style={{ fontSize:9, fontWeight:800, padding:'3px 11px', borderRadius:999, background: role.hl ? 'rgba(255,255,255,.2)' : `${role.color}12`, color: role.hl ? '#fff' : role.color, border: role.hl ? '1px solid rgba(255,255,255,.22)' : `1px solid ${role.color}22`, fontFamily:ff, letterSpacing:.5, textTransform:'uppercase' }}>{role.badge}</span>
                  </div>
                  {/* text block */}
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <h3 style={{ fontSize:22, fontWeight:800, color: role.hl ? '#fff' : '#0d1f0e', fontFamily:ff, letterSpacing:'-0.3px' }}>{role.title}</h3>
                      {role.hl && <span style={{ fontSize:10, fontWeight:700, background:'rgba(255,255,255,.22)', color:'#fff', padding:'3px 11px', borderRadius:999, fontFamily:ff }}>📱 Mobile App</span>}
                    </div>
                    <p style={{ fontSize:14.5, color: role.hl ? 'rgba(255,255,255,.8)' : '#6b7280', lineHeight:1.72, marginBottom:16, fontFamily:ff }}>{role.desc}</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {role.pts.map((pt,j) => (
                        <div key={j} style={{ display:'flex', alignItems:'center', gap:5, background: role.hl ? 'rgba(255,255,255,.14)' : '#f0fdf4', border: role.hl ? '1px solid rgba(255,255,255,.18)' : '1px solid #bbf7d0', borderRadius:999, padding:'4px 12px' }}>
                          <CheckCircle size={10} color={role.hl ? '#fff' : '#2d9134'} strokeWidth={2.5} />
                          <span style={{ fontSize:12, fontWeight:700, color: role.hl ? '#fff' : '#2d9134', fontFamily:ff }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <section id="about" style={{ padding:'96px 40px', background:'#fff' }}>
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <div className="fu" style={{ background:'linear-gradient(135deg,#1b6e20,#2d9134 50%,#43a84b)', borderRadius:28, padding:'64px 52px', textAlign:'center', position:'relative', overflow:'hidden', boxShadow:'0 24px 64px rgba(45,145,52,.32)' }}>
              <div style={{ position:'absolute', top:-48, right:-48, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:-48, left:-48, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }} />
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ width:64, height:64, borderRadius:18, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', border:'1.5px solid rgba(255,255,255,.24)' }}>
                  <Heart size={28} color="#fff" strokeWidth={2} />
                </div>
                <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,4vw,44px)', color:'#fff', lineHeight:1.2, marginBottom:16 }}>Support Aging Minds with CareMind</h2>
                <p style={{ fontSize:16.5, color:'rgba(255,255,255,.8)', maxWidth:480, margin:'0 auto 36px', lineHeight:1.76, fontFamily:ff }}>
                  Join caregivers transforming dementia and elderly care with adaptive AI technology. Free to get started.
                </p>
                <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                  <button onClick={()=>navigate('/register')} style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 30px', background:'#fff', border:'none', borderRadius:13, cursor:'pointer', color:'#2d9134', fontWeight:800, fontSize:15, fontFamily:ff, boxShadow:'0 8px 24px rgba(0,0,0,.14)', transition:'all .22s' }}>
                    <UserPlus size={17} />Create Account
                  </button>
                  <button onClick={()=>navigate('/login')} style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 30px', background:'rgba(255,255,255,.12)', border:'1.5px solid rgba(255,255,255,.26)', borderRadius:13, cursor:'pointer', color:'#fff', fontWeight:700, fontSize:15, fontFamily:ff, transition:'all .22s' }}>
                    <LoginIcon size={16} />Already have an account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <footer style={{ background:'#0c170d', padding:'52px 40px 32px' }}>
          <div style={{ maxWidth:1160, margin:'0 auto', textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#2d9134,#43a84b)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <BrainCircuit size={20} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:ff, letterSpacing:'-0.3px' }}>
                Care<span style={{ fontWeight:400, color:'rgba(255,255,255,.5)' }}>Mind</span>
              </span>
            </div>
            <p style={{ color:'rgba(255,255,255,.36)', fontSize:13, marginBottom:28, lineHeight:1.6, fontFamily:ff }}>
              Adaptive Memory Reinforcement for Elders and Dementia Care
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:28, flexWrap:'wrap', marginBottom:28 }}>
              {['Home','Features','Roles','About','Privacy Policy','Terms of Service'].map(l=>(
                <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`}
                  style={{ color:'rgba(255,255,255,.36)', fontSize:13, fontWeight:600, fontFamily:ff, transition:'color .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.color='rgba(255,255,255,.72)';}}
                  onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,.36)';}}
                >{l}</a>
              ))}
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', paddingTop:22 }}>
              <p style={{ color:'rgba(255,255,255,.2)', fontSize:12, fontFamily:ff }}>© 2025 CareMind. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default LandingPage;