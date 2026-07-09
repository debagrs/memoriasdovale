import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityItem, MentalMapReference } from '../types';
import { HISTORIC_LOCATIONS } from '../data';
import { Compass, Music, MapPin, Eye, Filter, Calendar, Tag, User, Sparkles, Volume2 } from 'lucide-react';

interface AcousticCartographyProps {
  approvedItems: CommunityItem[];
}

export default function AcousticCartography({ approvedItems }: AcousticCartographyProps) {
  const [selectedAnchor, setSelectedAnchor] = useState<MentalMapReference | null>(null);
  const [selectedPin, setSelectedPin] = useState<CommunityItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  // Filter category options
  const filterOptions = [
    { value: 'todos', label: 'Todos os Marcos' },
    { value: 'historico', label: 'Marcos Históricos' },
    { value: 'musica', label: 'Espaços de Música' },
    { value: 'natureza', label: 'Zonas Verdes / Natureza' },
    { value: 'religiao', label: 'Fé e Cultura' },
    { value: 'gastronomia', label: 'Cozinha Colonial' },
  ];

  // Geolocation database filter logic
  const approvedMapPins = approvedItems.filter(item => 
    item.type === 'ponto_mapa' && 
    item.latX !== undefined && 
    item.latY !== undefined
  );

  const handleSelectAnchor = (anchor: MentalMapReference) => {
    setSelectedPin(null);
    setSelectedAnchor(anchor);
  };

  const handleSelectPin = (pin: CommunityItem) => {
    setSelectedAnchor(null);
    setSelectedPin(pin);
  };

  const getPinColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'gastronomia': return 'bg-amber-500 shadow-amber-500/30 text-amber-950 border-amber-600';
      case 'música clássica': case 'musica': return 'bg-rose-500 shadow-rose-500/30 text-rose-950 border-rose-600';
      case 'natureza': return 'bg-emerald-500 shadow-emerald-500/30 text-emerald-950 border-emerald-600';
      case 'religião': return 'bg-indigo-500 shadow-indigo-500/30 text-indigo-950 border-indigo-600';
      case 'imigração': return 'bg-olive-600 shadow-olive-600/30 text-olive-100 border-olive-700';
      default: return 'bg-stone-500 shadow-stone-500/30 text-stone-100 border-stone-600';
    }
  };

  const isAnchorVisible = (anchor: MentalMapReference) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'historico' && anchor.type === 'historical') return true;
    if (activeFilter === 'musica' && anchor.type === 'music') return true;
    if (activeFilter === 'natureza' && anchor.type === 'nature') return true;
    if (activeFilter === 'religiao' && anchor.type === 'historical') return true; // Synced with religious sites
    return false;
  };

  const isPinVisible = (pin: CommunityItem) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'gastronomia' && pin.category.toLowerCase() === 'gastronomia') return true;
    if (activeFilter === 'musica' && pin.category.toLowerCase() === 'música clássica') return true;
    if (activeFilter === 'natureza' && pin.category.toLowerCase() === 'natureza') return true;
    if (activeFilter === 'religiao' && pin.category.toLowerCase() === 'religião') return true;
    if (activeFilter === 'historico' && pin.category.toLowerCase() === 'imigração') return true;
    return false;
  };

  return (
    <div id="cartography-workspace" className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-olive-700 font-mono tracking-widest uppercase">Cartografia Afetiva Interativa</span>
          <h2 className="text-3xl font-serif text-stone-900 tracking-tight">O Mapa Mental de Vale Vêneto</h2>
          <p className="text-sm font-sans text-stone-600 font-light max-w-xl">
            Clique nos marcos de memória cadastrados pela comunidade e explore os sussurros acústicos e as pequenas crônicas históricas de cada pedaço de solo.
          </p>
        </div>

        {/* Filter Selection Panel */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <div className="flex flex-wrap gap-1">
            {filterOptions.map(opt => (
              <button
                key={opt.value}
                id={`filter-${opt.value}`}
                onClick={() => setActiveFilter(opt.value)}
                className={`px-3 py-1.5 text-xs rounded-xl font-medium cursor-pointer transition-all ${
                  activeFilter === opt.value
                    ? 'bg-olive-800 text-stone-100 font-semibold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Map Canvas Grid */}
        <div className="lg:col-span-8 bg-stone-100 rounded-3xl border border-stone-200/50 p-4 relative min-h-[500px] flex items-center justify-center overflow-hidden shadow-inner">
          
          {/* Subtle grid mesh overlays representing data science structures */}
          <div className="absolute inset-0 bg-[radial-gradient(#cad1ab_1px,transparent_1px)] [background-size:20px_20px] opacity-65 pointer-events-none" />
          
          {/* Artistic compass accent */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 font-mono text-[10px] text-stone-400 opacity-60">
            <Compass className="w-4.5 h-4.5 animate-[spin_10s_linear_infinite]" />
            <span>VALE COGNITIVO VÊNETO . ELEV 178m</span>
          </div>

          <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-white/70 backdrop-blur-md border border-stone-200/50 px-3 py-1.5 rounded-xl font-mono text-[9px] text-stone-500">
            <span className="h-1.5 w-1.5 bg-gold-500 rounded-full"></span>
            <span>Marcos Principais</span>
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full ml-2"></span>
            <span>Estudantes / População</span>
          </div>

          {/* SVG Map Canvas Topology Drawing Area */}
          <div className="w-full h-full max-w-2xl aspect-[1.4/1] relative select-none">
            {/* Visual background elements - Mountain range vectors sketched in pure CSS */}
            <div className="absolute inset-x-0 top-12 h-2/5 opacity-5 pointer-events-none">
              <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-olive-900">
                <path d="M0,30 L20,10 L45,25 L75,5 L100,30 Z" />
              </svg>
            </div>

            {/* Simulated Streams / River representing spatial boundaries */}
            <div className="absolute inset-y-0 left-1/3 right-1/2 opacity-15 pointer-events-none">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-blue-500 fill-none stroke-2 stroke-dasharray-[2,4]">
                <path d="M50,0 Q35,30 65,60 T40,100" />
              </svg>
            </div>

            {/* Dynamic Rendering of Anchor Locations */}
            {HISTORIC_LOCATIONS.map((loc) => {
              if (!isAnchorVisible(loc)) return null;
              const isSelected = selectedAnchor?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  id={`anchor-${loc.id}`}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  onClick={() => handleSelectAnchor(loc)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                >
                  <div className="relative group">
                    {/* Ring ping overlay */}
                    {isSelected && (
                      <span className="absolute -inset-2.5 rounded-full border-2 border-gold-500/30 animate-pulse"></span>
                    )}
                    
                    <div className={`p-2.5 rounded-full border duration-300 transform transition-all ${
                      isSelected 
                        ? 'bg-gold-500 border-gold-600 text-stone-950 scale-125' 
                        : 'bg-white hover:bg-gold-50 hover:scale-110 border-stone-300 text-stone-700'
                    }`}>
                      {loc.type === 'music' ? (
                        <Music className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </div>

                    {/* Quick Hover Label */}
                    <span className="absolute left-1/2 -translate-x-1/2 top-11 bg-stone-900 text-stone-50 text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition duration-200 shadow-md">
                      {loc.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Dynamic Rendering of Community-contributed Pins */}
            {approvedMapPins.map((pin) => {
              if (!isPinVisible(pin)) return null;
              const isSelected = selectedPin?.id === pin.id;
              const colorClasses = getPinColor(pin.category);

              return (
                <div
                  key={pin.id}
                  id={`user-pin-${pin.id}`}
                  style={{ left: `${pin.latX}%`, top: `${pin.latY}%` }}
                  onClick={() => handleSelectPin(pin)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                >
                  <div className="relative group">
                    {/* Soft pulsating aura */}
                    <span className={`absolute -inset-1.5 rounded-full opacity-60 animate-ping ${
                      isSelected ? 'bg-gold-400' : 'bg-stone-400'
                    }`} />
                    
                    <button className={`w-3.5 h-3.5 rounded-full border-2 cursor-pointer duration-300 hover:scale-130 ${colorClasses} ${
                      isSelected ? 'scale-135 ring-4 ring-white' : ''
                    }`}>
                      {/* Interactive dot inside */}
                    </button>

                    {/* Label markup */}
                    <span className="absolute left-1/2 -translate-x-1/2 top-6 bg-stone-800 text-stone-100 text-[9px] px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition">
                      {pin.title}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Interactive guidelines instructing user about the space */}
            {approvedMapPins.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center pointer-events-none">
                <p className="bg-stone-50/80 backdrop-blur border border-stone-200/50 px-6 py-4 rounded-2xl max-w-sm text-xs text-stone-500 font-light">
                  Nenhum ponto afetivo de comunidade cadastrado para esta categoria ainda. Seja o primeiro a criar um marco sônico!
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Dynamic Detail Panel Box */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {selectedAnchor && (
              <motion.div
                key="anchor-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl p-6 border border-gold-300/40 shadow-lg space-y-6 flex flex-col h-full"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-gold-100 text-gold-800 text-[10px] font-mono font-semibold tracking-wider uppercase rounded-full">
                      Marco de Memória
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">ID: {selectedAnchor.id}</span>
                  </div>
                  <h3 className="text-xl font-serif text-stone-900 font-black">{selectedAnchor.name}</h3>
                </div>

                <p className="text-sm font-sans text-stone-600 leading-relaxed font-light">
                  {selectedAnchor.description}
                </p>

                {/* Simulated Acoustic Signatures of Vale */}
                <div className="bg-gold-50/50 border border-gold-100 px-4 py-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-gold-800 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <Volume2 className="w-4 h-4 text-gold-600 animate-pulse" />
                    <span>Assinatura Acústica do Lugar</span>
                  </div>
                  <p className="text-xs text-stone-700 italic">
                    &ldquo;{selectedAnchor.audioSignature}&rdquo;
                  </p>
                </div>

                {/* Spatial data */}
                <div className="mt-auto pt-6 border-t border-stone-100 grid grid-cols-2 gap-4 font-mono text-[10px] text-stone-500">
                  <div>
                    <span className="block text-stone-400 uppercase text-[8px] tracking-wider">Origem do Espaço</span>
                    <span className="text-stone-850 font-semibold uppercase">{selectedAnchor.type}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 uppercase text-[8px] tracking-wider">Coordenadas Cartesianas</span>
                    <span className="text-stone-850 font-semibold">X: {selectedAnchor.x}%, Y: {selectedAnchor.y}%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedPin && (
              <motion.div
                key="pin-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg space-y-6 flex flex-col h-full"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-[10px] font-mono uppercase tracking-wider rounded-lg">
                      {selectedPin.category}
                    </span>
                    <div className="flex items-center gap-1 text-stone-400 font-mono text-[9px]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{selectedPin.date}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-950">{selectedPin.title}</h3>
                </div>

                <blockquote className="text-sm font-sans text-stone-600 leading-relaxed font-light pl-4 border-l-2 border-stone-200">
                  {selectedPin.content}
                </blockquote>

                {selectedPin.audioMood && (
                  <div className="bg-stone-50 hover:bg-stone-100 px-4 py-3.5 rounded-2xl flex items-center gap-3 transition">
                    <div className="p-2 bg-stone-200/50 rounded-lg text-stone-600">
                      <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                    </div>
                    <div className="text-left font-sans">
                      <span className="block font-mono text-[8px] text-stone-400 uppercase tracking-widest font-semibold">Paisagem sônica</span>
                      <p className="text-xs text-stone-700 italic font-light">&ldquo;{selectedPin.audioMood}&rdquo;</p>
                    </div>
                  </div>
                )}

                {/* Submitter Author tag */}
                <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between font-sans text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 font-bold">
                      {selectedPin.author[0]}
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400">Contribuído por</span>
                      <span className="font-semibold text-stone-850">{selectedPin.author}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase font-mono font-bold tracking-wider">
                    Curado
                  </span>
                </div>
              </motion.div>
            )}

            {!selectedAnchor && !selectedPin && (
              <motion.div
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-stone-50 rounded-3xl p-8 border border-dashed border-stone-300/60 flex flex-col items-center justify-center text-center h-[380px] space-y-4"
              >
                <div className="p-4 bg-stone-100 rounded-full text-stone-400">
                  <Eye className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-medium text-stone-850">Selecione um Marco</h4>
                  <p className="text-xs text-stone-500 font-sans font-light max-w-[200px] leading-relaxed">
                    Clique nos pontos do mapa para decodificar as memórias e texturas sônicas do Vale.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
