import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  Type, 
  Send, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  Database,
  Trash2
} from 'lucide-react';

const AddData = () => {
  const [formData, setFormData] = useState({
    title: '',
    photo: ''
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingData, setExistingData] = useState([]);

  // Base URL for your API
  const API_BASE = 'http://localhost:5000/api/data';

  // Fetch data to show current candidates below the form
  const fetchCurrentData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/`);
      // Your backend returns { data: [...] }, so we access response.data.data
      setExistingData(response.data.data || []);
    } catch (err) {
      console.error("Error fetching list:", err);
    }
  };

  useEffect(() => {
    fetchCurrentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      // Matches your router: router.post('/add-data', adddata);
      await axios.post(`${API_BASE}/add-data`, formData);

      setStatus({ 
        type: 'success', 
        message: `Candidate "${formData.title}" successfully added.` 
      });
      setFormData({ title: '', photo: '' });
      fetchCurrentData();
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to connect to the server.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteUpdate = async (id, type) => {
    try {
      const action = type === 'inc' ? 'increment' : 'decrement';
      await axios.post(`${API_BASE}/${action}/${id}`);
      fetchCurrentData();
    } catch (err) {
      console.error(`Error ${type}ing count:`, err);
    }
  };

  // Helper function to handle broken image links
  const handleImgError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-50 font-mono p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Form */}
        <div className="w-full">
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-500 mb-2">
              <PlusCircle size={20} />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Admin Entry</span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Add <span className="text-emerald-500">New Card</span>
            </h1>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            {status.type && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="text-xs font-bold uppercase tracking-tight">{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-emerald-500/60 uppercase font-black tracking-widest flex items-center gap-2">
                  <Type size={12} /> Card Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-emerald-500/60 uppercase font-black tracking-widest flex items-center gap-2">
                  <ImageIcon size={12} /> Image URL
                </label>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  placeholder="Paste URL here (https://...)"
                  className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              {formData.photo && (
                <div className="p-4 border border-white/5 bg-white/[0.01] rounded-2xl flex items-center gap-4">
                  <img 
                    src={formData.photo} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-lg object-cover border border-white/10 shadow-lg"
                    onError={handleImgError}
                  />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Preview</p>
                    <p className="text-sm font-bold text-emerald-500 truncate max-w-[150px]">{formData.title || "Untitled"}</p>
                  </div>
                </div>
              )}

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-900 text-black font-black uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Add Card</>}
              </button>
            </form>
          </div>
          
          <button 
            onClick={() => window.history.back()}
            className="mt-8 flex items-center gap-2 text-white/20 hover:text-emerald-500 transition-colors text-xs font-bold uppercase"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Right Side: Quick Management */}
        <div className="w-full">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <Database size={20} />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Management</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase italic">Live <span className="text-emerald-500">Registry</span></h2>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar">
            {existingData.length === 0 ? (
              <div className="p-20 text-center text-white/10 text-xs uppercase font-bold border border-dashed border-white/5 rounded-[2rem]">
                No data found in neural link
              </div>
            ) : (
              existingData.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={item.photo} 
                        alt="" 
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 bg-black" 
                        onError={handleImgError}
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050505]"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-black tracking-widest">
                          {item.count} VOTES
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => handleVoteUpdate(item._id, 'inc')}
                        className="p-1.5 hover:bg-emerald-500/20 text-white/20 hover:text-emerald-400 rounded-lg transition-all"
                        title="Increment"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button 
                        onClick={() => handleVoteUpdate(item._id, 'dec')}
                        className="p-1.5 hover:bg-red-500/20 text-white/20 hover:text-red-400 rounded-lg transition-all"
                        title="Decrement"
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddData;