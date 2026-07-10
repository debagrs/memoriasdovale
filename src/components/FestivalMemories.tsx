import { useState } from 'react';
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
import type { CommunityItem, FestivalYear } from '../types';

interface FestivalMemoriesProps {
  approvedItems: CommunityItem[];
}

export default function FestivalMemories({
  approvedItems,
}: FestivalMemoriesProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState<string | null>(null);

  const activeHistory: FestivalYear | undefined =
    FESTIVAL_HISTORY.find((festival) => festival.year === selectedYear) ??
    FESTIVAL_HISTORY[FESTIVAL_HISTORY.length - 1];

  const festivalStories = approvedItems;

  const toggleTeaser = (id: string) => {
    setIsPlayingTeaser((currentId) => (currentId === id ? null : id));
  };

  if (!activeHistory) {
    return (
      <div
        id="festival-memories-container"
        className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600"
      >
        Nenhum dado histórico do festival foi cadastrado.
      </div>
    );
  }

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
            é um fenômeno onde o rigor da academia erudita encontra o silêncio
            bucólico da serra gaúcha. Por duas semanas em toda metade de ano,
            ruelas pacatas residem ao compasso de violinos, violoncelos e
            flautas, acolhendo centenas de instrumentistas de destaque mundial.
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
          {festivalStories.map((story) => {
            return (
              <div
                key={story.id}
                id={`festival-story-${story.id}`}
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

                  {story.audioMood ? (
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
                          isPlayingTeaser === story.id ? 'animate-bounce' : ''
                        }`}
                      />

                      <span>
                        {isPlayingTeaser === story.id
                          ? 'Tocando...'
                          : 'Ouvir tom sônico'}
                      </span>
                    </button>
                  ) : null}
                </div>

                <AnimatePresence initial={false}>
                  {story.audioMood && isPlayingTeaser === story.id ? (
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
                          Sintetizador sônico sutil: &ldquo;{story.audioMood}
                          &rdquo;
                        </span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}

          {festivalStories.length === 0 && (
            <div className="col-span-full mx-auto w-full max-w-lg rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-12 text-center">
              <Eye className="mx-auto mb-2 h-8 w-8 text-stone-300" />

              <p className="font-sans text-xs text-stone-500">
                Nenhuma história de música de colônia cadastrada ainda.
                Compartilhe a sua tocante lembrança!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive History Timeline */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-widest text-olive-700">
            Cronologia &amp; Ciência de Dados
          </span>

          <h3 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Resgate Histórico das Edições
          </h3>
        </div>

        <div className="flex select-none items-center justify-between gap-2 overflow-x-auto rounded-2xl border border-stone-200/50 bg-white p-4 shadow-sm">
          {FESTIVAL_HISTORY.map((entry) => {
            const isSelected = selectedYear === entry.year;

            return (
              <button
                key={entry.year}
                id={`timeline-btn-${entry.year}`}
                type="button"
                onClick={() => setSelectedYear(entry.year)}
                aria-pressed={isSelected}
                className={`flex min-w-[90px] cursor-pointer flex-col items-center gap-1 rounded-xl border px-5 py-3 font-mono text-sm font-bold tracking-tight transition ${
                  isSelected
                    ? 'scale-105 border-gold-600 bg-gold-500 text-stone-950 shadow-md shadow-gold-500/10'
                    : 'border-stone-200/40 bg-stone-50 text-stone-500 hover:bg-stone-100'
                }`}
              >
                <span>{entry.year}</span>

                <span
                  className={`font-sans text-[9px] font-light uppercase tracking-wider ${
                    isSelected ? 'text-stone-950' : 'text-stone-400'
                  }`}
                >
                  {entry.year === 1986
                    ? 'Estreia'
                    : `Ed. ${entry.year - 1985}ª`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Timeline Description */}
          <div className="flex flex-col justify-between rounded-3xl border border-stone-200/40 bg-white p-6 shadow-sm md:p-8 lg:col-span-7">
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
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-gold-600">
                    <Award className="h-4 w-4 text-gold-500" />

                    <span>{activeHistory.edition}</span>
                  </div>

                  <h4 className="font-serif text-2xl font-semibold text-stone-900">
                    {activeHistory.focus}
                  </h4>
                </div>

                <p className="font-sans text-sm font-light leading-relaxed text-stone-600">
                  {activeHistory.description}
                </p>

                <div className="space-y-3">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Destaques Marcantes
                  </span>

                  <ul className="grid grid-cols-1 gap-2 font-sans text-xs text-stone-700 md:grid-cols-2">
                    {activeHistory.highlights.map((highlight, index) => {
                      return (
                        <li
                          key={`${activeHistory.year}-${index}`}
                          className="flex items-start gap-2 rounded-xl border border-stone-200/40 bg-stone-50 p-2.5"
                        >
                          <span className="mt-0.5 shrink-0 font-mono font-bold text-gold-500">
                            &bull;
                          </span>

                          <span className="font-light">{highlight}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6 font-mono text-xs text-stone-500">
              <span className="flex items-center gap-1 font-bold uppercase tracking-wide text-olive-700">
                <Sparkles className="h-3.5 w-3.5" />

                <span>Patrimônio UFSM &amp; Vale Vêneto</span>
              </span>

              <span>Dados históricos preservados</span>
            </div>
          </div>

          {/* Data Art Panel */}
          <div className="space-y-6 rounded-3xl border border-stone-300/30 bg-stone-50 p-6 shadow-inner md:p-8 lg:col-span-5">
            <h5 className="block font-mono text-[10px] font-black uppercase tracking-widest text-stone-400">
              Métricas do Crescimento Histórico
            </h5>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200/40 bg-white p-4">
                <div className="rounded-xl bg-olive-50 p-3.5 text-olive-800">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <span className="block font-mono text-[8px] uppercase tracking-wide text-stone-400">
                    Inscrições Alunos
                  </span>

                  <span className="font-mono text-2xl font-bold text-stone-900">
                    {activeHistory.students}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-stone-200/40 bg-white p-4">
                <div className="rounded-xl bg-rose-50 p-3.5 text-rose-800">
                  <Music className="h-5 w-5" />
                </div>

                <div>
                  <span className="block font-mono text-[8px] uppercase tracking-wide text-stone-400">
                    Concertos Totais
                  </span>

                  <span className="font-mono text-2xl font-bold text-stone-900">
                    {activeHistory.concerts}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative space-y-3 rounded-2xl border border-stone-800 bg-stone-950 p-4 text-stone-100">
              <span className="block font-mono text-[8px] uppercase tracking-widest text-stone-500">
                Assinatura Gráfica &ldquo;Música Erudita&rdquo;
              </span>

              <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl bg-stone-900">
                <svg
                  viewBox="0 0 200 80"
                  role="img"
                  aria-label={`Representação visual de ${activeHistory.students} estudantes e ${activeHistory.concerts} concertos`}
                  className="z-10 h-full w-full fill-none stroke-gold-400/80 stroke-[1.5] opacity-80"
                >
                  <path
                    d="M 0 40 Q 25 10 50 40 T 100 40 T 150 40 T 200 40"
                    className="animate-[pulse_4s_infinite]"
                  />

                  <path
                    d="M 0 40 Q 25 70 50 40 T 100 40 T 150 40 T 200 40"
                    className="stroke-emerald-400 opacity-30 [stroke-dasharray:2_2]"
                  />

                  <circle
                    cx="50"
                    cy="40"
                    r="4"
                    className="animate-ping fill-gold-400"
                  />

                  <circle
                    cx="150"
                    cy="40"
                    r="3"
                    className="fill-emerald-400"
                  />
                </svg>

                <div className="absolute right-3 top-3 space-y-1 text-right font-mono text-[9px] text-stone-400">
                  <p>
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold-400" />
                    Alunos: {activeHistory.students}
                  </p>

                  <p>
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Concertos: {activeHistory.concerts}
                  </p>
                </div>
              </div>

              <p className="font-sans text-[10px] font-light leading-tight text-stone-400">
                *Cada curva visualiza a ressonância sinfônica do Vale através
                da correlação entre a quantidade de estudantes cadastrados e
                as apresentações públicas registradas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
