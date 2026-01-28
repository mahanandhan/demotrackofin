import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Moon, Vote, Loader2, AlertCircle, Trophy, Zap, CheckCircle2, LogOut, RefreshCcw } from 'lucide-react';

const App = () => {
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
      setError('Connection failed. Please ensure your API is running at localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVote = async (winner) => {
    // 1. ALWAYS increment the count in the backend immediately on every click.
    // This ensures if A beats B, A gets +1. If A then beats C, A gets another +1.
    try {
      await axios.post(`http://localhost:5000/api/data/increment/${winner._id}`);
    } catch (err) {
      console.error('Failed to increment match win:', err);
    }

    // 2. Update the flow logic
    if (currentIndex < data.length - 1) {
      // Move to next challenger
      setCurrentChampion(winner);
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of gauntlet
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

  const exitApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-emerald-500 animate-spin" size={48} />
        <h1 className="text-emerald-500 font-mono text-xl animate-pulse uppercase tracking-widest text-center px-4">
          Restoring Protocol State...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-50 font-mono selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-emerald-500/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Moon size={20} className="text-black" fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">
              TRACKO <span className="text-emerald-500">FIN</span>
            </span>
          </div>
          {!isFinished && data.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                Round {currentIndex} of {data.length - 1}
              </span>
            </div>
          )}
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-32">
        {error && (
          <div className="mb-12 p-6 border border-red-500/30 bg-red-500/5 rounded-2xl flex items-center gap-4 text-red-200 animate-in fade-in duration-500">
            <AlertCircle size={24} />
            <p className="text-sm font-bold uppercase">{error}</p>
          </div>
        )}

        {!isFinished && data.length >= 2 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center space-y-2">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                Face <span className="text-emerald-500 underline underline-offset-8 decoration-2">Off</span>
              </h2>
              <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-[0.3em]">Survivor faces the next challenger</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black border border-emerald-500/50 w-12 h-12 rounded-full flex items-center justify-center font-black text-emerald-500 italic shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                VS
              </div>

              <FighterCard 
                label="Current King"
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

            <div className="flex justify-center pt-8">
              <div className="flex gap-2">
                {data.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= currentIndex ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-emerald-500/10'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="text-center space-y-12 py-12 animate-in zoom-in-95 duration-700">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
              <CheckCircle2 className="relative text-emerald-500 w-24 h-24 mx-auto" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                Gauntlet <span className="text-emerald-500">Completed</span>
              </h2>
              <p className="text-emerald-500/60 font-bold uppercase tracking-[0.2em] max-w-md mx-auto">
                All match victories have been recorded.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <button 
                onClick={resetGauntlet}
                className="group w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-emerald-500 text-black font-black rounded-xl hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                <RefreshCcw size={20} /> RESTART PROTOCOL
              </button>
              
              <button 
                onClick={exitApp}
                className="group w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-red-500 hover:text-black hover:border-red-500 transition-all transform hover:scale-105 active:scale-95"
              >
                <LogOut size={20} /> EXIT
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const FighterCard = ({ candidate, onClick, label, isChamp = false }) => (
  <button
    onClick={onClick}
    className={`group relative w-full p-6 md:p-10 rounded-[3rem] border-2 text-center transition-all duration-500 overflow-hidden ${
      isChamp 
        ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]' 
        : 'border-white/10 bg-white/2 hover:border-emerald-500/50'
    }`}
  >
    <div className="absolute top-6 left-1/2 -translate-x-1/2">
      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        isChamp ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-black/50 text-white/40 border-white/10'
      }`}>
        {label}
      </span>
    </div>
    <div className="mt-8 relative inline-block">
      <img 
        src={candidate?.photo || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&q=80'} 
        alt="" 
        className="relative w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-black group-hover:scale-105 transition-transform duration-500" 
      />
    </div>
    <div className="mt-6 space-y-2">
      <h3 className="text-2xl md:text-3xl font-black text-white uppercase truncate">
        {candidate?.title || 'Unknown'}
      </h3>
      <div className="flex items-center justify-center gap-2 text-emerald-500/40 font-bold text-xs uppercase">
        <Vote size={14} /> Tap to select
      </div>
    </div>
  </button>
);

export default App;