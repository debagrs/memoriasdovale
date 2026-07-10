import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music, MapPin, Sparkles, BookOpen, Heart, Activity, ShieldAlert, ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from 'react-feather';

interface IntroPortalProps {
  onNavigate: (tab: string) => void;
  approvedCount: number;
  pendingCount: number;
}

// Icon mapper for dynamic slider buttons
const ICON_MAP = {
  MapPin: MapPin,
  Music: Music,
  BookOpen: BookOpen,
  Sparkles: Sparkles,
  ShieldAlert: ShieldAlert,
};

// Cinematic slideshow data
const SLIDES = [
  {
    id: 0,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Monumento_a_%22Nono_e_a_Nona%22_en_Vale_Veneto.jpg/960px-Monumento_a_%22Nono_e_a_Nona%22_en_Vale_Veneto.jpg',
    tag: 'Design, Música e Memória',
    title: 'Onde os montes sussurram memorabilias e canções.',
    description: 'Vale Vêneto, aninhado entre as escarpas verdes da Quarta Colônia no sul do Brasil. Um palco-santuário imorredouro onde a memória da imigração italiana se funde com a alta cultura musical das Américas no inverno.',
    buttons: [
      { text: 'Navegar Cartografia Afetiva', tab: 'cartografia', type: 'primary', icon: 'MapPin' },
      { text: 'Explorar Memórias do Festival', tab: 'festival', type: 'secondary', icon: 'Music' },
      { text: 'Submeter Nova Memória', tab: 'colaborar', type: 'tertiary', icon: 'BookOpen' }
    ]
  },
  {
    id: 1,
    image: '/images/hero_music.png',
    tag: 'Festival Internacional de Inverno',
    title: 'A harmonia clássica ressoando sob o frio colonial.',
    description: 'Durante o inverno, as ruelas silenciosas ganham vida com violinos, violoncelos e orquestras. Uma fusão mágica entre o rigor acadêmico e a hospitalidade calorosa das nossas capelas de pedra.',
    buttons: [
      { text: 'Explorar Festival de Música', tab: 'festival', type: 'primary', icon: 'Music' },
      { text: 'Compartilhar Minha Vivência', tab: 'colaborar', type: 'secondary', icon: 'BookOpen' },
      { text: 'Ver Mapa de Sons', tab: 'cartografia', type: 'tertiary', icon: 'MapPin' }
    ]
  },
  {
    id: 2,
    image: '/images/hero_vineyard.png',
    tag: 'Paisagem Cultural & Heritage',
    title: 'O aroma da uva e os caminhos de pedra vermelha.',
    description: 'Descubra a história oral e os costumes moldados pelas videiras antigas da Quarta Colônia. Cada capitel, mirante e estrada rural conta o destino de gerações de imigrantes vênetos.',
    buttons: [
      { text: 'Explorar Rotas Históricas', tab: 'cartografia', type: 'primary', icon: 'MapPin' },
      { text: 'Registrar Ponto Afetivo', tab: 'colaborar', type: 'secondary', icon: 'BookOpen' },
      { text: 'Sons do Festival', tab: 'festival', type: 'tertiary', icon: 'Music' }
    ]
  },
  {
    id: 3,
    image: '/images/hero_memory.png',
    tag: 'Arquivo de Memória Coletiva',
    title: 'Objetos, vozes e registros do nosso passado vivo.',
    description: 'Senhores narrando causos em dialeto Talian, receitas de família passadas no fogão a lenha, e retratos antigos digitalizados. Um patrimônio sustentado ativamente pela comunidade.',
    buttons: [
      { text: 'Enviar Minha História', tab: 'colaborar', type: 'primary', icon: 'BookOpen' },
      { text: 'Painel de Curadoria', tab: 'curadoria', type: 'secondary', icon: 'Sparkles' },
      { text: 'Retornar ao Mapa', tab: 'cartografia', type: 'tertiary', icon: 'MapPin' }
    ]
  }
];

// Motion variants for Voyeur Verite-style diagonal slice transitions
const slideVariants = {
  enter: {
    clipPath: 'polygon(46% -10%, 49% -10%, 54% 110%, 51% 110%)',
    rotate: 12,
    scale: 1.25,
    opacity: 0,
  },
  center: {
    clipPath: 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)',
    rotate: 0,
    scale: 1.05,
    opacity: 1,
    transition: {
      clipPath: { duration: 1.5, ease: [0.76, 0, 0.24, 1] },
      rotate: { duration: 1.5, ease: [0.76, 0, 0.24, 1] },
      scale: { duration: 1.5, ease: [0.76, 0, 0.24, 1] },
      opacity: { duration: 0.6, ease: 'linear' }
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 1.1,
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

// Text entrance variants
const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.45,
    }
  }
};

const textItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
    }
  }
};

export default function IntroPortal({ onNavigate, approvedCount, pendingCount }: IntroPortalProps) {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const slideDuration = 8000; // 8 seconds per slide

  // Reset progress bar on slide change
  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  // Slideshow auto-play and progress tick
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // update progress every 50ms for smoothness
    const step = (intervalTime / slideDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((prevSlide) => (prevSlide + 1) % SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

  const handleSelectSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const currentSlideData = SLIDES[currentSlide];

  const ambientSounds = [
    { id: 'sinos', name: 'Sinos da Corpus Domini', desc: 'O som profundo do bronze medieval reverberando pelas encostas verdes às 18:00.', icon: '🔔', detail: 'Simulado em oscilação harmônica grave de sino' },
    { id: 'ventos', name: 'Brisa dos Cerros', desc: 'O vento frio de julho assobiando entre os pinhais que cercam a colônia.', icon: '💨', detail: 'Simulado em ruído branco tonal modulado' },
    { id: 'violin', name: 'Violino no Silêncio', desc: 'O dedilhar tímido de um estudante afinando o instrumento sob a sombra de uma parreira.', icon: '🎻', detail: 'Simulado em notas flutuantes de cordas clássicas' },
    { id: 'festa', name: 'Murmúrio da Piazza', desc: 'Senhores idosos conversando em dialeto Talian misturado ao tilintar de taças de vinho colonial.', icon: '🍷', detail: 'Simulado em murmúrio de vozes em ambiente de reverberação' }
  ];

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      setActiveSound(null);
      setIsPlaying(false);
    } else {
      setActiveSound(soundId);
      setIsPlaying(true);
    }
  };

  return (
    <div id="intro-portal-container" className="space-y-16">
      {/* ─── Cinematic Full-Screen Hero ─── */}
      <section
        id="hero-slideshow"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden bg-stone-950 text-stone-100 flex flex-col justify-between"
        style={{ height: 'calc(100vh - 80px)', width: '100%' }}
      >
        {/* Background Images Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <motion.img
                src={currentSlideData.image}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.15, x: 0, y: 0 }}
                animate={{
                  scale: 1.05,
                  x: ['0%', '1%', '-1%', '0%'],
                  y: ['0%', '-1%', '1%', '0%']
                }}
                transition={{
                  scale: { duration: 1.5, ease: [0.76, 0, 0.24, 1] },
                  x: { repeat: Infinity, repeatType: 'reverse', duration: 18, ease: 'linear' },
                  y: { repeat: Infinity, repeatType: 'reverse', duration: 22, ease: 'linear' },
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/45 z-[1]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-olive-900/35 via-transparent to-transparent z-[1] pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-[2]" />

        {/* ── Left Arrow ── */}
        <button
          id="hero-arrow-prev"
          onClick={() => handleSelectSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 group flex items-center justify-center w-14 h-14 rounded-full bg-black/50 hover:bg-black/80 border-2 border-white/30 hover:border-white/70 backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-2xl"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* ── Right Arrow ── */}
        <button
          id="hero-arrow-next"
          onClick={() => handleSelectSlide((currentSlide + 1) % SLIDES.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 group flex items-center justify-center w-14 h-14 rounded-full bg-black/50 hover:bg-black/80 border-2 border-white/30 hover:border-white/70 backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-2xl"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* ── Top Header Tag Row ── */}
        <div className="relative flex flex-wrap items-center justify-between gap-4 z-10 w-full px-8 md:px-16 pt-8 md:pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 bg-stone-900/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-800/60 text-xs text-gold-400 font-mono tracking-wider uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-450" />
              <span>{currentSlideData.tag}</span>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3 bg-stone-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-800/40">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-550"></span>
            </span>
            <span className="text-xs text-stone-300 font-mono">Curadoria Ativa ({approvedCount} Histórias)</span>
          </div>
        </div>

        {/* ── Bottom Panel: Text + Progress bars ── */}
        <div className="relative z-10 w-full px-8 md:px-16 pb-28 md:pb-32">
          {/* Poetic Typography */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6 max-w-4xl"
            >
              <motion.h1
                variants={textItemVariants}
                className="text-3xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-stone-50 leading-[1.05]"
              >
                {currentSlideData.title.split(' ').map((word, idx) => {
                  if (word.toLowerCase().includes('memorabilias') || word.toLowerCase().includes('harmonia') || word.toLowerCase().includes('aroma') || word.toLowerCase().includes('vozes')) {
                    return <span key={idx} className="font-serif italic font-normal text-gold-200 mr-2">{word} </span>;
                  }
                  return <span key={idx} className="mr-2">{word} </span>;
                })}
              </motion.h1>

              <motion.p
                variants={textItemVariants}
                className="text-base md:text-lg text-stone-300 font-light leading-relaxed max-w-2xl font-sans"
              >
                {currentSlideData.description}
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={textItemVariants} className="flex flex-wrap items-center gap-3 pt-2">
                {currentSlideData.buttons.map((btn, index) => {
                  const IconComponent = ICON_MAP[btn.icon as keyof typeof ICON_MAP] || ArrowRight;
                  if (btn.type === 'primary') {
                    return (
                      <button
                        key={index}
                        onClick={() => onNavigate(btn.tab)}
                        className="px-6 py-3.5 bg-gold-400 hover:bg-gold-550 text-stone-950 rounded-xl font-medium tracking-wide flex items-center gap-2 transform transition hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-gold-500/10 text-sm font-tech font-bold"
                      >
                        <IconComponent className="w-4.5 h-4.5" />
                        {btn.text}
                      </button>
                    );
                  } else if (btn.type === 'secondary') {
                    return (
                      <button
                        key={index}
                        onClick={() => onNavigate(btn.tab)}
                        className="px-6 py-3.5 bg-stone-900/80 hover:bg-stone-850/80 text-stone-100 border border-stone-800/60 rounded-xl font-medium tracking-wide flex items-center gap-2 transform transition hover:-translate-y-0.5 cursor-pointer text-sm font-tech font-bold"
                      >
                        <IconComponent className="w-4.5 h-4.5 text-gold-400" />
                        {btn.text}
                      </button>
                    );
                  } else {
                    return (
                      <button
                        key={index}
                        onClick={() => onNavigate(btn.tab)}
                        className="px-6 py-3.5 bg-transparent hover:bg-stone-900/30 text-gold-300 hover:text-stone-100 rounded-xl font-medium tracking-wide flex items-center gap-2 transform transition cursor-pointer text-sm font-tech"
                      >
                        <IconComponent className="w-4.5 h-4.5" />
                        {btn.text}
                      </button>
                    );
                  }
                })}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* ── Slide Progress Bars (bottom strip) ── */}
          <div className="flex gap-2 mt-10">
            {SLIDES.map((slide, i) => {
              const isActive = i === currentSlide;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleSelectSlide(i)}
                  className="flex-1 h-1 rounded-full overflow-hidden bg-white/20 cursor-pointer focus:outline-none"
                  aria-label={`Slide ${i + 1}`}
                >
                  <div className="h-full bg-white/30 relative overflow-hidden rounded-full">
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-gold-400 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                    {!isActive && i < currentSlide && (
                      <div className="w-full h-full bg-white/60" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Scroll Down Indicator ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50">Rolar</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-0.5"
          >
            <ChevronDown className="w-5 h-5 text-white/60" />
            <ChevronDown className="w-5 h-5 text-white/30 -mt-3" />
          </motion.div>
        </div>

      </section>

      {/* Acoustic Landscapes: Interactive Sound Canvas (Science/Art fusion) */}
      <section id="acoustic-soundscapes" className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-stone-100 space-y-8 mx-4 sm:mx-6 lg:mx-8 max-w-7xl xl:mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-olive-600 font-mono text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4 text-olive-500" />
              <span>Instalação Sonora Digital</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 tracking-tight">
              Paisagem Acústica e Afetiva do Vale
            </h2>
            <p className="text-stone-600 font-sans text-sm">
              Pesquisas em ecologia acústica mostram que a memória comunitária é imensamente ligada ao espaço sônico. Ative uma assinatura acústica para sintonizar a emoção sonora do local.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isPlaying && activeSound ? (
              <motion.div 
                key="wave"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 bg-olive-50 border border-olive-200/50 px-5 py-3.5 rounded-2xl"
              >
                {/* Visual Audio Wave */}
                <div className="flex items-end gap-1 h-8 w-12">
                  <div className="w-1.5 bg-olive-500 rounded-full wave-bar" style={{ height: '100%' }}></div>
                  <div className="w-1.5 bg-gold-400 rounded-full wave-bar" style={{ height: '70%' }}></div>
                  <div className="w-1.5 bg-olive-500 rounded-full wave-bar" style={{ height: '40%' }}></div>
                  <div className="w-1.5 bg-gold-400 rounded-full wave-bar" style={{ height: '90%' }}></div>
                  <div className="w-1.5 bg-olive-400 rounded-full wave-bar" style={{ height: '50%' }}></div>
                </div>
                <div className="font-mono text-xs text-olive-800">
                  <p className="font-semibold uppercase tracking-wider">Atmosfera Ativa</p>
                  <p className="text-[10px] text-olive-600/80 uppercase">Simulando Sintetizador de Memória...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="muted"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 bg-stone-50 border border-stone-200/40 px-5 py-3.5 rounded-2xl"
              >
                <VolumeX className="w-5 h-5 text-stone-400" />
                <span className="font-mono text-xs text-stone-400 uppercase tracking-wide">Atmosfera Sônica Pausada</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Soundscape Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ambientSounds.map((sound) => {
            const isCurrent = activeSound === sound.id;
            return (
              <div 
                key={sound.id}
                id={`soundcard-${sound.id}`}
                onClick={() => toggleSound(sound.id)}
                className={`group relative p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 select-none ${
                  isCurrent 
                    ? 'bg-olive-900 border-olive-800 text-stone-100 shadow-xl shadow-olive-950/10' 
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200/40 text-stone-850 hover:border-stone-300'
                }`}
              >
                <span className={`text-3xl block mb-4 transform transition group-hover:scale-110 duration-300 ${isCurrent ? 'animate-bounce' : ''}`}>
                  {sound.icon}
                </span>
                <h3 className={`font-serif font-medium text-lg leading-tight mb-1 ${isCurrent ? 'text-gold-200' : 'text-stone-900'}`}>
                  {sound.name}
                </h3>
                <p className={`text-xs font-sans font-light leading-relaxed mb-4 ${isCurrent ? 'text-stone-200/80' : 'text-stone-600'}`}>
                  {sound.desc}
                </p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed border-stone-200/20">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gold-400">{sound.detail}</span>
                  {isCurrent ? (
                    <Volume2 className="w-4 h-4 text-gold-300 animate-pulse" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Historical Bento Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-4 sm:mx-6 lg:mx-8 max-w-7xl xl:mx-auto pb-16">
        <div className="bg-stone-100/50 border border-stone-200/30 p-8 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-2.5 bg-olive-100 text-olive-800 rounded-xl w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-stone-900 font-semibold tracking-tight">História Oral & Colonização</h3>
            <p className="text-sm font-sans text-stone-600 font-light leading-relaxed">
              O Vale foi colonizado no final do século XIX por imigrantes vindos majoritariamente do norte da Itália (região do Vêneto). Guardas de memórias ricas, folclore vivo e receitas transmitidas exclusivamente pela oralidade.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('cartografia')}
            className="mt-6 text-xs text-olive-700 hover:text-olive-900 font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer font-tech"
          >
            Ler relatos coloniais &rarr;
          </button>
        </div>

        <div className="bg-stone-100/50 border border-stone-200/30 p-8 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-2.5 bg-gold-100 text-gold-800 rounded-xl w-fit">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-stone-900 font-semibold tracking-tight">O Clássico no Meio Rural</h3>
            <p className="text-sm font-sans text-stone-600 font-light leading-relaxed">
              Durante o inverno, os sons de violões, violoncelos, fagotes, flautas e orquestras dominam as ruelas pacatas da cidade. Mais de 400 alunos internacionais vivem por semanas dedicados à arte de concerto pura.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('festival')}
            className="mt-6 text-xs text-gold-700 hover:text-gold-900 font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer font-tech"
          >
            Ver retrospectivas &rarr;
          </button>
        </div>

        <div className="bg-stone-1050 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-stone-900 to-stone-950 text-stone-100 p-8 rounded-2xl flex flex-col justify-between border border-stone-800/40">
          <div className="space-y-4">
            <div className="p-2.5 bg-stone-800 text-gold-400 rounded-xl w-fit">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-stone-50 font-semibold tracking-tight">Curadoria Participativa</h3>
            <p className="text-sm font-sans text-stone-300 font-light leading-relaxed">
              Este arquivo digital pertence aos cidadãos do Vale. Tudo postado pela comunidade passa por sua revisão curatorial direta, assegurando rigor histórico, dignidade folclórica e respeito de memórias.
            </p>
          </div>
          
          <div className="mt-8 pt-4 border-t border-stone-800 flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="block text-stone-500 uppercase tracking-widest text-[9px]">Aprovados</span>
              <span className="text-lg font-bold text-emerald-400">{approvedCount}</span>
            </div>
            <div className="border-l border-stone-800 h-8"></div>
            <div>
              <span className="block text-stone-500 uppercase tracking-widest text-[9px]">Aguardando</span>
              <span className="text-lg font-bold text-gold-400">{pendingCount}</span>
            </div>
            <button 
              id="quick-panel-curador"
              onClick={() => onNavigate('curadoria')} 
              className="ml-auto bg-gold-400 text-stone-950 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gold-500 transition cursor-pointer"
            >
              Curar Painel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
