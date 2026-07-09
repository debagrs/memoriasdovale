import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityItem, StoryStatus } from '../types';
import { Shield, Check, X, Edit3, Trash, User, Eye, Sparkles, AlertCircle, FileText, Calendar, Tag, RefreshCcw, Save } from 'lucide-react';

interface CuratorPanelProps {
  items: CommunityItem[];
  onUpdateStatus: (id: string, status: StoryStatus) => void;
  onEditItem: (id: string, updatedFields: Partial<CommunityItem>) => void;
}

export default function CuratorPanel({ items, onUpdateStatus, onEditItem }: CuratorPanelProps) {
  const [activeTab, setActiveTab] = useState<StoryStatus>('pending');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit fields state
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editAudioMood, setEditAudioMood] = useState('');

  // AI enrichment state
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<{ [id: string]: string }>({});
  const [aiSensitive, setAiSensitive] = useState<{ [id: string]: boolean }>({});

  const filteredItems = items.filter(item => item.status === activeTab);

  const pendingCount = items.filter(i => i.status === 'pending').length;
  const approvedCount = items.filter(i => i.status === 'approved').length;
  const rejectedCount = items.filter(i => i.status === 'rejected').length;

  const handleStartEdit = (item: CommunityItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditAuthor(item.author);
    setEditContent(item.content);
    setEditCategory(item.category);
    setEditAudioMood(item.audioMood || '');
  };

  const handleSaveEdit = (id: string) => {
    onEditItem(id, {
      title: editTitle,
      author: editAuthor,
      content: editContent,
      category: editCategory,
      audioMood: editAudioMood || undefined
    });
    setEditingId(null);
  };

  // Call server-side Gemini route to enrich community submission or suggest tags
  const handleAiEnrichment = async (item: CommunityItem) => {
    setAiLoadingId(item.id);
    setAiLoadingId(item.id);
    try {
      // Mocking AI response for GitHub pages static deployment
      await new Promise(r => setTimeout(r, 1000));
      const mockAnalysis = "A análise de IA está desativada na versão estática do GitHub Pages. O relato parece autêntico e bem redigido.";
      setAiFeedback(prev => ({ ...prev, [item.id]: mockAnalysis }));
      setAiSensitive(prev => ({ ...prev, [item.id]: false }));
    } catch (e) {
      setAiFeedback(prev => ({ ...prev, [item.id]: 'Não foi possível conectar ao simulador.' }));
    } finally {
      setAiLoadingId(null);
    }
  };

  return (
    <div id="curation-workspace" className="space-y-8">
      {/* Curator Banner */}
      <section className="bg-olive-950 text-stone-100 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-olive-900 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-gold-400/20 text-gold-300 border border-gold-400/20 px-3 py-1 rounded-full w-fit font-mono text-[9px] uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5 text-gold-400" />
            <span>Painel do Curador Oficial</span>
          </div>
          <h2 className="text-2xl font-serif text-stone-50 tracking-tight font-black">
            Olhar Editorial & Curadoria
          </h2>
          <p className="text-xs text-stone-300 font-sans font-light max-w-xl">
            Sua responsabilidade é conferir rigor histórico, ortografia e relevância cultural às narrativas enviadas pelos cidadãos de Silveira Martins antes de integrá-las à cartografia viva.
          </p>
        </div>

        {/* Current user credential info */}
        <div className="bg-stone-900/40 p-4 rounded-2xl border border-stone-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-gold-400 text-stone-950 font-serif font-black flex items-center justify-center rounded-xl">
            DG
          </div>
          <div className="text-left font-sans text-xs">
            <p className="font-semibold text-stone-100 leading-none mb-1">Debora Gasparetto</p>
            <p className="text-[10px] text-stone-400 leading-none uppercase font-mono">Curador Principal / UFSM</p>
          </div>
        </div>
      </section>

      {/* Tab Selectors & Summary Counts */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex gap-2">
          {[
            { value: 'pending', label: 'Pendentes', count: pendingCount, color: 'text-gold-600 bg-gold-50 border-gold-200 hover:bg-gold-100/60' },
            { value: 'approved', label: 'Aprovados', count: approvedCount, color: 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100/60' },
            { value: 'rejected', label: 'Rejeitados', count: rejectedCount, color: 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100/60' }
          ].map(tab => (
            <button
              key={tab.value}
              id={`curator-tab-${tab.value}`}
              onClick={() => {
                setActiveTab(tab.value as StoryStatus);
                setEditingId(null);
              }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xl font-bold border transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.value
                  ? 'bg-stone-900 text-gold-400 border-stone-950 scale-102 shadow-sm'
                  : `${tab.color} text-stone-500`
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-white/90 border border-stone-200/50 px-2 py-0.5 rounded-full text-[10px] text-stone-800">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-[10px] text-stone-400 font-mono">
          * Todas as alterações de status são salvas instantaneamente.
        </span>
      </div>

      {/* Main List of Workpieces */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-md flex flex-col gap-6"
            >
              {/* Item Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div className="space-y-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-mono uppercase tracking-wider font-semibold">
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 bg-olive-50 text-olive-800 rounded text-[10px] font-mono tracking-wide">
                      {editingId === item.id ? editCategory : item.category}
                    </span>
                    <span className="text-stone-400 text-[10px] font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  {editingId === item.id ? (
                    <input
                      id={`edit-title-${item.id}`}
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-lg font-serif font-bold text-stone-950 border-b border-stone-300 focus:border-stone-900 outline-none pb-0.5 w-full mt-2"
                    />
                  ) : (
                    <h3 className="text-lg font-serif font-bold text-stone-900 leading-tight">
                      {item.title}
                    </h3>
                  )}

                  {/* AI Feedback Display */}
                  <AnimatePresence>
                    {aiFeedback[item.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`overflow-hidden mt-4 p-4 border rounded-2xl flex gap-3 items-start ${
                          aiSensitive[item.id] 
                            ? 'bg-rose-50 border-rose-200' 
                            : 'bg-gold-50 border-gold-200'
                        }`}
                      >
                        {aiSensitive[item.id] ? (
                          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className={`block text-[10px] font-mono uppercase tracking-widest font-bold mb-1 ${
                            aiSensitive[item.id] ? 'text-rose-700' : 'text-gold-700'
                          }`}>
                            {aiSensitive[item.id] ? 'Alerta de Sensibilidade IA' : 'Síntese Curatorial IA'}
                          </span>
                          <p className={`text-sm font-sans font-medium whitespace-pre-line ${
                            aiSensitive[item.id] ? 'text-rose-900' : 'text-stone-800'
                          }`}>
                            {aiFeedback[item.id]}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submitter details */}
                <div className="flex items-center gap-2 text-xs font-sans text-stone-600">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Por: </span>
                  {editingId === item.id ? (
                    <input
                      id={`edit-author-${item.id}`}
                      type="text"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      className="font-semibold text-stone-850 border-b border-stone-300 outline-none py-0.5 text-xs"
                    />
                  ) : (
                    <span className="font-semibold text-stone-900">{item.author}</span>
                  )}
                </div>
              </div>

              {/* Item Content View / Edit Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Text editor box */}
                <div className="lg:col-span-8 space-y-4">
                  {editingId === item.id ? (
                    <textarea
                      id={`edit-content-${item.id}`}
                      rows={5}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 outline-none focus:border-stone-900 p-4 rounded-xl text-sm leading-relaxed"
                    />
                  ) : (
                    <p className="text-sm font-sans text-stone-600 leading-relaxed font-light text-left pl-4 border-l border-stone-200">
                      {item.content}
                    </p>
                  )}

                  {/* Sound signature row */}
                  <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/40 w-fit">
                    <div className="p-1 px-1.5 bg-stone-200 text-stone-600 rounded text-[9px] font-mono uppercase tracking-wide">Soundscape</div>
                    {editingId === item.id ? (
                      <input
                        id={`edit-audioMood-${item.id}`}
                        type="text"
                        value={editAudioMood}
                        onChange={(e) => setEditAudioMood(e.target.value)}
                        className="text-xs text-stone-700 italic border-b border-stone-300 outline-none"
                      />
                    ) : (
                      <span className="text-xs text-stone-700 italic font-light">
                        {item.audioMood || 'Sem sônica associada.'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submitter attached media / AI assist card */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Photo attachment preview */}
                  {item.mediaUrl && (
                    <div className="p-2 border border-stone-200 rounded-2xl bg-stone-50">
                      <img referrerPolicy="no-referrer" src={item.mediaUrl} className="w-full rounded-xl aspect-video object-cover" alt="Citizen attachment" />
                      <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block text-center mt-1.5">Mídia Anexada</span>
                    </div>
                  )}

                  {/* Geographic indicator for cartography pin */}
                  {item.type === 'ponto_mapa' && item.latX !== undefined && (
                    <div className="p-3 bg-stone-50 border border-stone-250 rounded-xl text-[10px] font-mono text-stone-500 space-y-1">
                      <p className="font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-olive-700" />
                        Coordenadas
                      </p>
                      <p>Latitude Relativa (X): {item.latX}%</p>
                      <p>Longitude Relativa (Y): {item.latY}%</p>
                    </div>
                  )}

                  {/* AI assisted analysis box */}
                  <div className="p-4 bg-gradient-to-br from-indigo-50/40 via-indigo-50/25 to-transparent border border-indigo-200/60 rounded-2xl text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                        Assistente de IA Curation
                      </span>
                      <button
                        id={`btn-ai-enrich-${item.id}`}
                        onClick={() => handleAiEnrichment(item)}
                        disabled={aiLoadingId !== null}
                        className="text-[9px] underline font-mono text-indigo-600 hover:text-indigo-800 disabled:opacity-50 cursor-pointer"
                      >
                        {aiLoadingId === item.id ? 'Gerando...' : 'Analisar Relato'}
                      </button>
                    </div>

                    {aiFeedback[item.id] ? (
                      <div className="text-[11px] text-stone-700 leading-relaxed font-sans bg-white p-3 rounded-xl border border-indigo-100 italic font-light max-h-36 overflow-y-auto">
                        {aiFeedback[item.id]}
                      </div>
                    ) : (
                      <p className="text-[10px] text-stone-500 font-sans font-light leading-normal">
                        Conecte ao Gemini para obter resumo automático, sugestões de tags históricas e correções gramaticais do dialeto Talian.
                      </p>
                    )}
                  </div>

                </div>

              </div>

              {/* Action Console bar */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 mt-2">
                {/* State togglers / Editing actions */}
                <div className="flex gap-2">
                  {editingId === item.id ? (
                    <button
                      id={`btn-save-${item.id}`}
                      onClick={() => handleSaveEdit(item.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-stone-50 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Salvar Alterações
                    </button>
                  ) : (
                    <button
                      id={`btn-edit-${item.id}`}
                      onClick={() => handleStartEdit(item)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Editar Detalhes
                    </button>
                  )}
                </div>

                {/* Status Switch Decision Hub (Approve / Reject) */}
                <div className="flex gap-2 ml-auto">
                  {item.status !== 'approved' && (
                    <button
                      id={`btn-approve-${item.id}`}
                      onClick={() => onUpdateStatus(item.id, 'approved')}
                      className="px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300/40 hover:bg-emerald-200 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      Aprovar Publicamente
                    </button>
                  )}

                  {item.status !== 'rejected' && (
                    <button
                      id={`btn-reject-${item.id}`}
                      onClick={() => onUpdateStatus(item.id, 'rejected')}
                      className="px-4 py-2 bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <X className="w-4 h-4 text-rose-500" />
                      Excluir / Rejeitar
                    </button>
                  )}

                  {item.status !== 'pending' && (
                    <button
                      id={`btn-rollback-${item.id}`}
                      onClick={() => onUpdateStatus(item.id, 'pending')}
                      className="px-4 py-2 bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <RefreshCcw className="w-3.5 h-3.5 text-stone-500" />
                      Retornar Pendentes
                    </button>
                  )}
                </div>

              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white p-8 rounded-3xl border border-stone-200/40 shadow-sm max-w-md mx-auto space-y-4">
            <div className="p-4 bg-stone-50 rounded-full text-stone-400 w-fit mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-semibold text-stone-900">Nenhum Registro Aqui</h4>
              <p className="text-xs text-stone-500 font-sans font-light leading-relaxed">
                Excelente! Não há itens neste segmento de status no momento. Novas histórias enviadas pelos cidadãos do Vale aparecerão instantaneamente na aba de pendentes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
