import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Moon, 
  Vote, 
  Loader2, 
  AlertCircle, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  LogOut, 
  RefreshCcw,
  Activity,
  ChevronRight
} from 'lucide-react';

const VotingPage = ({ onExit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('gauntlet_index');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [currentChampion, setCurrentChampion] = useState(() => {
    const saved = localStorage.getItem('gauntlet_champion');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isFinished, setIsFinished] = useState(() => {
    const saved = localStorage.getItem('gauntlet_finished');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('gauntlet_index', currentIndex);
    localStorage.setItem('gauntlet_finished', isFinished);
    if (currentChampion) {
      localStorage.setItem('gauntlet_champion', JSON.stringify(currentChampion));
    }
  }, [currentIndex, currentChampion, isFinished]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Using the trackofin production API
      const response = await axios.get('https://trackofin.onrender.com/api/data');
      const items = Array.isArray(response.data.data) 
        ? response.data.data 
        : (Array.isArray(response.data) ? response.data : []);
      
      if (items.length < 2) {
        setError('At least 2 candidates are required for the Gauntlet.');
      } else {
        setData(items);
        if (!currentChampion && items.length > 0) {
          setCurrentChampion(items[0]);
        }
        setError(null);
      }
    } catch (err) {
      setError('Connection failed. Please ensure the Trackofin API is operational.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVote = async (winner) => {
    // 1. Increment the count in the backend immediately
    try {
      await axios.post(`https://trackofin.onrender.com/api/data/increment/${winner._id}`);
    } catch (err) {
      console.error('Failed to increment match win:', err);
    }

    // 2. Flow logic: Move to next challenger or finish
    if (currentIndex < data.length - 1) {
      setCurrentChampion(winner);
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentChampion(winner);
      setIsFinished(true);
    }
  };

  const resetGauntlet = () => {
    localStorage.removeItem('gauntlet_index');
    localStorage.removeItem('gauntlet_champion');
    localStorage.removeItem('gauntlet_finished');
    setCurrentIndex(1);
    setIsFinished(false);
    if (data.length > 0) setCurrentChampion(data[0]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
            <Loader2 className="text-emerald-500 animate-spin" size={64} />
            <Activity className="absolute inset-0 m-auto text-emerald-500/50 animate-pulse" size={24} />
        </div>
        <div className="text-center space-y-2">
            <h1 className="text-emerald-500 font-black text-xl uppercase tracking-[0.4em] animate-pulse">
              SYNCING TERMINAL
            </h1>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Establishing Neural Link to Trackofin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-50 font-mono selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Background Noise & Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-emerald-500/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] rotate-3 group-hover:rotate-0 transition-transform">
              <Activity size={20} className="text-black" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              TRACKO <span className="text-emerald-500">FIN</span>
            </span>
          </div>

          {!isFinished && data.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Active Session</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Round {currentIndex} / {data.length - 1}</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
              <button 
                onClick={onExit}
                className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-red-500 transition-colors"
                title="Exit Terminal"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-32">
        {error && (
          <div className="mb-12 p-8 border border-red-500/30 bg-red-500/5 rounded-[2rem] flex items-center gap-6 text-red-200 animate-in fade-in duration-500">
            <AlertCircle size={32} />
            <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest">Protocol Interrupted</p>
                <p className="text-xs opacity-60 uppercase">{error}</p>
            </div>
          </div>
        )}

        {!isFinished && data.length >= 2 && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                <Zap size={12} fill="currentColor" /> Live Node Selection
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
                FACE <span className="text-emerald-500">OFF.</span>
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative py-10">
              {/* VS Divider */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#050505] border border-emerald-500/30 w-16 h-16 rounded-full flex items-center justify-center font-black text-emerald-500 italic shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse">
                VS
              </div>

              <FighterCard 
                label="Current Node"
                candidate={currentChampion} 
                onClick={() => handleVote(currentChampion)}
                isChamp
              />

              <FighterCard 
                label="New Challenger"
                candidate={data[currentIndex]} 
                onClick={() => handleVote(data[currentIndex])}
              />
            </div>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto space-y-4 pt-10">
                <div className="flex justify-between items-end px-2">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Sequence Progress</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{Math.round((currentIndex / (data.length - 1)) * 100)}%</span>
                </div>
                <div className="flex gap-2 h-2">
                    {data.slice(1).map((_, i) => (
                    <div 
                        key={i} 
                        className={`flex-1 rounded-full transition-all duration-700 ${i + 1 <= currentIndex ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/5'}`} 
                    />
                    ))}
                </div>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="text-center space-y-12 py-12 animate-in zoom-in-95 duration-1000">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-emerald-500/30 blur-[120px] rounded-full group-hover:bg-emerald-500/50 transition-all"></div>
              <CheckCircle2 className="relative text-emerald-500 w-32 h-32 mx-auto animate-bounce-slow" />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter">
                REGISTRY <span className="text-emerald-500 text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-800">SYNCED.</span>
              </h2>
              <p className="text-white/30 font-bold uppercase tracking-[0.4em] max-w-xl mx-auto text-xs leading-loose">
                You have reached the end of the current sequence. All hierarchical decisions have been hard-coded into the Trackofin database.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
              <button 
                onClick={resetGauntlet}
                className="group w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-emerald-500 text-black font-black rounded-2xl hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] uppercase tracking-widest text-sm"
              >
                <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-700" /> Restart Protocol
              </button>
              
              <button 
                onClick={onExit}
                className="group w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-red-500 hover:text-black hover:border-red-500 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
              >
                <LogOut size={20} /> Terminate
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

const FighterCard = ({ candidate, onClick, label, isChamp = false }) => (
  <button
    onClick={onClick}
    className={`group relative w-full p-8 md:p-14 rounded-[4rem] border-2 text-center transition-all duration-700 overflow-hidden ${
      isChamp 
        ? 'border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]' 
        : 'border-white/5 bg-white/[0.02] hover:border-emerald-500/40'
    }`}
  >
    {/* Scanning Effect on Hover */}
    <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20 opacity-0 group-hover:animate-scan-vertical"></div>
    
    <div className="absolute top-8 left-0 right-0 flex justify-center">
      <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border ${
        isChamp ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-black/50 text-white/30 border-white/10'
      }`}>
        {label}
      </span>
    </div>

    <div className="mt-12 relative inline-block">
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 ${isChamp ? 'bg-emerald-500' : 'bg-white'}`}></div>
        <div className="relative">
            <img 
                src={candidate?.photo || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&q=80'} 
                alt="" 
                className="w-36 h-36 md:w-56 md:h-56 rounded-full object-cover border-4 border-black group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0 brightness-75 group-hover:brightness-100" 
            />
            {/* Corner Markers */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-500 group-hover:scale-125 transition-transform"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-500 group-hover:scale-125 transition-transform"></div>
        </div>
    </div>

    <div className="mt-10 space-y-3">
      <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter truncate group-hover:text-emerald-500 transition-colors">
        {candidate?.title || 'Unknown Node'}
      </h3>
      <div className="flex items-center justify-center gap-3 text-white/20 group-hover:text-emerald-500/60 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">
        <Vote size={14} /> Commit to Registry
      </div>
    </div>

    <style>{`
        @keyframes scan-vertical {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .group-hover\\:animate-scan-vertical {
            animation: scan-vertical 2s linear infinite;
        }
    `}</style>
  </button>
);

export default VotingPage;