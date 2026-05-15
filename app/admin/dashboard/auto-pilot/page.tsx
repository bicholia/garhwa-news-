'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  Radio, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Database,
  Cpu
} from 'lucide-react'

// --- Types ---
type AgentAction = {
  id: string
  time: string
  agent_name: string
  type: 'FETCH' | 'WRITE' | 'IMAGE' | 'PUBLISH' | 'TELEGRAM' | 'FAIL'
  message: string
  details?: string
  status: 'success' | 'warning' | 'error' | 'processing'
}

// --- Styles ---
const styles = {
  container: {
    fontFamily: "'Outfit', sans-serif",
    maxWidth: 1400,
    margin: '0 auto',
    padding: '2rem',
    color: '#1e293b'
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
  }
}

// --- Agent Cards Header Component ---
const AgentCards = ({ activeAgent }: { activeAgent?: string }) => {
  const agents = [
    { id: 'PULSE', icon: <Radio size={20} />, label: 'Reporter', color: 'blue' },
    { id: 'STRATOS', icon: <Cpu size={20} />, label: 'SEO Tech', color: 'purple' },
    { id: 'ORACLE', icon: <ShieldCheck size={20} />, label: 'Validator', color: 'emerald' },
    { id: 'VISION', icon: <Zap size={20} />, label: 'Designer', color: 'amber' },
    { id: 'SOCIAL', icon: <Send size={20} />, label: 'Publicist', color: 'sky' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {agents.map((a) => (
        <motion.div 
          key={a.id}
          animate={{ scale: activeAgent === a.id ? 1.05 : 1 }}
          className={`p-5 rounded-[2rem] border-2 transition-all ${
            activeAgent === a.id 
            ? `bg-white border-${a.color}-500 shadow-2xl shadow-${a.color}-200/50` 
            : 'bg-white/50 border-slate-100 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
             <div className={`p-2.5 rounded-2xl ${activeAgent === a.id ? `bg-${a.color}-500 text-white` : 'bg-slate-200 text-slate-400'}`}>
                {a.icon}
             </div>
             <div className={`w-2.5 h-2.5 rounded-full ${activeAgent === a.id ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-slate-300'}`} />
          </div>
          <div className={`font-black text-sm tracking-tighter ${activeAgent === a.id ? 'text-slate-900' : 'text-slate-400'}`}>{a.id}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{a.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

export default function AutoPilotDashboard() {
  const [isLaunching, setIsLaunching] = useState(false)
  const [actions, setActions] = useState<AgentAction[]>([])
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [stats, setStats] = useState({
    publishedToday: 0,
    successRate: 99.1,
    lastRun: '--:--',
    nextRun: 'AUTO'
  })

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/agent-status')
      const data = await res.json()
      if (data.success) {
        setActions(data.logs)
        setStats(data.stats)
        if (data.logs.length > 0 && isLaunching) {
          setActiveStep(data.logs[0].agent_name)
        }
      }
    } catch (e) {
      console.error('Fetch Status Error:', e)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 4000)
    return () => clearInterval(interval)
  }, [isLaunching])

    const triggerManualRun = async () => {
    if (isLaunching) return;
    setIsLaunching(true)
    setActiveStep('PULSE')
    try {
      const res = await fetch('/api/ai-news-agent?manual=true')
      const data = await res.json()
      if (data.success) {
        await fetchStatus()
      } else {
        alert('Neural Agency Pipeline Failed: ' + (data.error || 'Unknown error'))
      }
    } catch (e) {
      alert('Network Error: Could not engage neural matrix.')
    } finally {
      setIsLaunching(false)
      setActiveStep(null)
    }
  }

  const handleRefresh = () => {
      fetchStatus()
  }

  return (
    <div style={styles.container} className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 flex items-center gap-3 md:gap-4">
             <div className="p-2 md:p-3 bg-slate-900 rounded-xl md:rounded-[1.5rem] shadow-2xl">
               <Cpu className="text-white" size={24} />
             </div>
             NEURAL AGENCY <span className="hidden sm:inline-block text-[10px] bg-indigo-600 text-white px-4 py-1.5 rounded-full font-black tracking-[0.2em] uppercase">V4 Multicore</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2 md:mt-3 text-sm md:text-lg">Zero-Touch Multi-Agent Orchestration Bureau</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="p-4 md:px-6 bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] text-slate-600 hover:bg-slate-50 transition-all shadow-lg"
            title="Refresh Status"
          >
            <Activity size={20} className={isLaunching ? 'animate-pulse' : ''} />
          </button>
          <button 
            onClick={triggerManualRun}
            disabled={isLaunching}
            className={`flex-1 md:flex-none px-6 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-sm md:text-lg tracking-tight flex items-center justify-center gap-3 md:gap-4 transition-all shadow-2xl relative overflow-hidden group ${
              isLaunching ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
             {isLaunching && (
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent text-white"
                />
             )}
            {isLaunching ? (
                <>
                  <Activity className="animate-spin" size={20} /> <span className="hidden sm:inline">PIPELINE ACTIVE...</span><span className="sm:hidden">ACTIVE...</span>
                </>
            ) : (
                <>
                  <Zap size={20} className="group-hover:text-amber-400 transition-colors" /> ENGAGE AGENTS
                </>
            )}
          </button>
        </div>
      </div>

      <AgentCards activeAgent={activeStep || undefined} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Agency Output', value: stats.publishedToday, suffix: 'Stories' },
              { label: 'Intelligence Trust', value: stats.successRate, suffix: '%' },
              { label: 'Neural Sync', value: stats.lastRun, suffix: 'IST' },
              { label: 'Active Matrix', value: '5', suffix: 'Agents' }
            ].map((s, i) => (
              <div key={i} className="p-4 md:p-8 bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 mb-1 md:mb-2 tracking-widest">{s.label}</div>
                <div className="flex items-baseline gap-1 md:gap-2">
                   <div className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">{s.value}</div>
                   <div className="text-[10px] font-black text-slate-300">{s.suffix}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.glassCard} className="h-[550px] flex flex-col overflow-hidden bg-white/80 border-slate-100 shadow-2xl shadow-indigo-100/20">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/40">
              <h3 className="font-black text-sm tracking-[0.2em] uppercase text-slate-900 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                 Neural Orchestration Stream
              </h3>
              <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Real-time Multi-Agent Telemetry</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03)_0%,transparent_50%)]">
              <AnimatePresence mode="popLayout">
                {actions.length > 0 ? actions.map((action) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={action.id} 
                    className="flex items-start gap-5 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-lg shadow-slate-200/20 group hover:border-indigo-100 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 min-w-[70px]">
                       <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter text-white shadow-lg ${
                         action.agent_name === 'ORACLE' ? 'bg-emerald-500 shadow-emerald-100' : 
                         action.agent_name === 'VISION' ? 'bg-amber-500 shadow-amber-100' : 
                         action.agent_name === 'SOCIAL' ? 'bg-sky-500 shadow-sky-100' : 
                         action.agent_name === 'STRATOS' ? 'bg-purple-500 shadow-purple-100' : 
                         'bg-slate-900 shadow-slate-200'
                       }`}>
                          {action.agent_name}
                       </div>
                       <span className="text-[10px] text-slate-300 font-black">{action.time}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-slate-700 leading-tight group-hover:text-slate-900 transition-colors">{action.message}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      action.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                        {action.status}
                    </div>
                  </motion.div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center gap-6 text-slate-400">
                        <Cpu size={64} className="opacity-10 animate-spin-slow" />
                        <span className="font-black text-sm tracking-[0.2em] uppercase opacity-30">Synchronizing Matrix...</span>
                    </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-10 bg-slate-900 rounded-[3rem] border-0 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
             <div className="relative z-10 text-white">
                <h4 className="text-xs font-black tracking-[0.3em] uppercase text-indigo-400 mb-10 italic">Core Agency Protocols</h4>
                <div className="space-y-8">
                   {[
                     { label: 'PULSE Investigative v4', active: true },
                     { label: 'STRATOS Link Guard', active: true },
                     { label: 'ORACLE Neural Validator', active: true },
                     { label: 'VISION Cinematic Synthesizer', active: true },
                     { label: 'SOCIAL Distro Intelligence', active: true }
                   ].map((p, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${p.active ? 'bg-emerald-400 animate-pulse shadow-[0_0_15px_#10b981]' : 'bg-slate-700'}`} />
                        <span className="text-xs font-black text-slate-300 tracking-tight">{p.label}</span>
                     </div>
                   ))}
                </div>
                <div className="mt-16 p-8 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                   <div className="text-[10px] text-indigo-300 font-black mb-2 uppercase tracking-[0.3em]">Operational Level</div>
                   <div className="text-xl font-black text-white tracking-tighter">FULLY AUTONOMOUS</div>
                </div>
             </div>
          </div>

          <div style={styles.glassCard} className="p-8 border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-8 px-2">Pipeline Matrix</h3>
            <div className="space-y-6">
              {[
                { label: 'Neutral Intelligence', value: 99.8, color: 'emerald' },
                { label: 'Scraping Efficiency', value: 94.2, color: 'indigo' },
                { label: 'Vision Accuracy', value: 89, color: 'amber' }
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">
                     <span>{m.label}</span>
                     <span className={`text-${m.color}-500`}>{m.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${m.value}%` }}
                       transition={{ duration: 2, ease: 'easeOut' }}
                       className={`h-full bg-${m.color === 'emerald' ? 'emerald-500' : m.color === 'amber' ? 'amber-500' : 'indigo-600'}`} 
                     />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-[10px] text-slate-400 font-bold leading-relaxed text-center px-4">
               Neural Agency V4 uses distributed computing to process high-impact news stories with 100% autonomy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
