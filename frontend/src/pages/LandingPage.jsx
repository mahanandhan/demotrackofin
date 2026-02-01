import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ChevronRight, 
  Activity,
  Zap,
  Lock,
  Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 20) {
        const diff = 20 - hours;
        setTimeRemaining(`SYSTEM UNLOCKS IN ${diff} HOURS`);
      } else if (hours >= 20 && hours < 24) {
        setTimeRemaining("NETWORK STATUS: OPEN UNTIL MIDNIGHT");
      } else {
        setTimeRemaining("TERMINAL CLOSED - RESUMES AT 20:00");
      }
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-50 font-mono selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      
      {/* Exclusive Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 border-b ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-emerald-500/20 py-4' : 'bg-transparent border-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer animate-fade-in-down">
            <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center rounded-xl rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Activity size={24} className="text-black" />
            </div>
            <span className="text-2xl font-black uppercase italic tracking-tighter">TRACKO<span className="text-emerald-500">FIN</span></span>
          </div>

          <div className="hidden md:flex items-center gap-6 bg-white/[0.03] border border-white/10 px-6 py-2 rounded-full animate-fade-in-down delay-100">
            <Clock size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] text-white/60">SESSION: 20:00 — 00:00</span>
          </div>

          <button 
            onClick={() => navigate('/vote')}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-black px-6 py-3 rounded-xl hover:bg-emerald-500 transition-all animate-fade-in-down delay-200"
          >
            Enter Node <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative pt-48 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent opacity-50 pointer-events-none animate-pulse"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Event Details */}
          <div className={`flex-1 space-y-10 text-center lg:text-left transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 animate-bounce-slow">
              <Timer size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{timeRemaining}</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter text-white group">
                <span className="inline-block hover:animate-glitch">ONE NIGHT.</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-800 animate-pulse-slow">FOUR HOURS.</span>
              </h1>
              <p className="max-w-xl text-white/40 text-xs md:text-sm leading-relaxed uppercase tracking-[0.15em] mx-auto lg:mx-0 animate-fade-in delay-500">
                Trackofin operates exclusively between <span className="text-emerald-500">20:00 and 00:00</span>. A high-stakes window to visualize financial hierarchies before the terminal resets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={() => navigate('/vote')}
                className="group relative bg-emerald-500 text-black font-black uppercase px-12 py-6 rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                Access Registry
              </button>
              <div className="px-8 py-6 rounded-2xl border border-white/10 flex items-center gap-3 text-white/40 hover:bg-white/5 transition-colors">
                <Lock size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Limited Access</span>
              </div>
            </div>
          </div>

          {/* Right Side: The Node Image TF-8809 */}
          <div className={`flex-1 w-full max-w-xl relative transition-all duration-1000 delay-300 transform ${isVisible ? 'scale-100 opacity-100 rotate-0' : 'scale-90 opacity-0 rotate-3'}`}>
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] -z-10 animate-pulse"></div>
            
            <div className="bg-white/[0.02] border border-white/10 rounded-[4rem] p-4 backdrop-blur-3xl relative animate-float">
              {/* Scanning Laser Animation */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20 animate-scan"></div>
              
              <div className="relative rounded-[3.5rem] overflow-hidden border border-white/5 group">
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop" 
                  alt="Trackofin Visual Node" 
                  className="w-full h-[600px] object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                
                {/* ID Label */}
                <div className="absolute bottom-12 left-12 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-emerald-500 animate-expand-width"></span>
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in delay-700">Primary Registry</p>
                  </div>
                  <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter animate-glitch-delayed">NODE ID: <span className="text-emerald-500">TF-8809</span></h2>
                </div>

                {/* Status Overlay */}
                <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl animate-fade-in-down delay-1000">
                  <Zap size={20} className="text-emerald-500 mb-1 animate-pulse" />
                  <p className="text-[8px] font-black text-white/40 uppercase">Sync Status</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Schedule */}
      <footer className="py-20 border-t border-white/5 text-center px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-center gap-4">
            {[20, 21, 22, 23, 0].map((hour, i) => (
              <div 
                key={hour} 
                style={{ animationDelay: `${i * 100}ms` }}
                className={`w-12 h-12 flex flex-col items-center justify-center border rounded-lg animate-fade-in-up ${hour === 0 ? 'border-red-500/20 text-red-500' : 'border-emerald-500/20 text-emerald-500'}`}
              >
                <span className="text-[10px] font-black">{hour === 0 ? '00' : hour}</span>
                <span className="text-[6px] font-bold">HRS</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 animate-pulse">
            Node-Access strictly prohibited outside operational window.
          </p>
          <div className="pt-10 opacity-30">
            <p className="text-[9px] text-white/5 uppercase tracking-[1em]">© 2026 TRACKOFIN_CORP // PRIVATE_SESSION</p>
          </div>
        </div>
      </footer>

      {/* Global Animation Keyframes */}
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes expand-width {
          from { width: 0; }
          to { width: 32px; }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-expand-width { animation: expand-width 1s ease-out forwards; }
        .animate-glitch:hover { animation: glitch 0.3s linear infinite; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>

    </div>
  );
};

export default LandingPage;