'use client';

import { useEffect, useState } from 'react';
import { Activity, Play, ExternalLink, X, Settings, Database, Server, User, Mail, Globe, Download, Briefcase, Sun, Moon, Search, Lock, DollarSign, Wallet, CheckCircle2, AlertCircle, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { Command } from 'cmdk';
import Chart from './Chart';

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
);

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [paypalData, setPaypalData] = useState<any>(null);
  const [selectedActor, setSelectedActor] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'data' | 'profile' | 'earnings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => setMounted(true), []);


  useEffect(() => {
    fetch('/api/stats').then((res) => res.json()).then((data) => setData(data));
    fetch('/api/paypal').then((res) => res.json()).then((paypalData) => setPaypalData(paypalData));
  }, []);

  useEffect(() => {
    if (data && !data.isAdmin && activeTab === 'earnings') {
      setActiveTab('overview');
      toast.error('Access Denied: Private Data');
    }
  }, [activeTab, data]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(open => !open); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const totalRuns = data?.actors?.reduce((acc: number, actor: any) => acc + (actor.stats?.totalRuns || 0), 0) || 0;
  const totalSuccess = data?.actors?.reduce((acc: number, actor: any) => acc + actor.stats.succeeded, 0) || 0;
  const totalFailed = data?.actors?.reduce((acc: number, actor: any) => acc + actor.stats.failed, 0) || 0;
  const globalRate = totalSuccess + totalFailed === 0 ? 0 : Math.round((totalSuccess / (totalSuccess + totalFailed)) * 100);
  const systemStatus = globalRate >= 50 ? 'operational' : 'degraded';
  const estimatedDataPoints = totalSuccess * 10;

  const filteredActors = data?.actors?.filter((actor: any) => actor.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const handleRunActor = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/stats', { method: 'POST', body: JSON.stringify({ actorId: selectedActor.id }) });
      if (res.ok) {
        toast.success('Actor started successfully!');
        setTimeout(() => { setSelectedActor(null); fetch('/api/stats').then(r => r.json()).then(d => setData(d)); }, 2000);
      } else { toast.error('Error starting actor. Check your Apify balance.'); }
    } catch { toast.error('Network error.'); }
    setIsRunning(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200 font-sans flex transition-colors duration-300">
      
      <Command.Dialog open={open} onOpenChange={setOpen} label="Global Search" className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-lg bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400" />
            <Command.Input placeholder="Search actors..." className="w-full bg-transparent p-4 outline-none" />
          </div>
          <Command.List className="p-2 max-h-80 overflow-y-auto">
            <Command.Empty className="p-4 text-sm text-slate-500">No results.</Command.Empty>
            <Command.Group heading="Navigation" className="text-xs text-slate-500 px-2 py-1">
              <Command.Item onSelect={() => { setActiveTab('overview'); setOpen(false); }} className="px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">Overview</Command.Item>
              <Command.Item onSelect={() => { setActiveTab('profile'); setOpen(false); }} className="px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">Profile</Command.Item>
            </Command.Group>
            <Command.Group heading="Actors" className="text-xs text-slate-500 px-2 py-1">
              {data?.actors?.map((actor: any) => (
                <Command.Item key={actor.id} onSelect={() => { setSelectedActor(actor); setOpen(false); }} className="px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">{actor.name}</Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>

      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0c0e] p-6 flex flex-col hidden md:flex transition-colors">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><Activity size={20} className="text-white" /></div>
          <span className="text-xl font-bold tracking-tight">Apify Analytics</span>
        </div>
        <nav className="space-y-2 flex-1">
          {['overview', 'activity', 'data', 'profile'].map((tab: any) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition capitalize ${activeTab === tab ? 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/30'}`}>
              {tab === 'overview' && <Activity size={18} />}
              {tab === 'activity' && <Server size={18} />}
              {tab === 'data' && <Database size={18} />}
              {tab === 'profile' && <User size={18} />}
              {tab === 'overview' ? 'Overview' : tab === 'activity' ? 'Activity' : tab === 'data' ? 'Data' : 'Profile'}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <button onClick={() => setActiveTab('earnings')} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-medium transition ${activeTab === 'earnings' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/30'}`}>
              <div className="flex items-center gap-3"><Wallet size={18} /> Earnings</div>
              {!data?.isAdmin && <Lock size={14} className="text-slate-400" />}
            </button>
          </div>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 cursor-pointer" onClick={() => setActiveTab('profile')}>
          <div className="flex items-center gap-3">
            <img src="https://github.com/ortizdelgadojohanjose04-ai.png" alt="Johan" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
            <div><p className="text-sm font-medium">Johan Ortiz</p><p className="text-xs text-slate-500">Creator Profile</p></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${systemStatus === 'operational' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></span>
              <p className={`text-xs font-bold tracking-wider uppercase ${systemStatus === 'operational' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {systemStatus === 'operational' ? 'SYSTEM OPERATIONAL' : 'SYSTEM DEGRADED'}
              </p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === 'overview' ? 'Performance' : activeTab === 'activity' ? 'Reliability' : activeTab === 'data' ? 'Data Metrics' : activeTab === 'earnings' ? 'Financial Overview' : 'Johan Ortiz'}
            </h1>
          </div>
          <div className="flex gap-3 items-center">
            {/* GOOGLE TRANSLATE WIDGET */}
            <div id="google_translate_element" className="hidden md:block"></div>
            
            <button onClick={() => setOpen(true)} className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-[#111113] border border-slate-200 dark:border-slate-800 text-sm text-slate-500 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              <Search size={16} /> <span className="text-xs">Search...</span> <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 rounded text-[10px]">Ctrl K</kbd>
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 bg-slate-100 dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-xl border-l-4 border-l-blue-500"><p className="text-xs text-slate-500 mb-1">TOTAL RUNS</p><p className="text-3xl font-bold">{totalRuns}</p></div>
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-xl border-l-4 border-l-emerald-500"><p className="text-xs text-slate-500 mb-1">SUCCESS RATE</p><p className="text-3xl font-bold">{globalRate}%</p></div>
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-xl border-l-4 border-l-purple-500"><p className="text-xs text-slate-500 mb-1">ACTIVE ACTORS</p><p className="text-3xl font-bold">{data?.actors?.length || 0}</p></div>
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-xl border-l-4 border-l-orange-500"><p className="text-xs text-slate-500 mb-1">DATA POINTS</p><p className="text-3xl font-bold">{estimatedDataPoints}</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2"><Chart data={data?.chartData || []} /></div>
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-sm font-semibold mb-4">Uptime (Last 30 Days)</h3>
                <div className="flex flex-wrap gap-1">
                  {data?.uptimeData?.map((day: any, i: number) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${day.status === 'success' ? 'bg-emerald-500' : day.status === 'failed' ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'}`} title={day.status}></div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Actor Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Quality Score</th>
                  <th className="p-4 text-center">Total Runs</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActors.map((actor: any) => (
                  <tr key={actor.id} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="p-4 font-medium">{actor.name}</td>
                    <td className="p-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active</span></td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={actor.stats.qualityScore > 80 ? "text-emerald-500" : "text-orange-500"}>{actor.stats.qualityScore}%</span>
                        <div className="w-24 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${actor.stats.qualityScore > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${actor.stats.qualityScore}%` }}></div></div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-slate-500">{actor.stats.totalRuns}</td>
                    <td className="p-4 text-right"><button onClick={() => { setSelectedActor(actor); setShowSettings(false); }} className="text-blue-500 hover:text-blue-400 font-medium">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-500"><Database size={18} /> Extracted Data</div>
                <p className="text-4xl font-bold text-blue-500">{estimatedDataPoints}</p>
                <p className="text-sm text-slate-500 mt-1">Estimated data points</p>
              </div>
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-500"><CheckCircle2 size={18} /> Successful Runs</div>
                <p className="text-4xl font-bold text-emerald-500">{totalSuccess}</p>
                <p className="text-sm text-slate-500 mt-1">Data processed correctly</p>
              </div>
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-500"><AlertCircle size={18} /> Data Failures</div>
                <p className="text-4xl font-bold text-rose-500">{totalFailed}</p>
                <p className="text-sm text-slate-500 mt-1">Data not extracted due to errors</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
              <Database size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-xl font-bold mb-2">Data Volume</h3>
              <p className="text-slate-500 max-w-md mx-auto">Here you can connect your external database (PostgreSQL, MongoDB) to track the real weight of extracted data (in MB/GB) per Actor.</p>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="relative animate-in fade-in duration-500">
            {!data?.isAdmin && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <Lock size={48} className="text-slate-500 dark:text-slate-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Private Data</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md text-center text-lg">This financial section is restricted to the account owner.</p>
              </div>
            )}
            <div className={`space-y-6 ${!data?.isAdmin ? 'opacity-30 pointer-events-none select-none' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2 opacity-80"><DollarSign size={18} /> Total Revenue (Real)</div>
                  <p className="text-4xl font-bold mb-1">${paypalData?.success ? paypalData.totalRevenue?.toFixed(2) : '0.00'}</p>
                  <p className="text-sm text-emerald-100">From PayPal API</p>
                </div>
                <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2 mb-2 text-slate-500"><Wallet size={18} /> PayPal Fees</div>
                  <p className="text-4xl font-bold text-rose-500 mb-1">-${paypalData?.success ? paypalData.totalFees?.toFixed(2) : '0.00'}</p>
                  <p className="text-sm text-slate-500">Platform commission</p>
                </div>
                <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2 mb-2 text-slate-500"><Activity size={18} /> Net Profit</div>
                  <p className="text-4xl font-bold text-emerald-500 mb-1">${paypalData?.success ? paypalData.netProfit?.toFixed(2) : '0.00'}</p>
                  <p className="text-sm text-slate-500">Available for withdrawal</p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Recent Transactions (Real Data)</h3>
                <div className="space-y-4">
                  {paypalData?.success && paypalData.transactions?.length > 0 ? (
                    paypalData.transactions.slice(0, 10).map((tx: any) => (
                      <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div><p className="font-medium text-slate-800 dark:text-slate-200">{tx.email}</p><p className="text-sm text-slate-500">{new Date(tx.date).toLocaleDateString()}</p></div>
                        <div className="text-right"><p className="font-bold text-emerald-500">+${tx.amount.toFixed(2)}</p><p className="text-xs text-slate-500">Fee: ${tx.fee.toFixed(2)}</p></div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">No recent transactions or PayPal connection error.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-32 bg-gradient-to-r from-blue-900 via-slate-800 to-purple-900 relative">
                <div className="absolute -bottom-12 left-8"><img src="https://github.com/ortizdelgadojohanjose04-ai.png" alt="Johan" className="w-24 h-24 rounded-full border-4 border-white dark:border-[#111113] bg-slate-800" /></div>
              </div>
              <div className="pt-16 p-8">
                <div className="flex justify-between flex-col md:flex-row gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">Johan Ortiz</h2>
                    <p className="text-emerald-500 font-medium mt-1 flex items-center gap-2"><Briefcase size={16} /> Python Developer & Data Extraction Specialist</p>
                  </div>
                  <div className="flex gap-3">
                    <a href="https://apify.com/johandev_04" target="_blank" className="bg-slate-100 dark:bg-[#1a1a1c] px-4 py-2 rounded-lg font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-2"><Activity size={16} className="text-blue-500"/> Apify Store</a>
                    <a href="https://ortizdelgadojohanjose04-ai.github.io/" target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">Portfolio <Globe size={16} /></a>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-6 max-w-3xl leading-relaxed">Systems Engineer & Data Extraction Specialist based in Costa Rica. I architect and deploy high-performance web scrapers and AI-ready data pipelines. Creator of 12 production-ready Apify Actors handling millions of request cycles with a 92%+ success rate.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Connect</h3>
                    <div className="space-y-4">
                      <a href="https://linkedin.com/in/johan-ortiz-dev" target="_blank" className="flex items-center gap-3 hover:text-blue-500 transition"><div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700"><LinkedinIcon size={18} /></div><span className="font-medium">LinkedIn</span></a>
                      <a href="https://github.com/ortizdelgadojohanjose04-ai" target="_blank" className="flex items-center gap-3 hover:text-black dark:hover:text-white transition"><div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700"><GithubIcon size={18} /></div><span className="font-medium">GitHub</span></a>
                      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ortizdelgadojohanjose04@gmail.com" target="_blank" className="flex items-center gap-3 hover:text-red-500 transition"><div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700"><Mail size={18} /></div><span className="font-medium">Email</span></a>
                    </div>
                  </div>
                  
                  {/* NUEVO BOTÓN CTA Y CV */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Work with me</h3>
                    <div className="space-y-3">
                      <a href="https://linkedin.com/in/johan-ortiz-dev" target="_blank" className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-emerald-500/20">
                        <Briefcase size={18} /> Hire Me / Contact
                      </a>
                      <a href="/cv-johan-ortiz.pdf" download className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium py-3 rounded-lg border border-slate-200 dark:border-slate-700 transition">
                        <Download size={18} /> Download CV (PDF)
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      {selectedActor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="bg-slate-50 dark:bg-[#0c0c0e] p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
              <div><h2 className="text-2xl font-bold">{selectedActor.name}</h2><p className="text-slate-500 text-sm mt-1">ID: {selectedActor.id}</p></div>
              <button onClick={() => setSelectedActor(null)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 p-2 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                 <div className="bg-slate-50 dark:bg-[#0c0c0e] p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center"><p className="text-sm text-slate-500 mb-1">Quality Score</p><p className="text-2xl font-bold text-emerald-500">{selectedActor.stats.qualityScore}%</p></div>
                 <div className="bg-slate-50 dark:bg-[#0c0c0e] p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center"><p className="text-sm text-slate-500 mb-1">Total Runs</p><p className="text-2xl font-bold">{selectedActor.stats.totalRuns}</p></div>
                 <div className="bg-slate-50 dark:bg-[#0c0c0e] p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center"><p className="text-sm text-slate-500 mb-1">Status</p><p className="text-sm font-bold text-blue-500 mt-2">Active</p></div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="flex gap-3 mb-4">
                
                <button onClick={handleRunActor} disabled={isRunning} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50">
                  <Play size={18} /> 
                  {isRunning ? 'Starting...' : 'Run Live'}
                </button>

                <a href={`https://apify.com/${selectedActor.username}/${selectedActor.name}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium py-3 rounded-lg border border-slate-200 dark:border-slate-600 transition">
                  <ExternalLink size={18} /> View on Store
                </a>
                <button onClick={() => setShowSettings(!showSettings)} className={`flex items-center justify-center gap-2 px-4 rounded-lg border transition ${showSettings ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600'}`}><Settings size={18} /></button>
              </div>
              {showSettings && (
                <div className="bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">API Endpoint</h4>
                  <div className="bg-slate-100 dark:bg-black/50 p-3 rounded border border-slate-200 dark:border-slate-800 overflow-x-auto"><code className="text-xs text-blue-600 dark:text-blue-300 font-mono">POST https://api.apify.com/v2/acts/{selectedActor.username}~{selectedActor.name}/runs?token=YOUR_TOKEN</code></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}