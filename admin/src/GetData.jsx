import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { RefreshCw, TrendingUp, Users, Trophy, LayoutDashboard, PieChart as PieIcon, Activity, Target } from 'lucide-react';

const GetData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      const items = response.data.data || response.data;
      setData(items);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to sync with central database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalVotes = data.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const topCandidate = sortedData[0];

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <RefreshCw className="text-emerald-500 animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-50 font-mono p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <LayoutDashboard size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Command Center of <span className='text-green'>Trackofin</span></span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Real-Time <span className="text-emerald-500">Analytics</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] text-emerald-500/50 uppercase font-bold">Auto-Sync Active</p>
            <p className="text-xs text-white">Last update: {lastUpdated.toLocaleTimeString()}</p>
          </div>
          <RefreshCw size={20} className="text-emerald-500 animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] relative overflow-hidden group">
            <TrendingUp className="absolute -right-4 -bottom-4 text-emerald-500/10 w-24 h-24" />
            <p className="text-emerald-500/60 text-xs font-bold uppercase mb-1">Total Impact</p>
            <h2 className="text-4xl font-black text-white">{totalVotes}</h2>
          </div>

          <div className="bg-emerald-500 p-6 rounded-[2rem] text-black relative overflow-hidden">
            <Trophy className="absolute -right-4 -bottom-4 text-black/10 w-24 h-24" />
            <p className="text-black/60 text-xs font-bold uppercase mb-1">Current Leader</p>
            <h2 className="text-2xl font-black uppercase truncate">{topCandidate?.title || 'N/A'}</h2>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] relative overflow-hidden">
            <Activity className="absolute -right-4 -bottom-4 text-emerald-500/10 w-24 h-24" />
            <p className="text-emerald-500/60 text-xs font-bold uppercase mb-1">Active Nodes</p>
            <h2 className="text-4xl font-black text-white">{data.length}</h2>
          </div>
        </div>

        {/* Primary Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Graph 1: Bar Chart (Volume) */}
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2.5rem]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                  <Target className="text-emerald-500" size={18} /> Match Victories
                </h3>
                <p className="text-white/40 text-[10px] uppercase">Raw victory count per candidate</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="title" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#ffffff20', fontSize: 10}} />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{backgroundColor: '#000', border: '1px solid #10b98130', borderRadius: '12px'}}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.count === topCandidate.count ? '#10b981' : '#10b98130'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graph 2: Area Chart (Performance Spread) */}
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2.5rem]">
            <div className="mb-6">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <Activity className="text-emerald-500" size={18} /> Performance Curve
              </h3>
              <p className="text-white/40 text-[10px] uppercase">Competitive density mapping</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #10b98130', borderRadius: '12px'}} />
                  <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graph 3: Pie Chart (Vote Share) */}
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2.5rem]">
            <div className="mb-6">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <PieIcon className="text-emerald-500" size={18} /> Vote Share
              </h3>
              <p className="text-white/40 text-[10px] uppercase">Market dominance percentage</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#064e3b'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '10px', textTransform: 'uppercase'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graph 4: Radar Chart (Competitive Presence) */}
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2.5rem]">
            <div className="mb-6">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <Target className="text-emerald-500" size={18} /> Presence Radar
              </h3>
              <p className="text-white/40 text-[10px] uppercase">Candidate reach visualization</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="title" tick={{fill: '#ffffff40', fontSize: 8}} />
                  <Radar
                    name="Votes"
                    dataKey="count"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.5}
                  />
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #10b98130', borderRadius: '12px'}} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Live Standings Footer */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Users size={16} /> Rankings Table
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold uppercase">Real-time update stream</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {sortedData.map((item, idx) => (
              <div key={item._id} className="flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors border-r border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500/30 text-xs font-bold w-4">#{idx + 1}</span>
                  <div className="relative">
                    <img src={item.photo} alt="" className="w-10 h-10 rounded-full object-cover grayscale hover:grayscale-0 transition-all" />
                    {idx === 0 && <Trophy size={14} className="absolute -top-1 -right-1 text-yellow-500 bg-black rounded-full p-0.5" />}
                  </div>
                  <span className="text-xs font-bold uppercase truncate max-w-[100px]">{item.title}</span>
                </div>
                <div className="text-right">
                  <div className="text-emerald-500 font-black text-sm">{item.count}</div>
                  <div className="text-[8px] text-white/20 uppercase font-bold">Matches</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GetData;