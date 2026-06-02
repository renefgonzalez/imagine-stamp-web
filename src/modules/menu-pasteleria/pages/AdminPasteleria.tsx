import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, LogOut, Settings, Package, Banknote } from 'lucide-react';
import { PANES, RELLENOS, EXTRAS } from '../constants';

export function AdminPasteleria() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<'superadmin' | 'gestor' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('lazaro_admin_role');
    if (savedRole === 'superadmin' || savedRole === 'gestor') {
      setRole(savedRole as 'superadmin' | 'gestor');
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    if (password === '1212') {
      setRole('superadmin');
      setIsLoggedIn(true);
      localStorage.setItem('lazaro_admin_role', 'superadmin');
    } else if (password === 'pastel') {
      setRole('gestor');
      setIsLoggedIn(true);
      localStorage.setItem('lazaro_admin_role', 'gestor');
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setPassword('');
    localStorage.removeItem('lazaro_admin_role');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-stone-900">
        <title>Acceso Admin | Lázaro</title>
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-200 via-amber-200 to-stone-200 opacity-50"></div>
          
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
            <Lock size={28} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-2xl font-serif text-stone-800 mb-2">Panel de Control</h1>
          <p className="text-sm font-light text-stone-500 mb-8">Ingresa tu contraseña para continuar</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Contraseña"
                className={`w-full bg-stone-50 px-4 py-3 rounded-xl text-center font-medium tracking-widest text-sm outline-none border transition-all ${
                  error ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-amber-300 focus:bg-white'
                }`}
                autoFocus
              />
              {error && <p className="text-xs text-red-500 mt-2 font-medium">Contraseña incorrecta</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-medium tracking-widest text-xs uppercase hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10"
            >
              Ingresar
            </button>
          </form>
          
          <div className="mt-8">
            <a href="/#/lazaro-pasteleria" className="text-stone-400 hover:text-stone-700 text-xs tracking-widest uppercase flex items-center justify-center gap-1">
              <ArrowLeft size={12} /> Volver al Menú
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 pb-20">
      <title>Panel {role === 'superadmin' ? 'Super Admin' : 'Gestor'} | Lázaro</title>

      <header className="px-6 py-6 border-b border-stone-200 bg-white sticky top-0 z-30 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif text-stone-800">Lázaro Pastelería</h1>
          <p className="text-xs text-stone-400 font-medium tracking-widest uppercase">
            {role === 'superadmin' ? 'Suite Principal' : 'Gestión de Pedidos'}
          </p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Pedidos Hoy</p>
              <p className="text-2xl font-serif text-stone-800">12</p>
            </div>
          </div>
          
          {role === 'superadmin' && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Banknote size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Ingresos Brutos</p>
                  <p className="text-2xl font-serif text-stone-800">$6,600</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
                  <Settings size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Catálogo</p>
                  <p className="text-2xl font-serif text-stone-800">{PANES.length + RELLENOS.length + EXTRAS.length} items</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-lg font-serif text-stone-800">Órdenes Recientes</h2>
          </div>
          <div className="p-6 text-center text-stone-400 font-light py-12">
            No hay órdenes registradas todavía en esta sesión.
            <br />
            <span className="text-xs mt-2 inline-block bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
              Panel en modo simulación
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
