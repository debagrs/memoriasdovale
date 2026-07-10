
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShieldAlert, LogIn } from 'react-feather';

export default function CuratorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!supabase) {
      setError('Supabase não configurado. Confira VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-olive-950 text-gold-400 rounded-xl mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-black text-stone-900 text-xl">Acesso Restrito</h2>
          <p className="text-stone-500 text-xs font-sans mt-1">
            Área exclusiva da curadoria. Faça login para continuar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-olive-700"
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-olive-700"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg font-mono text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-3 bg-olive-950 text-gold-400 rounded-xl font-mono uppercase text-xs tracking-wider font-bold flex items-center justify-center gap-2 hover:bg-olive-900 transition disabled:opacity-60 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
