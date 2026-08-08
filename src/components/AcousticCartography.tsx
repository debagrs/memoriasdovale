import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  Compass,
  Filter,
  MapPin,
  Music,
  Radar,
  Volume2,
} from 'lucide-react';

import { HISTORIC_LOCATIONS } from '../data';
import { CommunityItem, MentalMapReference } from '../types';

interface AcousticCartographyProps {
  approvedItems: CommunityItem[];
}

type FilterValue =
  | 'todos'
  | 'historico'
  | 'musica'
  | 'natureza'
  | 'religiao'
  | 'gastronomia';

const filters: Array<{ value: FilterValue; label: string }> = [
  { value: 'todos', label: 'Todos os Marcos' },
  { value: 'historico', label: 'Marcos Históricos' },
  { value: 'musica', label: 'Espaços de Música' },
  { value: 'natureza', label: 'Zonas Verdes / Natureza' },
  { value: 'religiao', label: 'Fé e Cultura' },
  { value: 'gastronomia', label: 'Cozinha Colonial' },
];

export default function AcousticCartography({
  approvedItems,
}: AcousticCartographyProps) {
  const [selectedAnchor, setSelectedAnchor] =
    useState<MentalMapReference | null>(null);
  const [selectedPin, setSelectedPin] = useState<CommunityItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('todos');

  const mapItems = approvedItems.filter(
    (item) =>
      item.type === 'ponto_mapa' &&
      item.latX !== undefined &&
      item.latY !== undefined,
  );

  const selectAnchor = (anchor: MentalMapReference) => {
    setSelectedPin(null);
    setSelectedAnchor(anchor);
  };

  const selectPin = (pin: CommunityItem) => {
    setSelectedAnchor(null);
    setSelectedPin(pin);
  };

  const pinColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'gastronomia':
        return 'bg-amber-500 shadow-amber-500/30 text-amber-950 border-amber-600';
      case 'música clássica':
      case 'musica':
        return 'bg-rose-500 shadow-rose-500/30 text-rose-950 border-rose-600';
      case 'natureza':
        return 'bg-emerald-500 shadow-emerald-500/30 text-emerald-950 border-emerald-600';
      case 'religião':
        return 'bg-indigo-500 shadow-indigo-500/30 text-indigo-950 border-indigo-600';
      case 'imigração':
        return 'bg-olive-600 shadow-olive-600/30 text-olive-100 border-olive-700';
      default:
        return 'bg-stone-500 shadow-stone-500/30 text-stone-100 border-stone-600';
    }
  };

  const showAnchor = (anchor: MentalMapReference) =>
    activeFilter === 'todos' ||
    (activeFilter === 'historico' && anchor.type === 'historical') ||
    (activeFilter === 'musica' && anchor.type === 'music') ||
    (activeFilter === 'natureza' && anchor.type === 'nature') ||
    (activeFilter === 'religiao' && anchor.type === 'historical');

  const showCommunityPin = (item: CommunityItem) => {
    const category = item.category.toLowerCase();
    return (
      activeFilter === 'todos' ||
      (activeFilter === 'gastronomia' && category === 'gastronomia') ||
      (activeFilter === 'musica' && category === 'música clássica') ||
      (activeFilter === 'natureza' && category === 'natureza') ||
      (activeFilter === 'religiao' && category === 'religião') ||
      (activeFilter === 'historico' && category === 'imigração')
    );
  };

  const hasUploadedAudio =
    selectedPin?.mediaType === 'audio' && Boolean(selectedPin.mediaUrl);

  return (
    <div id="cartography-workspace" className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-widest text-olive-700">
            Cartografia Afetiva Interativa
          </span>
          <h2 className="font-serif text-3xl tracking-tight text-stone-900">
            O Mapa Mental de Vale Vêneto
          </h2>
          <p className="max-w-xl font-sans text-sm font-light text-stone-600">
            Clique nos marcos de memória cadastrados pela comunidade e explore
            os sussurros acústicos e as pequenas crônicas históricas de cada
            pedaço de solo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 shrink-0 text-stone-400" />
          <div className="flex flex-wrap gap-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                id={`filter-${filter.value}`}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  activeFilter === filter.value
                    ? 'bg-olive-800 font-semibold text-stone-100'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-3xl border border-stone-200/50 bg-stone-100 p-4 shadow-inner lg:col-span-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cad1ab_1px,transparent_1px)] [background-size:20px_20px] opacity-65" />

          <div className="absolute bottom-6 right-6 flex items-center gap-2 font-mono text-[10px] text-stone-400 opacity-60">
            <Compass className="h-[18px] w-[18px] animate-[spin_10s_linear_infinite]" />
            <span>VALE COGNITIVO VÊNETO . ELEV 178m</span>
          </div>

          <div className="absolute left-6 top-6 flex items-center gap-1.5 rounded-xl border border-stone-200/50 bg-white/70 px-3 py-1.5 font-mono text-[9px] text-stone-500 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            <span>Marcos Principais</span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Estudantes / População</span>
          </div>

          <div className="relative aspect-[1.4/1] h-full w-full max-w-2xl select-none">
            <div className="pointer-events-none absolute inset-x-0 top-12 h-2/5 opacity-5">
              <svg
                viewBox="0 0 100 30"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full fill-olive-900"
              >
                <path d="M0,30 L20,10 L45,25 L75,5 L100,30 Z" />
              </svg>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-1/3 right-1/2 opacity-15">
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full fill-none stroke-blue-500 stroke-2 stroke-dasharray-[2,4]"
              >
                <path d="M50,0 Q35,30 65,60 T40,100" />
              </svg>
            </div>

            {HISTORIC_LOCATIONS.map((anchor) => {
              if (!showAnchor(anchor)) return null;
              const isSelected = selectedAnchor?.id === anchor.id;

              return (
                <div
                  key={anchor.id}
                  id={`anchor-${anchor.id}`}
                  style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
                  onClick={() => selectAnchor(anchor)}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <div className="group relative">
                    {isSelected && (
                      <span className="absolute -inset-2.5 animate-pulse rounded-full border-2 border-gold-500/30" />
                    )}
                    <div
                      className={`rounded-full border p-2.5 transition-all duration-300 ${
                        isSelected
                          ? 'scale-125 border-gold-600 bg-gold-500 text-stone-950'
                          : 'border-stone-300 bg-white text-stone-700 hover:scale-110 hover:bg-gold-50'
                      }`}
                    >
                      {anchor.type === 'music' ? (
                        <Music className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </div>
                    <span className="pointer-events-none absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-md bg-stone-900 px-2 py-0.5 text-[10px] text-stone-50 opacity-0 shadow-md transition duration-200 group-hover:opacity-100">
                      {anchor.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {mapItems.map((item) => {
              if (!showCommunityPin(item)) return null;
              const isSelected = selectedPin?.id === item.id;
              const color = pinColor(item.category);

              return (
                <div
                  key={item.id}
                  id={`user-pin-${item.id}`}
                  style={{ left: `${item.latX}%`, top: `${item.latY}%` }}
                  onClick={() => selectPin(item)}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <div className="group relative">
                    <span
                      className={`absolute -inset-1.5 animate-ping rounded-full opacity-60 ${
                        isSelected ? 'bg-gold-400' : 'bg-stone-400'
                      }`}
                    />
                    <button
                      type="button"
                      aria-label={`Abrir memória ${item.title}`}
                      className={`h-3.5 w-3.5 cursor-pointer rounded-full border-2 transition duration-300 hover:scale-[1.3] ${color} ${
                        isSelected ? 'scale-[1.35] ring-4 ring-white' : ''
                      }`}
                    />
                    <span className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded bg-stone-800 px-2 py-0.5 text-[9px] text-stone-100 opacity-0 shadow-sm transition group-hover:opacity-100">
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}

            {mapItems.length === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-center">
                <p className="max-w-sm rounded-2xl border border-stone-200/50 bg-stone-50/80 px-6 py-4 text-xs font-light text-stone-500 backdrop-blur">
                  Nenhum ponto afetivo de comunidade cadastrado para esta
                  categoria ainda. Seja o primeiro a criar um marco sônico!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedAnchor && (
              <motion.div
                key="anchor-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex h-full flex-col space-y-6 rounded-3xl border border-gold-300/40 bg-white p-6 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gold-100 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-gold-800">
                      Marco de Memória
                    </span>
                    <span className="font-mono text-[10px] text-stone-400">
                      ID: {selectedAnchor.id}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-black text-stone-900">
                    {selectedAnchor.name}
                  </h3>
                </div>

                <p className="font-sans text-sm font-light leading-relaxed text-stone-600">
                  {selectedAnchor.description}
                </p>

                <div className="space-y-3 rounded-2xl border border-gold-100 bg-gold-50/50 px-4 py-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-gold-800">
                    <Volume2 className="h-4 w-4 animate-pulse text-gold-600" />
                    <span>Assinatura Acústica do Lugar</span>
                  </div>
                  <p className="text-xs italic text-stone-700">
                    “{selectedAnchor.audioSignature}”
                  </p>

                  {selectedAnchor.audioUrl && (
                    <div className="space-y-2 border-t border-gold-100 pt-3">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500">
                        Paisagem sonora ilustrativa
                      </span>
                      <audio
                        key={selectedAnchor.audioUrl}
                        src={selectedAnchor.audioUrl}
                        controls
                        preload="metadata"
                        className="w-full"
                        aria-label={
                          selectedAnchor.audioLabel ||
                          `Ouvir paisagem sonora de ${selectedAnchor.name}`
                        }
                      >
                        Seu navegador não suporta reprodução de áudio.
                      </audio>
                      <p className="text-[9px] leading-relaxed text-stone-400">
                        Áudio criado digitalmente para ambientação poética do
                        mapa; não é uma gravação de campo histórica.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 border-t border-stone-100 pt-6 font-mono text-[10px] text-stone-500">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-stone-400">
                      Origem do Espaço
                    </span>
                    <span className="font-semibold uppercase text-stone-850">
                      {selectedAnchor.type}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-stone-400">
                      Coordenadas Cartesianas
                    </span>
                    <span className="font-semibold text-stone-850">
                      X: {selectedAnchor.x}%, Y: {selectedAnchor.y}%
                    </span>
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
                className="flex h-full flex-col space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-stone-700">
                      {selectedPin.category}
                    </span>
                    <div className="flex items-center gap-1 font-mono text-[9px] text-stone-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{selectedPin.date}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-950">
                    {selectedPin.title}
                  </h3>
                </div>

                <blockquote className="border-l-2 border-stone-200 pl-4 font-sans text-sm font-light leading-relaxed text-stone-600">
                  {selectedPin.content}
                </blockquote>

                {(selectedPin.audioMood || hasUploadedAudio) && (
                  <div className="space-y-3 rounded-2xl bg-stone-50 px-4 py-3.5 transition hover:bg-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-stone-200/50 p-2 text-stone-600">
                        <Volume2 className="h-4 w-4 animate-pulse text-emerald-600" />
                      </div>
                      <div className="text-left font-sans">
                        <span className="block font-mono text-[8px] font-semibold uppercase tracking-widest text-stone-400">
                          {hasUploadedAudio
                            ? 'Registro sonoro da memória'
                            : 'Paisagem sônica'}
                        </span>
                        {selectedPin.audioMood && (
                          <p className="text-xs font-light italic text-stone-700">
                            “{selectedPin.audioMood}”
                          </p>
                        )}
                      </div>
                    </div>

                    {hasUploadedAudio && selectedPin.mediaUrl && (
                      <div className="space-y-1.5 border-t border-stone-200 pt-3">
                        <audio
                          key={selectedPin.mediaUrl}
                          src={selectedPin.mediaUrl}
                          controls
                          preload="metadata"
                          className="w-full"
                          aria-label={`Ouvir áudio enviado por ${selectedPin.author}`}
                        >
                          Seu navegador não suporta reprodução de áudio.
                        </audio>
                        {selectedPin.mediaFileName && (
                          <p className="truncate font-mono text-[9px] text-stone-400">
                            {selectedPin.mediaFileName}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-6 font-sans text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 font-bold text-stone-500">
                      {selectedPin.author?.[0] || '?'}
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400">
                        Contribuído por
                      </span>
                      <span className="font-semibold text-stone-850">
                        {selectedPin.author}
                      </span>
                    </div>
                  </div>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-500">
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
                className="flex h-[380px] flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-stone-300/60 bg-stone-50 p-8 text-center"
              >
                <div className="rounded-full bg-stone-100 p-4 text-stone-400">
                  <Radar className="h-6 w-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-medium text-stone-850">
                    Selecione um Marco
                  </h4>
                  <p className="max-w-[200px] font-sans text-xs font-light leading-relaxed text-stone-500">
                    Clique nos pontos do mapa para decodificar as memórias e
                    texturas sônicas do Vale.
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
