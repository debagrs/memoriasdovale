
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_COMMUNITY_ITEMS } from './data';
import { CommunityItem, StoryStatus } from './types';
import { isSupabaseConfigured, supabase, mapDbToItem, mapItemToDb } from './lib/supabaseClient';

// Component Imports
import IntroPortal from './components/IntroPortal';
import AcousticCartography from './components/AcousticCartography';
import FestivalMemories from './components/FestivalMemories';
import SubmissionForm from './components/SubmissionForm';
import CuratorPanel from './components/CuratorPanel';
import CuratorLogin from './components/CuratorLogin';

// Lucide Icons
import {
  Compass,
  MapPin,
  Music,
  BookOpen,
  ShieldAlert,
  Globe,
  LogOut,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('portal');
  const [items, setItems] = useState<CommunityItem[]>(INITIAL_COMMUNITY_ITEMS);
  const [syncError, setSyncError] = useState<string>('');

  // Auth (curadoria) state
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setActiveTab('portal');
  };

  // Load records from Supabase.
  useEffect(() => {
    const fetchMemories = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setSyncError('Supabase não configurado: usando dados locais de demonstração.');
        setItems(INITIAL_COMMUNITY_ITEMS);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar do Supabase:', error);
          setSyncError(`Erro ao buscar dados no Supabase: ${error.message}`);
          setItems(INITIAL_COMMUNITY_ITEMS);
          return;
        }

        if (data && data.length > 0) {
          setItems(data.map(mapDbToItem));
          setSyncError('');
          return;
        }

        setItems(INITIAL_COMMUNITY_ITEMS);
        setSyncError('Banco conectado, mas ainda vazio: exibindo dados iniciais de demonstração.');
      } catch (e: any) {
        console.error('Erro na API:', e);
        setSyncError(`Erro inesperado ao conectar ao Supabase: ${e.message || e}`);
        setItems(INITIAL_COMMUNITY_ITEMS);
      }
    };

    fetchMemories();
  }, []);

  const handleUpdateStatus = async (
  id: string,
  newStatus: StoryStatus
) => {
  setSyncError('');

  if (!supabase) {
    setSyncError(
      'Supabase não configurado. A alteração não pôde ser salva.'
    );
    return;
  }

  const { data, error } = await supabase
    .from('memories')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar status:', error);

    setSyncError(
      `Não foi possível salvar a aprovação: ${error.message}`
    );

    return;
  }

  setItems((currentItems) =>
    currentItems.map((item) =>
      item.id === id ? mapDbToItem(data) : item
    )
  );
};

  const handleEditItem = async (id: string, updatedFields: Partial<CommunityItem>) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, ...updatedFields };
      }
      return item;
    });
    setItems(updated);

    const dbUpdate: any = {};
    if (updatedFields.title !== undefined) dbUpdate.title = updatedFields.title;
    if (updatedFields.author !== undefined) dbUpdate.author = updatedFields.author;
    if (updatedFields.content !== undefined) dbUpdate.content = updatedFields.content;
    if (updatedFields.category !== undefined) dbUpdate.category = updatedFields.category;
    if (updatedFields.status !== undefined) dbUpdate.status = updatedFields.status;

    if (supabase) {
      const { error } = await supabase.from('memories').update(dbUpdate).eq('id', id);
      if (error) setSyncError(`Erro ao salvar edição: ${error.message}`);
    }
  };

  const handleAddSubmission = async (newItem: CommunityItem) => {
    const updated = [newItem, ...items];
    setItems(updated);
    if (!supabase) {
      setSyncError('Supabase não configurado: submissão ficou apenas nesta sessão local.');
      return;
    }

    const { error } = await supabase.from('memories').insert(mapItemToDb(newItem));
    if (error) {
      setSyncError(`Erro ao enviar para o Supabase: ${error.message}`);
    } else {
      setSyncError('');
    }
  };

  const approvedItems = items.filter(item => item.status === 'approved');
  const pendingItems = items.filter(item => item.status === 'pending');

  const navItems = [
    { id: 'portal', label: 'Início', icon: Globe },
    { id: 'cartografia', label: 'Mapa Mental', icon: MapPin },
    { id: 'festival', label: 'Festival de Música', icon: Music },
    { id: 'colaborar', label: 'Deixar Memória', icon: BookOpen },
  ];

  return (
    <div id="app-root-frame" className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between selection:bg-gold-200">

      {syncError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs font-mono text-center">
          {syncError}
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo Brand Title */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('portal')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="p-2 bg-olive-900 text-gold-400 rounded-xl group-hover:scale-105 duration-300">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left font-serif">
              <span className="block font-black text-stone-900 tracking-tight text-base sm:text-lg leading-none">
                Vale Vêneto
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-olive-700 font-sans font-semibold">
                Memória, Música & Cartografia
              </span>
            </div>
          </div>

          {/* Interactive Navigation menu tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  id={`nav-btn-${nav.id}`}
                  onClick={() => setActiveTab(nav.id)}
                  className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-gold-400 font-extrabold shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Curator badge ONLY when logged in */}
          <div className="flex items-center gap-3">
            {session && (
              <>
                <button
                  id="nav-btn-curatoria"
                  onClick={() => setActiveTab('curadoria')}
                  className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl font-bold transition flex items-center gap-2 cursor-pointer border ${
                    activeTab === 'curadoria'
                      ? 'bg-olive-950 text-gold-400 border-olive-950 shadow-md'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-gold-500" />
                  <span>Curadoria</span>
                  {pendingItems.length > 0 && (
                    <span className="bg-gold-400 text-stone-950 text-[10px] px-1.5 py-0.5 rounded-full font-black animate-bounce shrink-0">
                      {pendingItems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl font-bold text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Toggles */}
        <div className="md:hidden bg-stone-50 border-t border-stone-200/50 flex py-2 px-3 overflow-x-auto gap-1">
          {navItems.map((nav) => {
            const isActive = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wide rounded-lg font-bold shrink-0 cursor-pointer ${
                  isActive ? 'bg-stone-900 text-gold-400' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {nav.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Hero Portal */}
      <AnimatePresence mode="wait">
        {activeTab === 'portal' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <IntroPortal
              onNavigate={setActiveTab}
              approvedCount={approvedItems.length}
              pendingCount={pendingItems.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Workspace Route Area */}
      {activeTab !== 'portal' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {activeTab === 'cartografia' && (
                <AcousticCartography approvedItems={approvedItems} />
              )}

              {activeTab === 'festival' && (
                <FestivalMemories approvedItems={approvedItems} />
              )}

              {activeTab === 'colaborar' && (
                <SubmissionForm
                  onAddSubmissions={handleAddSubmission}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'curadoria' && (
                session ? (
                  <CuratorPanel
                    items={items}
                    onUpdateStatus={handleUpdateStatus}
                    onEditItem={handleEditItem}
                  />
                ) : (
                  <CuratorLogin />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      {/* Global Poetic Footer */}
      <footer className="bg-stone-950 text-stone-100 py-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-olive-900 text-gold-400 rounded-lg">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif font-black text-stone-100 tracking-tight text-lg">Vale Vêneto Memória</span>
            </div>
            <p className="text-stone-400 text-xs font-sans font-light leading-relaxed">
              Plataforma digital dedicada à preservação e expansão poética da identidade da Quarta Colônia de Imigração Italiana do Rio Grande do Sul, Brasil.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-2 text-left">
            <span className="block text-[10px] font-mono text-stone-600 uppercase tracking-widest font-bold">Patrocínio & Gestão</span>
            <div className="flex flex-col gap-1 text-xs text-stone-300 font-light">
              <p>Universidade Federal de Santa Maria (UFSM)</p>
              <p>Comunidade Organizada de Vale Vêneto, RS</p>
              <p>Prefeitura Municipal de Silveira Martins</p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4 text-left md:text-right md:ml-auto">
            <span className="block text-[10px] font-mono text-stone-600 uppercase tracking-widest font-bold">Curadoria Ativa</span>
            <div className="flex items-center gap-1.5 justify-start md:justify-end text-xs text-stone-300 font-mono">
              <Globe className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: '20s' }} />
              <span>Sintonizado em Dialeto Talian</span>
            </div>
            <p className="text-[10px] text-stone-500 font-light">
              &copy; 2026 Vale Vêneto Memórias. Preservando a oralidade gaúcha italiana.
            </p>
            {/* Discreet curator access link */}
            <button
              onClick={() => setActiveTab('curadoria')}
              className="text-[10px] font-mono text-stone-600 hover:text-gold-400 transition uppercase tracking-widest cursor-pointer inline-flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" />
              {session ? 'Painel de Curadoria' : 'Acesso Curadoria'}
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
