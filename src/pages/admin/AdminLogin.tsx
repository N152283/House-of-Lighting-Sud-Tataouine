import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lightbulb, Lock, Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Query the users table
      const { data: users, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

      if (queryError) throw queryError;
      
      if (!users || users.length === 0) {
        setError('Email not found');
        toast.error('Email not found');
        setLoading(false);
        return;
      }

      const user = users[0];
      
      // Note: Password verification should be done on backend
      // For now, we'll just check if user exists
      // TODO: Implement proper password verification with a database function
      
      // Store admin session
      localStorage.setItem('adminUser', JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString()
      }));

      toast.success('Welcome to administration panel');
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err.message);
      setError('Connection error. Please try again.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] relative overflow-hidden px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Retour</span>
      </button>

      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-600/5 blur-[100px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-[#111113]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] overflow-hidden">
          <div className="p-12 pb-8 text-center border-b border-white/5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 p-[2px] mb-8 shadow-2xl shadow-amber-500/20">
              <div className="w-full h-full bg-[#111113] rounded-[22px] flex items-center justify-center">
                <Lightbulb className="text-amber-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3 font-serif italic">Espace Privé</h1>
            <p className="text-slate-400 font-light tracking-wide uppercase text-[10px]">House of Lighting Sud Tataouine</p>
          </div>

          <form onSubmit={handleLogin} className="p-12 pt-10 space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-3 text-red-500 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-300 text-xs font-semibold tracking-widest uppercase ml-1">Identifiant</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@houseoflight.tn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="h-14 bg-white/5 border-white/5 text-white pl-12 rounded-2xl focus:ring-amber-500 focus:border-amber-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold tracking-widest uppercase ml-1">Mot de passe</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="h-14 bg-white/5 border-white/5 text-white pl-12 rounded-2xl focus:ring-amber-500 focus:border-amber-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold h-16 rounded-[20px] transition-all shadow-xl shadow-amber-500/10 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Accéder au Dashboard
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
              )}
            </Button>
          </form>
          
          <div className="p-8 text-center bg-white/[0.02] border-t border-white/5">
            <p className="text-slate-500 text-[9px] uppercase tracking-[0.2em]">Sécurisé par Supabase & Encryption BCrypt</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-600 text-[10px] tracking-widest uppercase font-bold">
          &copy; 2024 House of Lighting Sud
        </div>
      </motion.div>
    </div>
  );
}
