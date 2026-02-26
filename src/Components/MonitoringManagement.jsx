import React, { useEffect, useState } from 'react';
import { Activity, Clock, Calendar, Users, Pill, Heart, CheckCircle, ChevronDown, ChevronUp, Bell, BarChart2, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api/caregiver';

function rateInfo(r) {
  const p = Math.round((r || 0) * 100);
  if (p === 0)  return { p, label: 'Never missed',     bar: 'bg-[#2d9134]', track: 'bg-green-100',  txt: 'text-[#2d9134]',  chip: 'bg-green-50 text-[#2d9134]'    };
  if (p <= 25)  return { p, label: 'Rarely missed',    bar: 'bg-[#5cb85c]',  track: 'bg-green-100',  txt: 'text-[#5cb85c]',  chip: 'bg-green-50 text-[#5cb85c]'     };
  if (p <= 50)  return { p, label: 'Sometimes missed', bar: 'bg-[#f0ad4e]',  track: 'bg-amber-100',  txt: 'text-[#f0ad4e]',  chip: 'bg-amber-50 text-[#f0ad4e]'     };
  if (p <= 75)  return { p, label: 'Often missed',     bar: 'bg-[#d9534f]', track: 'bg-orange-100', txt: 'text-[#d9534f]', chip: 'bg-orange-50 text-[#d9534f]'   };
  return               { p, label: 'Mostly missed',    bar: 'bg-[#c9302c]',    track: 'bg-red-100',    txt: 'text-[#c9302c]',    chip: 'bg-red-50 text-[#c9302c]'         };
}

function scoreInfo(s) {
  const p = Math.round(s || 0);
  if (p <= 10)  return { p, label: 'Excellent',  bar: 'bg-[#2d9134]', track: 'bg-green-100',  txt: 'text-[#2d9134]',  chip: 'bg-green-50 text-[#2d9134]'    };
  if (p <= 25)  return { p, label: 'Good',        bar: 'bg-[#5cb85c]',  track: 'bg-green-100',  txt: 'text-[#5cb85c]',  chip: 'bg-green-50 text-[#5cb85c]'     };
  if (p <= 45)  return { p, label: 'Fair',         bar: 'bg-[#f0ad4e]',  track: 'bg-amber-100',  txt: 'text-[#f0ad4e]',  chip: 'bg-amber-50 text-[#f0ad4e]'     };
  if (p <= 65)  return { p, label: 'Poor',         bar: 'bg-[#d9534f]', track: 'bg-orange-100', txt: 'text-[#d9534f]', chip: 'bg-orange-50 text-[#d9534f]'   };
  return               { p, label: 'Very Poor',  bar: 'bg-[#c9302c]',    track: 'bg-red-100',    txt: 'text-[#c9302c]',    chip: 'bg-red-50 text-[#c9302c]'         };
}

const PCFG = {
  critical: {  label: 'Urgent Attention Needed', hdr: 'bg-red-50',    border: 'border-red-200',    chip: 'bg-red-100 text-red-700',    accent: 'text-red-600',    dot: 'bg-red-500'    },
  high:     {  label: 'Needs Extra Care',        hdr: 'bg-orange-50', border: 'border-orange-200', chip: 'bg-orange-100 text-orange-700', accent: 'text-orange-600', dot: 'bg-orange-500' },
  medium:   {  label: 'Some Concerns',            hdr: 'bg-amber-50',  border: 'border-amber-200',  chip: 'bg-amber-100 text-amber-700',  accent: 'text-amber-600',  dot: 'bg-amber-400'  },
  normal:   {  label: 'Doing Well',               hdr: 'bg-green-50',  border: 'border-green-200',  chip: 'bg-green-100 text-[#2d9134]',  accent: 'text-[#2d9134]',  dot: 'bg-[#2d9134]'  },
};
const pCfg = (l) => PCFG[(l || 'normal').toLowerCase()] || PCFG.normal;

const INTERVAL_NOTE = { critical: 'every 3 min', high: 'every 5 min', medium: 'every 8 min', normal: 'every 10 min' };

function fmt12h(t) {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
function fmtDate(s) {
  if (!s) return '—';
  try { return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return s; }
}


function Bar({ pct, bar, track }) {
  return (
    <div className={`w-full h-2 rounded-full ${track} overflow-hidden mt-2`}>
      <div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

function StatCard(props) {
  const Icon = props.icon;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${props.iconBg}`}>
          <Icon size={15} className={props.iconClr} />
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{props.title}</span>
      </div>
      <div className={`text-3xl font-black leading-none mb-2 ${props.info.txt}`}>{props.info.p}%</div>
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${props.info.chip}`}>{props.info.label}</span>
      <Bar pct={props.info.p} bar={props.info.bar} track={props.info.track} />
      {props.hint && <p className="text-[11px] text-gray-400 mt-2">{props.hint}</p>}
    </div>
  );
}

function PatientCard(props) {
  const profile = props.profile;
  const [open, setOpen] = useState(true);
  const pc  = pCfg(profile.priorityLevel);
  const lvl = (profile.priorityLevel || 'normal').toLowerCase();

  const weekly = scoreInfo(profile.weeklyAverage);
  const ld     = profile.dailyScores?.[0];
  const latest = ld ? scoreInfo(ld.score) : null;
  const med    = rateInfo(profile.medicineMissRate);
  const rot    = rateInfo(profile.routineMissRate);

  return (
    <div className={`bg-white rounded-2xl border ${pc.border} overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300`}>

      {/* ── header ── */}
      <div className={`${pc.hdr} px-6 py-4 border-b ${pc.border}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">

          {/* patient info */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-white border ${pc.border} flex items-center justify-center shadow-sm`}>
              <Users size={20} className={pc.accent} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">{profile.patientName}</h3>
              <p className="text-xs text-left mt-1 text-gray-500">{profile.patientRelationship}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${pc.border} ${pc.chip}`}>
              <span className={`w-2 h-2 rounded-full ${pc.dot}`} />
              <span> {pc.label}</span>
            </div>
            <button
              onClick={() => setOpen(v => !v)}
              className={`w-8 h-8 rounded-xl border ${pc.border} bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
            >
              {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border ${pc.border} text-[11px] font-semibold ${pc.accent}`}>
            <Bell size={11} />
            <span>App reminds them {INTERVAL_NOTE[lvl] || 'every 10 min'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-semibold text-gray-500">
            <BarChart2 size={11} />
            <span>Priority: <span className={pc.accent}>{pc.label}</span></span>
          </div>
        </div>
      </div>

      {/* ── collapsed summary ── */}
      {!open && (
        <div className="px-6 py-3 bg-gray-50 flex flex-wrap gap-5 border-b border-gray-100">
          <span className="text-sm text-gray-500">Weekly: <b className={weekly.txt}>{weekly.p}% missed</b></span>
          <span className="text-sm text-gray-500">Medicines: <b className={med.txt}>{med.p}% missed</b></span>
          <span className="text-sm text-gray-500">Routines: <b className={rot.txt}>{rot.p}% missed</b></span>
        </div>
      )}

      {/* ── expanded body ── */}
      {open && (
        <div className="p-6 space-y-6">

          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">📊 How often are tasks being missed?</p>

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={BarChart2} iconBg="bg-[#2d9134] bg-opacity-10" iconClr="text-[#2d9134]"
              title="Weekly Miss Rate" info={weekly}
              hint="Average tasks missed per day over 7 days" />

            {latest
              ? <StatCard icon={Calendar} iconBg="bg-[#2d9134] bg-opacity-10" iconClr="text-[#2d9134]"
                  title={`Latest Day — ${fmtDate(ld.date)}`} info={latest}
                  hint="Tasks missed on the most recent tracked day" />
              : <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center min-h-[130px]">
                  <span className="text-xs text-gray-400">No daily data yet</span>
                </div>
            }

            <StatCard icon={Pill} iconBg="bg-blue-50" iconClr="text-blue-600"
              title="Medicine Miss Rate" info={med}
              hint={med.p === 0 ? 'All medicines taken on time.' : `${med.p}% of medicine doses missed this week.`} />

            <StatCard icon={Heart} iconBg="bg-pink-50" iconClr="text-pink-600"
              title="Routine Miss Rate" info={rot}
              hint={rot.p === 0 ? 'All routines completed on time.' : `${rot.p}% of routines missed this week.`} />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                <Bell size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Alert Interval</p>
                <p className="text-2xl font-black text-orange-500 leading-none">Every {profile.alertInterval || 10} min</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {(profile.alertMultiplier || 1) > 1 ? `${profile.alertMultiplier}× more frequent than normal` : 'Normal reminder frequency'}
                </p>
              </div>
            </div>

            <div className={`rounded-2xl border ${pc.border} ${pc.hdr} p-4 shadow-sm flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-2xl bg-white border ${pc.border} flex items-center justify-center flex-shrink-0`}>
                <TrendingUp size={20} className={pc.accent} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Priority Level</p>
                <p className={`text-2xl font-black leading-none ${pc.accent}`}>{(profile.priorityLevel || 'Normal').toUpperCase()}</p>
                <p className="text-[11px] text-gray-400 mt-1">{pc.emoji} {pc.label}</p>
              </div>
            </div>

          </div>

          {/* problem patterns */}
          <div className="bg-orange-50 rounded-2xl border border-amber-200 p-5">
            <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-4">🔍 Where your patient struggles most</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div className="bg-white rounded-xl border border-amber-100 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Clock size={12} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-bold text-amber-900">Times They Forget</span>
                </div>
                {profile.problematicTimes?.length > 0
                  ? <div className="space-y-2">
                      {profile.problematicTimes.map((t, i) => (
                        <div key={i} className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2">
                          <span className="text-sm font-black text-gray-800">{fmt12h(t.time)}</span>
                          <span className="text-[11px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{t.missCount} miss{t.missCount !== 1 ? 'es' : ''}</span>
                        </div>
                      ))}
                      <p className="text-[11px] text-amber-700 pt-1">💡 Check on them around these times</p>
                    </div>
                  : <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                      <CheckCircle size={13} className="text-[#2d9134]" />
                      <span className="text-xs font-semibold text-[#2d9134]">No difficult times</span>
                    </div>
                }
              </div>

              <div className="bg-white rounded-xl border border-amber-100 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Calendar size={12} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-bold text-amber-900">Hard Days</span>
                </div>
                {profile.problematicDays?.length > 0
                  ? <div>
                      <div className="flex flex-wrap gap-2">
                        {profile.problematicDays.map((d, i) => (
                          <span key={i} className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">{d}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-amber-700 mt-3">💡 Pay extra attention on these days</p>
                    </div>
                  : <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                      <CheckCircle size={13} className="text-[#2d9134]" />
                      <span className="text-xs font-semibold text-[#2d9134]">All days going well</span>
                    </div>
                }
              </div>

              <div className="bg-white rounded-xl border border-amber-100 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                    <AlertTriangle size={12} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-bold text-amber-900">What They Forget</span>
                </div>
                {profile.problematicTaskTypes?.length > 0
                  ? <div>
                      <div className="flex flex-wrap gap-2">
                        {profile.problematicTaskTypes.map((t, i) => (
                          <span key={i} className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${t === 'Medicine' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-pink-50 text-pink-700 border-pink-200'}`}>
                            {t === 'Medicine' ? <Pill size={11} /> : <Heart size={11} />}
                            {t === 'Medicine' ? 'Medicines' : 'Routines'}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-amber-700 mt-3">💡 Missed more than 40% of the time</p>
                    </div>
                  : <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                      <CheckCircle size={13} className="text-[#2d9134]" />
                      <span className="text-xs font-semibold text-[#2d9134]">No task type problems</span>
                    </div>
                }
              </div>

            </div>
          </div>

          {profile.dailyScores?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-300 pb-7 overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-lime-50 border-b border-gray-100 flex items-center gap-2">
                <BarChart2 size={13} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last 7 Days History</span>
              </div>
              {profile.dailyScores.map((day, i) => {
                const di = scoreInfo(day.score);
                return (
                  <div key={i} className={`grid gap-4 px-5 py-3 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${i < profile.dailyScores.length - 1 ? 'border-b border-gray-50' : ''}`} style={{ gridTemplateColumns: '130px 100px 1fr 100px' }}>
                    <span className="text-sm font-semibold text-gray-600">{fmtDate(day.date)}</span>
                    <div className="flex items-center gap-1.5">
                      {di.p <= 25 ? <TrendingDown size={12} className={di.txt} /> : <TrendingUp size={12} className={di.txt} />}
                      <span className={`text-xs font-bold ${di.txt}`}>{di.label}</span>
                    </div>
                    <div className={`h-2 rounded-full ${di.track} overflow-hidden`}>
                      <div className={`h-full rounded-full ${di.bar}`} style={{ width: `${di.p}%` }} />
                    </div>
                    <span className={`text-xs font-black text-right ${di.txt}`}>{di.p}% missed</span>
                  </div>
                );
              })}

            </div>
          )}

          {profile.lastUpdated && (
            <div className="flex items-center justify-end gap-1.5">
              <RefreshCw size={10} className="text-gray-500 font-extrabold" />
              <span className="text-xs text-gray-400">Last updated: {fmtDate(profile.lastUpdated)}</span>
            </div>
          )}

        </div>
      )}
    </div>
  );
}


export default function MonitoringManagement() {
  const navigate = useNavigate();
  const [token,    setToken]    = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const t = sessionStorage.getItem('token');
    const u = sessionStorage.getItem('userType');
    if (!t || u !== 'caregiver') { 
      alert('Access denied! Only caregivers can view this page.'); 
      navigate('/'); 
      return; 
    }
    setToken(t);
  }, [navigate]);

  useEffect(() => { 
    if (token) {
      load(); 
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true); 
    setError('');
    
    try {
      const patientsRes = await axios.post(`${API}/my-patients`, {}, { headers: { token } });
      
      if (patientsRes.data.status === 'SUCCESS' && patientsRes.data.data?.length > 0) {
        const profilePromises = patientsRes.data.data.map(async (patient) => {
          try {
            const profileRes = await axios.post(
              `${API}/reinforcement/Data`, 
              { patientId: patient._id }, 
              { headers: { token } }
            );
            
            if (profileRes.data.status === 'SUCCESS' && profileRes.data.data) {
              return {
                patientId: patient._id,
                patientName: patient.name,
                patientRelationship: patient.relationship || 'Patient',
                ...profileRes.data.data
              };
            }
          } catch (err) {
            console.log("error->",err)
            console.log(`No profile for ${patient.name}`);
          }
          return null;
        });
        
        const results = await Promise.all(profilePromises);
        setProfiles(results.filter(Boolean));
        
        if (results.filter(Boolean).length === 0) {
          setError('No monitoring data available yet. Data will appear after midnight.');
        }
      } else {
        setError('No patients found. Please add patients first.');
      }
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load monitoring data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#2d9134] mx-auto" />
        <p className="mt-3 text-sm text-gray-500">Loading patient information…</p>
      </div>
    </div>
  );

  return (
    <div className="w-full">

      {/* page heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2d9134] bg-opacity-10 p-2.5 rounded-xl">
          <Activity className="w-6 h-6 text-[#2d9134]" />
        </div>
        <div>
          <h2 className="text-2xl text-left font-black text-gray-900">Patient Monitoring</h2>
          <p className="text-xs text-gray-500 mt-0.5">See how your patient follows their daily tasks</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button 
              onClick={() => load()} 
              className="mt-2 text-xs bg-white px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          </div>
        </div>
      )}

      {!error && profiles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Activity className="mx-auto h-10 w-10 text-gray-200 mb-3" />
          <p className="text-gray-500 font-semibold">No monitoring data yet</p>
          <p className="text-sm text-gray-400 mt-1">Data will be collected automatically starting tonight at midnight.</p>
        </div>
      )}

      <div className="space-y-6">
        {profiles.map(p => <PatientCard key={p.patientId} profile={p} />)}
      </div>

    </div>
  );
}