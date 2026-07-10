```tsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  BookOpen,
  Eye,
  Music,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react';

import { FESTIVAL_HISTORY } from '../data';
import { CommunityItem, FestivalYear } from '../types';

interface FestivalMemoriesProps {
  approvedItems: CommunityItem[];
}

export default function FestivalMemories({
  approvedItems,
}: FestivalMemoriesProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState<string | null>(
    null,
  );

  const activeHistory: FestivalYear =
    FESTIVAL_HISTORY.find((festival) => festival.year === selectedYear) ??
    FESTIVAL_HISTORY[FESTIVAL_HISTORY.length - 1];

  const festivalStories = approvedItems;

  const toggleTeaser = (id: string) => {
    setIsPlayingTeaser((currentId) => (currentId === id ? null : id));
  };

  return (
    <div id="festival-memories-container" className="space-y-12">
      {/* Narrative Intro Hero Card */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 p-8 text-stone-100 shadow-xl md:p-12">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />

        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(#ab9742_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="rounded-full border border-gold-400/20 bg-gold-500/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gold-300">
            Ecos de Inverno
          </span>

          <h2 className="font-serif text-3xl font-light tracking-tight text-stone-50 md:text-5xl">
            O Som Clássico das <br />

            <span className="font-normal italic text-gold-200">
              Colinas Coloniais
            </span>
          </h2>

          <p className="font-sans text-sm font-light leading-relaxed text-stone-300 md:text-base">
            O{' '}
            <strong className="font-medium text-stone-100">
              Festival Internacional de Inverno de Vale Vêneto (UFSM)
            </strong>{' '}
            é um fenômeno onde o rigor da academia erudita encontra o
            silêncio bucólico da serra gaúcha. Por duas semanas em toda
            metade de ano, ruelas pacatas residem ao compasso de violinos,
            violoncelos e flautas, acolhendo centenas de instrumentistas de
            destaque mundial.
          </p>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-widest text-olive-700">
            Falas da Comunidade
          </span>

          <h3 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Relatos e Testemunhos do Festival
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {festivalStories.map((story) => (
           <div
  key={story.id}
  id={"festival-story-" + story.id}
  className="flex flex-col justify-between rounded-2xl border border-stone-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gold-300"
>
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded bg-rose-50 px-2.5 py-0.5 font-mono font-medium tracking-wide text-rose-800">
                    {story.category}
                  </span>

                  <span className="font-mono text-[10px] text-stone-400">
                    {story.date}
                  </span>
                </div>

                <h4 className="font-serif text-lg font-semibold leading-snug text-stone-900">
                  {story.title}
                </h4>

                <p className="font-sans text-xs font-light leading-relaxed text-stone-600">
                  {story.content}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 font-sans text-xs text-stone-500">
                <div className="flex items-center gap-1.5 text-[10px] font-light">
                  <BookOpen className="h-3.5 w-3.5 text-stone-400" />

                  <span>
                    Relato de{' '}
                    <strong className="font-semibold text-stone-700">
                      {story.author}
                    </strong>
                  </span>
                </div>

                {story.audioMood && (
                  <button
id={`btn-play-${story.id}`}
type="button"
                    onClick={() => toggleTeaser(story.id)}
                    aria-expanded={isPlayingTeaser === story.id}
                    aria-controls={`audio-teaser-${story.id}`}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 font-mono text-[10px] uppercase text-stone-600 transition hover:border-gold-400"
                  >
                    <Volume2
                      className={`h-3.5 w-3.5 text-emerald-600 ${
                        isPlayingTeaser === story.id
                          ? 'animate-bounce'
                          : ''
                      }`}
                    />

                    <span>
                      {isPlayingTeaser === story.id
                        ? 'Tocando...'
                        : 'Ouvir tom sônico'}
                    </span>
                  </button>
                )}
              </div>

              <AnimatePresence initial={false}>
                {story.audioMood &&
                  isPlayingTeaser === story.id && (
                    <motion.div
                      id={`audio-teaser-${story.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden rounded-lg border border-stone-200/50 bg-stone-50 p-2 text-[10px] italic text-stone-500"
                    >
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>

                        <span>
                          Sintetizador sônico sutil: &ldquo;
                          {story.audioMood}
                          &rdquo;
                        </span>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          ))}

          {festivalStories.length === 0 && (
            <div className="col-span-full mx-auto w-full max-w-lg rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-12 text-center">
              <Eye className
```
