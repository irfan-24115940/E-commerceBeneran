/**
 * ============================================
 * FILE: Login.jsx
 * ASSIGNED TO: Muhammad Irfan Amelianso (24.11.5940)
 * JOBDESK: Halaman Login
 * ============================================
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    if (!login(email, password)) {
      setError("Kredensial tidak valid. Silakan coba lagi.");
    } else {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center 
         justify-center p-6 bg-app relative overflow-hidden">
      
      {/* ── AMBIENT DECORATION ── */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />

      {/* ── LOGIN CONTAINER ── */}
      <div className="max-w-[1200px] w-full flex 
      bg-white 
      dark:bg-white/5 rounded-[48px] overflow-hidden shadow-2xl border 
      border-gray-100 
      dark:border-white/10 animate-scale-up">
        
        {/* LEFT: CINEMATIC IMAGE */}
        <div className="hidden lg:block w-1/2 relative group overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
             className="w-full h-full object-cover 
             transition-transform duration-1000 
             group-hover:scale-110" 
             alt="Fashion" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
           <div className="absolute bottom-16 left-16 right-16">
              <span className="section-tag !bg-accent !text-primary !mb-4">MistCo Member</span>
              <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-tight">Selamat Datang Kembali di Dunia Eksklusif.</h2>
              <p className="text-white/60 text-sm font-medium">Masuk untuk melanjutkan perjalanan gaya Anda yang tak tertandingi.</p>
           </div>
           
           {/* Floating Badge */}
           <div className="absolute top-12 left-12 p-6 glass-premium rounded-[32px] border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-primary font-black text-xl shadow-xl">M</div>
              <div>
                 <p className="text-white font-black text-xs uppercase tracking-widest">MistCo Platform</p>
                 <p className="text-accent/60 font-bold text-[8px] uppercase tracking-widest">Premium Modest Wear</p>
              </div>
           </div>
        </div>

        {/* RIGHT: FORM SECTION */}
        <div className="w-full lg:w-1/2 p-10 md:p-20 relative">
           <div className="max-w-md mx-auto">
              
              <div className="mb-12">
                 <h1 className="text-4xl font-black mb-2 tracking-tighter">Login Member</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Silakan masukkan akun Anda</p>
              </div>

              {error && (
                <div className="mb-8 p-4 rounded-2xl 
                bg-red-500/10 border 
                border-red-500/20 
                text-red-500 text-xs font-black animate-shake">
                   ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-6">
                    {/* Email Field */}
                    <div className="group relative">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-accent transition-colors">Email Address</label>
                       <div className="relative mt-2">
                          <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                            style={{ background: 'var(--surface-2)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-accent transition-all">📧</span>
                       </div>
                    </div>

                    {/* Password Field */}
                    <div className="group relative">
                       <div className="flex justify-between items-center ml-1 mb-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-accent transition-colors">Security Password</label>
                          <Link to="/forgot" className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline">Forgot?</Link>
                       </div>
                       <div className="relative">
                          <input 
                            type={showPass ? "text" : "password"} 
                            required 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                            style={{ background: 'var(--surface-2)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-all text-xl"
                          >
                             {showPass ? "🙈" : "👁️"}
                          </button>
                       </div>
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full btn-premium py-5 text-base flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(201,169,110,0.3)]"
                 >
                    {loading ? (
                      <div className="w-5 h-5 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <>
                        Masuk Akun
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                           <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                 </button>
              </form>

              <div className="mt-12 text-center">
                 <p className="text-[10px] font-black 
                 text-gray-400 uppercase tracking-[0.3em] mb-6 relative">
                    <span className="
                    bg-white dark:bg-[#0a0a16] px-4 relative z-10">Atau gunakan</span>
                    <span className="absolute top-1/2 left-0 w-full h-[1px] 
                    bg-gray-100 
                    dark:bg-white/10 z-0" />
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 py-4 rounded-2xl 
                    bg-gray-50 dark:bg-white/5 border 
                    border-gray-100 
                    dark:border-white/10 hover:border-accent transition-all group">
                       <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                       <span className="text-[10px] font-black text-gray-500">GOOGLE</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 py-4 rounded-2xl 
                    bg-gray-50 dark:bg-white/5 border 
                    border-gray-100 
                    dark:border-white/10 hover:border-accent transition-all group">
                       <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Facebook" />
                       <span className="text-[10px] font-black text-gray-500">FACEBOOK</span>
                    </button>
                 </div>
              </div>

              <p className="mt-12 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                 Belum menjadi member? 
                 <Link to="/register" className="ml-2 text-accent font-black hover:underline underline-offset-4">Daftar Sekarang</Link>
              </p>

              <div className="mt-20 pt-8 border-t 
              border-gray-100 
              dark:border-white/5 flex items-center justify-center gap-4 opacity-30">
                 <div className="text-[8px] font-black uppercase tracking-[0.3em]">Secure 256-Bit SSL Encryption</div>
              </div>
           </div>
        </div>

      </div>

    </main>
  );
}

export default Login;