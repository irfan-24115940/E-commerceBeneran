/**
 * ============================================
 * FILE: Register.jsx
 * ASSIGNED TO: Muhammad Irfan Amelianso (24.11.5940)
 * JOBDESK: Halaman Register
 * ============================================
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPass) {
      setError("Password tidak cocok.");
      return;
    }
    if (!agree) {
      setError("Setujui Syarat & Ketentuan.");
      return;
    }
    setLoading(true);

      await new Promise((r) => setTimeout(r, 1200));

      const success = await register(name, email, password);

      if (!success) {
        setError("Terjadi kesalahan. Coba lagi.");
      } else {
        navigate(from, { replace: true });
      }

      setLoading(false);
    }

  const strength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: "Weak", color: "#ef4444", w: "30%" };
    if (password.length < 10) return { label: "Good", color: "#f59e0b", w: "65%" };
    return { label: "Strong", color: "#10b981", w: "100%" };
  };
  const pwStrength = strength();

  return (
    <main className="min-h-screen flex overflow-hidden bg-[#0a0a16]">
      
      {/* ── LEFT SIDE: DYNAMIC COLLAGE (WOW FACTOR) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f0f1e] items-center justify-center overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--accent) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        {/* Floating Collage */}
        <div className="relative w-full h-full 
              flex items-center 
              justify-center">
           {/* Main Large Image */}
           <div className="absolute w-3/4 h-[60%] rounded-[40px] overflow-hidden shadow-2xl z-10 animate-float">
              <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Main" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10101a] via-transparent to-transparent opacity-60" />
           </div>

           {/* Smaller Floating Image 1 */}
           <div className="absolute top-[10%] right-[10%] w-48 h-64 rounded-3xl overflow-hidden shadow-2xl z-20 animate-float" style={{ animationDelay: '1s' }}>
              <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Detail 1" />
           </div>

           {/* Smaller Floating Image 2 */}
           <div className="absolute bottom-[10%] left-[10%] w-56 h-40 rounded-3xl overflow-hidden shadow-2xl z-20 animate-float" style={{ animationDelay: '2s' }}>
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Detail 2" />
           </div>

           {/* Brand Logo Floating */}
           <div className="absolute top-12 left-12 z-30 animate-fade-in">
              <div className="flex items-center gap-4 glass-premium p-4 rounded-3xl border border-white/10">
                 <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary font-black text-xl shadow-xl">M</div>
                 <div>
                    <h2 className="text-white text-lg font-black tracking-tighter">MistCo Premium</h2>
                    <p className="text-accent text-[9px] font-bold uppercase tracking-widest">Exclusive Collection</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: GLASSMORPHISM FORM ── */}
      <div className="w-full lg:w-1/2 
            flex items-center 
            justify-center p-4 sm:p-12
            relative overflow-y-auto">
        {/* Animated Background Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="w-full max-w-[480px] glass-premium p-6 sm:p-12 rounded-[40px] border border-white/5 shadow-2xl relative z-10 animate-scale-up">
          
          {/* Mobile Header Image (Visible only on mobile) */}
          <div className="lg:hidden w-full h-40 rounded-3xl overflow-hidden mb-8">
             <img 
               src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop" 
               className="w-full h-full object-cover"
               alt="Mobile Banner"
             />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Daftar Akun</h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">Join The Revolution</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-shake">
               ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Nama */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] 
                text-white/30 ml-1 group-focus-within:text-accent transition-colors">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full
                  bg-white/5 border
                  border-white/10 rounded-2xl px-6 py-4
                  text-white
                  placeholder:text-white/10 focus:border-accent 
                  focus:bg-white/10 outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 group-focus-within:text-accent transition-colors">Email Address</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full 
                  bg-white/5 border 
                  border-white/10 rounded-2xl px-6 py-4 
                  text-white
                  placeholder:text-white/10 focus:border-accent 
                  focus:bg-white/10 outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 group-focus-within:text-accent transition-colors">Create Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border 
                    border-white/10 rounded-2xl px-6 py-4 
                    text-white 
                    placeholder:text-white/10 focus:border-accent 
                    focus:bg-white/10 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity">
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {pwStrength && (
                   <div className="mt-3">
                      <div className="h-1 w-full 
                          bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full transition-all duration-700" 
                            style={{ width: pwStrength.w, background: pwStrength.color }} />
                      </div>
                      <p className="text-[9px] font-bold mt-2 uppercase tracking-tighter" 
                            style={{ color: pwStrength.color }}>Security: {pwStrength.label}</p>
                   </div>
                )}
              </div>

              {/* Confirm */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Confirm Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  required
                  className="w-full 
                  bg-white/5 border 
                  border-white/10 rounded-2xl px-6 py-4 
                  text-white 
                  placeholder:text-white/10 focus:border-accent 
                  focus:bg-white/10 outline-none transition-all"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group py-2">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="w-5 h-5 rounded-lg border-white/10 bg-white/5 accent-accent" />
              <span className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest font-bold">I agree to Terms & Privacy Policy</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group btn-premium py-5 
              rounded-2xl text-base font-black tracking-[0.1em]
              shadow-[0_20px_40px_rgba(201,169,110,0.3)] 
              hover:shadow-[0_25px_60px_rgba(201,169,110,0.5)] transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] 
                  group-hover:translate-x-[100%] 
                  transition-transform 
                  duration-700 ease-in-out" />
              {loading ? 
              <span className="flex items-center justify-center gap-3">
              <div 
                  className="w-5 h-5 border-2 border-primary/30 border-t-primary 
                  rounded-full animate-spin" />Memproses...
              </span> : "JOIN THE REVOLUTION"}
            </button>
          </form>

          <p className="text-center mt-10 text-xs text-white/30 font-medium">
            Sudah punya akun? <Link to="/login" className="text-accent font-black hover:tracking-widest transition-all">MASUK DISINI</Link>
          </p>

        </div>
      </div>

    </main>
  );
}

export default Register;
