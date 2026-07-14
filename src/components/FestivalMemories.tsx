import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityItem, FestivalYear } from '../types';
import { FESTIVAL_HISTORY } from '../data';
import {
  Music,
  Eye,
  Calendar,
  Sparkles,
  BookOpen,
  Volume2,
  TrendingUp,
  Users,
  Award,
  Play,
  FileText,
  ExternalLink
} from 'lucide-react';;

interface FestivalMemoriesProps {
  approvedItems: CommunityItem[];
}

export default function FestivalMemories({ approvedItems }: FestivalMemoriesProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState<string | null>(null);

  const activeHistory: FestivalYear = FESTIVAL_HISTORY.find(f => f.year === selectedYear) || FESTIVAL_HISTORY[FESTIVAL_HISTORY.length - 1];

  // Filter approved community items specific to the classical music festival
const normalizeText = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const festivalStories = approvedItems.filter((item) => {
  const category = normalizeText(item.category);

  return (
    item.type === 'festival' ||
    category.includes('musica') ||
    category.includes('festival')
  );
});
  // Custom data art calculation - finding max value for charts scaling
  const maxStudents = Math.max(...FESTIVAL_HISTORY.map(f => f.students));
  const maxConcerts = Math.max(...FESTIVAL_HISTORY.map(f => f.concerts));

  const toggleTeaser = (id: string) => {
    if (isPlayingTeaser === id) {
      setIsPlayingTeaser(null);
    } else {
      setIsPlayingTeaser(id);
    }
  };

  return (
    <div id="festival-memories-container" className="space-y-12">
      {/* Narrative Intro Hero Card */}
      <section className="bg-stone-900 text-stone-100 p-8 md:p-12 rounded-3xl relative overflow-hidden border border-stone-800 shadow-xl">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(#ab9742_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest border border-gold-400/20">
            Ecos de Inverno
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight font-light text-stone-50">
            O Som Clássico das <br />
            <span className="italic font-normal text-gold-200">Colinas Coloniais</span>
          </h2>
          <p className="font-sans text-sm md:text-base text-stone-300 font-light leading-relaxed">
            O <strong className="font-medium text-stone-100">Festival Internacional de Inverno de Vale Vêneto (UFSM)</strong> é um fenômeno onde o rigor da academia erudita encontra o silêncio bucólico da serra gaúcha. Por duas semanas em toda metade de ano, ruelas pacatas residem ao compasso de violinos, violoncelos e flautas, acolhendo centenas de instrumentistas de destaque mundial.
          </p>
        </div>
      </section>

      {/* Interactive History Timeline Segment */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs text-olive-700 font-mono tracking-widest uppercase">Cronologia & Ciência de Dados</span>
          <h3 className="text-2xl font-serif tracking-tight text-stone-900 font-bold">Resgate Histórico das Edições</h3>
        </div>

        {/* Horizontal Timeline Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/50 shadow-sm flex items-center justify-between gap-2 overflow-x-auto select-none">
          {FESTIVAL_HISTORY.map((entry) => {
            const isSelected = selectedYear === entry.year;
            return (
              <button
                key={entry.year}
                id={`timeline-btn-${entry.year}`}
                onClick={() => setSelectedYear(entry.year)}
                className={`px-5 py-3 rounded-xl font-mono text-sm tracking-tight cursor-pointer font-bold transition flex flex-col items-center gap-1 min-w-[90px] border ${
                  isSelected 
                    ? 'bg-gold-500 text-stone-950 border-gold-600 scale-105 shadow-md shadow-gold-500/10' 
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200/40'
                }`}
              >
                <span>{entry.year}</span>
                <span className={`text-[9px] uppercase tracking-wider font-sans font-light ${isSelected ? 'text-stone-950' : 'text-stone-400'}`}>
                  {entry.year === 1986 ? 'Estreia' : `Ed. ${entry.year - 1985}ª`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feature Detail Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Timeline Description Block */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-200/40 shadow-sm flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHistory.year}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gold-600 font-mono text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4 text-gold-500" />
                    <span>{activeHistory.edition}</span>
                  </div>
                  <h4 className="text-2xl font-serif text-stone-900 font-semibold">{activeHistory.focus}</h4>
                </div>

                <p className="text-sm text-stone-600 font-sans font-light leading-relaxed">
                  {activeHistory.description}
                </p>

                <div className="space-y-3">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono font-bold block">Destaques Marcantes</span>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans text-stone-700">
                    {activeHistory.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/40">
                        <span className="text-gold-500 font-bold shrink-0 font-mono mt-0.5">&bull;</span>
                        <span className="font-light">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-500">
              <span className="flex items-center gap-1 text-olive-700 font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Patrimônio UFSM & Vale Vêneto</span>
              </span>
              <span>Dados históricos preservados</span>
            </div>
          </div>

          {/* Graphical Representation Panel: "Data Art" */}
          <div className="lg:col-span-5 bg-stone-50 rounded-3xl p-6 md:p-8 border border-stone-300/30 shadow-inner space-y-6">
            <h5 className="font-mono text-[10px] text-stone-400 uppercase tracking-widest font-black block">
              Métricas do Crescimento Histórico
            </h5>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200/40 flex items-center gap-3">
                <div className="p-3.5 bg-olive-50 text-olive-800 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-stone-400 uppercase tracking-wide">Inscrições Alunos</span>
                  <span className="text-2xl font-bold text-stone-900 font-mono">{activeHistory.students}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200/40 flex items-center gap-3">
                <div className="p-3.5 bg-rose-50 text-rose-800 rounded-xl">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-stone-400 uppercase tracking-wide">Concertos Totais</span>
                  <span className="text-2xl font-bold text-stone-900 font-mono">{activeHistory.concerts}</span>
                </div>
              </div>
            </div>

            {/* Immersive Sound waves / Data curves drawn in pure responsive SVG vectors */}
            <div className="bg-stone-950 text-stone-100 rounded-2xl p-4 border border-stone-800 relative space-y-3">
              <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest block">Assinatura Gráfica "Música Erudita"</span>
              
              <div className="h-28 flex items-center justify-center relative overflow-hidden bg-stone-900 rounded-xl">
                {/* SVG Mathematical Curve Waves - Digital Art expression of Music students */}
                <svg viewBox="0 0 200 80" className="w-full h-full stroke-gold-400/80 fill-none stroke-1.5 opacity-80 z-10">
                  <path d="M 0 40 Q 25 10 50 40 T 100 40 T 150 40 T 200 40" className="animate-[pulse_4s_infinite]" />
                  <path d="M 0 40 Q 25 70 50 40 T 100 40 T 150 40 T 200 40" className="opacity-30 stroke-emerald-400 stroke-dasharray-[2,2]" />
                  
                  {/* Highlight dynamic metrics nodes representing current selection */}
                  <circle cx="50" cy="40" r="4" className="fill-gold-400 animate-ping" />
                  <circle cx="150" cy="40" r="3" className="fill-emerald-400" />
                </svg>

                {/* Floating data values overlays */}
                <div className="absolute right-3 top-3 font-mono text-[9px] text-stone-400 space-y-1 text-right">
                  <p><span className="inline-block w-1.5 h-1.5 bg-gold-400 rounded-full mr-1.5" />Alunos: {activeHistory.students}</p>
                  <p><span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5" />Concertos: {activeHistory.concerts}</p>
                </div>
              </div>

              <div className="text-[10px] font-sans font-light text-stone-400 leading-tight">
                *Cada curva visualiza a ressonância sinfônica do Vale através da correlação entre a quantidade de estudantes cadastrados e as apresentações públicas registradas.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Narrative Section featuring Community Testimonials & Festival Chronicles */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs text-olive-700 font-mono tracking-widest uppercase">Falas da Comunidade</span>
          <h3 className="text-2xl font-serif text-stone-900 tracking-tight font-bold">Relatos e Testemunhos do Festival</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {festivalStories.map((story) => (
            <div 
              key={story.id} 
              id={`festival-story-${story.id}`}
              className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-sm flex flex-col justify-between hover:border-gold-300 transition-all duration-300"
            >
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 rounded font-mono font-medium tracking-wide">
                    {story.category}
                  </span>
                  <span className="text-stone-400 font-mono text-[10px]">{story.date}</span>
                </div>
                
                <h4 className="text-lg font-serif font-semibold text-stone-900 leading-snug">
                  {story.title}
                </h4>

              {/* Mídia enviada pela comunidade */}
{story.mediaUrl && (
  <div className="mt-5 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
    {story.mediaType === 'image' && (
      <a
        href={story.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`Abrir imagem do relato ${story.title}`}
      >
        <img
          src={story.mediaUrl}
          alt={story.title || `Imagem enviada por ${story.author}`}
          loading="lazy"
          className="w-full max-h-[420px] object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </a>
    )}

    {story.mediaType === 'video' && (
      <video
        controls
        preload="metadata"
        className="w-full max-h-[460px] bg-black"
      >
        <source src={story.mediaUrl} />
        Seu navegador não consegue reproduzir este vídeo.
      </video>
    )}

    {story.mediaType === 'audio' && (
      <div className="p-4 bg-stone-50">
        <audio controls preload="metadata" className="w-full">
          <source src={story.mediaUrl} />
          Seu navegador não consegue reproduzir este áudio.
        </audio>
      </div>
    )}

    {story.mediaType === 'document' && (
      <a
        href={story.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 p-4 bg-stone-50 text-stone-700 hover:bg-stone-100 transition"
      >
        <span className="flex items-center gap-2 min-w-0">
          <FileText className="w-5 h-5 text-olive-700 shrink-0" />
          <span className="text-xs font-mono truncate">
            {story.mediaFileName || 'Abrir documento da memória'}
          </span>
        </span>

        <ExternalLink className="w-4 h-4 shrink-0" />
      </a>
    )}

    {!story.mediaType && (
      <a
        href={story.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={story.mediaUrl}
          alt={story.title || `Imagem enviada por ${story.author}`}
          loading="lazy"
          className="w-full max-h-[420px] object-cover"
        />
      </a>
    )}
  </div>
)}

              {/* Sound Teaser Player */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-500">
                <div className="flex items-center gap-1.5 font-light text-[10px]">
                  <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                  <span>Relato de <strong className="font-semibold text-stone-700">{story.author}</strong></span>
                </div>

                {story.audioMood && (
                  <button 
                    id={`btn-play-${story.id}`}
                    onClick={() => toggleTeaser(story.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-gold-400 text-[10px] text-stone-600 font-mono cursor-pointer transition uppercase"
                  >
                    <Volume2 className={`w-3.5 h-3.5 text-emerald-600 ${isPlayingTeaser === story.id ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingTeaser === story.id ? 'Tocando...' : 'Ouvir Tom sônico'}</span>
                  </button>
                )}
              </div>

              {/* Responsive Sound wave animation player */}
              <AnimatePresence>
                {isPlayingTeaser === story.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3 bg-stone-50 border border-stone-200/50 p-2 text-[10px] rounded-lg italic text-stone-500"
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Sintetizador sônico sutil: &ldquo;{story.audioMood}&rdquo;</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {festivalStories.length === 0 && (
            <div className="col-span-2 text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 max-w-lg mx-auto w-full">
              <Eye className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500 font-sans">Nenhuma história de música de colônia cadastrada ainda. Compartilhe a sua tocante lembrança!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
