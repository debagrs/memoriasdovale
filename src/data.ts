import { CommunityItem, FestivalYear, MentalMapReference } from './types';

// Pre-loaded historic locations to anchor our interactive mental map
export const HISTORIC_LOCATIONS: MentalMapReference[] = [
  {
    id: 'ref-corpus-domini',
    name: 'Igreja Corpus Domini',
    type: 'historical',
    description: 'Majestosa igreja de pedra construída pelos imigrantes italianos a partir de 1888. Coração espiritual e arquitetônico de Vale Vêneto.',
    x: 50,
    y: 35,
    audioSignature: 'Sinos de bronze ressonando no vale às 12h e às 18h'
  },
  {
    id: 'ref-paroquia',
    name: 'Casa Paroquial e Salão de Festas',
    type: 'public',
    description: 'Ponto de encontro comunitário onde tradicionalmente ocorrem os almoços típicos italianos durante a Semana Cultural, com sopa de capeletti e risoto.',
    x: 48,
    y: 50,
    audioSignature: 'Sussurros de risadas, brindes de vinho e talheres em festa'
  },
  {
    id: 'ref-casarao',
    name: 'Casarão dos Museus (Cultura)',
    type: 'historical',
    description: 'Guardião de relíquias dos pioneiros que retratam o cotidiano agrícola, as ferramentas e a fé dos primeiros colonizadores.',
    x: 32,
    y: 42,
    audioSignature: 'Estalar de tábuas de madeira antiga sob passos atentos'
  },
  {
    id: 'ref-sitio-fontes',
    name: 'Gruta de Nossa Senhora de Lourdes',
    type: 'nature',
    description: 'Recanto de paz e mata nativa protegido pelas rochas, onde águas cristalinas correm em silêncio de oração.',
    x: 65,
    y: 20,
    audioSignature: 'Gotejar rítmico de água limpa sobre pedras cobertas de musgo'
  },
  {
    id: 'ref-ufsm-festival',
    name: 'Sede Prática do Festival de Música',
    type: 'music',
    description: 'Salas e casarões que se convertem em salas de masterclasses e câmeras de ensaio durante o Festival de Inverno.',
    x: 40,
    y: 68,
    audioSignature: 'Acordes dissonantes de piano e sopros flutuando no ar de inverno'
  },
  {
    id: 'ref-belvedere',
    name: 'Mirante do Cerro',
    type: 'nature',
    description: 'Ponto culminante que oferece uma visão panorâmica e deslumbrante dos montes verdejantes que formam o vale.',
    x: 82,
    y: 45,
    audioSignature: 'Vento forte de inverno soprando pelas copas dos pinhais'
  },
  {
    id: 'ref-piazza',
    name: 'Piazza Vicente Pallotti',
    type: 'public',
    description: 'Praça central arborizada, pavimentada em pedra paralelepípedo, onde os moradores se reúnem ao entardecer.',
    x: 52,
    y: 60,
    audioSignature: 'Palavras em dialeto Talian entoadas por vozes senhoriais'
  }
];

// Seed data for the Classic Music Festival (Festival Internacional de Inverno da UFSM)
// Fonte: https://www.ufsm.br/unidades-universitarias/cal/eventos/41-festival-internacional-de-inverno-da-ufsm
export const FESTIVAL_HISTORY: FestivalYear[] = [
  {
    year: 1986,
    edition: 'I Festival de Inverno',
    focus: 'Início e Música de Câmara',
    students: 120,
    concerts: 8,
    highlights: ['Fundação por professores da UFSM e comunidade local', 'Primeiros concertos na Igreja Corpus Domini'],
    description: 'Nascido sob a geada de julho, o festival começou pequeno mas com propósitos audaciosos: descentralizar o ensino de música clássica de concerto do centro de Santa Maria para as colinas bucólicas de Vale Vêneto.'
  },
  {
    year: 1995,
    edition: 'X Festival de Inverno',
    focus: 'Consolidação Internacional',
    students: 240,
    concerts: 15,
    highlights: ['Professores convidados da Itália, Alemanha e EUA', 'Gravação em fita K7 dos recitais principais'],
    description: 'Ao completar 10 anos, o festival entra no circuito internacional das Américas, transformando por duas semanas cada garagem e sala de Vale Vêneto em estúdio acústico.'
  },
  {
    year: 2005,
    edition: 'XX Festival de Inverno',
    focus: 'Orquestra Jovem do Vale',
    students: 310,
    concerts: 22,
    highlights: ['Fusão de música clássica com folclore italiano local', 'Lançamento do livro de memórias fotográficas do Vale'],
    description: 'Consolidação das masterclasses gratuitas para jovens de projetos sociais de música vindos de todo o Brasil e da América Platina.'
  },
  {
    year: 2015,
    edition: 'XXX Festival de Inverno',
    focus: 'Música Contemporânea e Barroca',
    students: 380,
    concerts: 29,
    highlights: ['Concerto comemorativo com coral regional', 'Instalação interativa de arte sonora na capela acústica'],
    description: 'Três décadas de excelência musical e sinergia perfeita entre o rigor técnico da academia e a hospitalidade calorosa da colônia italiana.'
  },
  {
    year: 2023,
    edition: 'XXXVIII Festival de Inverno',
    focus: 'Ecos do Vale à posteridade',
    students: 395,
    concerts: 32,
    highlights: ['Regência de maestros europeus renomados', 'Transmissão digital de alta fidelidade para 12 países'],
    description: 'Após os desafios globais, o reencontro consagra o festival como patrimônio cultural imaterial do Rio Grande do Sul, unindo música clássica de repertório com o aroma da gastronomia colonial.'
  },
  {
    year: 2026,
    edition: 'XLI Festival de Inverno',
    focus: 'Integração com a Comunidade e Tecnologia',
    students: 450,
    concerts: 40,
    highlights: [
      'Celebração dos 40+ anos de excelência musical',
      'Integração com University of Georgia (EUA) para intercâmbio',
      'FIIUFSM Jovem - Festival para crianças e adolescentes (21-23 de julho)',
      'Concertos de 26 de julho a 2 de agosto',
      'Oficinas em 16 instrumentos + regência e educação musical'
    ],
    description: 'A edição de 2026 marca a consolidação do festival como motor extensionista da UFSM, combinando excelência artística com desenvolvimento comunitário, oportunidades de intercâmbio internacional e educação musical para todas as idades em uma região certificada como Geoparque Mundial da UNESCO.'
  }
];

// Initial preloaded community items (split between Approved and Pending for curation visualization)
export const INITIAL_COMMUNITY_ITEMS: CommunityItem[] = [
  {
    id: 'item-1',
    type: 'narrativa',
    title: 'A Receita Sagrada de Minha Nonna',
    author: 'Clara Gasparetto',
    date: '2026-05-12',
    content: 'Em nossa casa em Silveira Martins, herdamos a tábua de madeira onde minha Nonna preparava a polenta servida com molho de galinha caipira. Lembro do som do fogão a lenha estalando e do aroma que preenchia as tardes úmidas de inverno. Não é apenas comida, é o abraço que restou da Itália em nossas almas.',
    category: 'Gastronomia',
    status: 'approved',
    mediaUrl: '',
    mediaType: 'none',
    audioMood: 'Fogão a lenha estalando mansamente'
  },
  {
    id: 'item-2',
    type: 'ponto_mapa',
    title: 'O Velho Capitel da Linha Três',
    author: 'Guilherme Maffini',
    date: '2026-05-18',
    content: 'Erguido na bifurcação de terra da Linha 3, este pequenino altar de tijolos foi construído em agradecimento pela colheita de uvas de 1912. Sempre paramos para trocar as flores silvestres e contemplar a descida da neblina sobre as parreiras antigas.',
    category: 'Religião',
    status: 'approved',
    latX: 72,
    latY: 58,
    audioMood: 'Sopro suave do vento nas videiras bravas'
  },
  {
    id: 'item-3',
    type: 'festival',
    title: 'O Soprano que ecoou na Corpus Domini',
    author: 'Renato Marzotto',
    date: '2026-04-30',
    content: 'No Festival de 1999, uma forte neblina encobriu Vale Vêneto à noite. Sem luz elétrica de reposição por trinta minutos, o concerto prosseguiu com velas. Uma soprano convidada cantou a capella da nave central. A reverberação natural da pedra fez parecer que o céu falava através da rocha pura da capela.',
    category: 'Música Clássica',
    status: 'approved',
    audioMood: 'Eco lírico ecoando sob abóbada rústica'
  },
  {
    id: 'item-4',
    type: 'midia',
    title: 'A colheita manual do milho na Encosta',
    author: 'Aldo Pivotto',
    date: '2026-05-25',
    content: 'Registro fotográfico fictício da colheitadeira manual de ferro que meu tataravô utilizava na encosta da montanha de terra vermelha.',
    category: 'Imigração',
    status: 'approved',
    mediaUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    audioMood: 'Ruído metálico rítmico do debulho de milho'
  },

  // USER CURATOR PENDING ENTRIES
  {
    id: 'item-pending-1',
    type: 'narrativa',
    title: 'As Histórias em Dialeto Talian',
    author: 'Genoino Tonel',
    date: '2026-06-01',
    content: 'O Talian de Vale Vêneto tem gírias e sotaques próprios que nem na Itália de hoje se entendem perfeitamente. Gravamos os causos do seu Genoino sobre a travessia de balsa antigos rios antes das pontes de concreto existirem. Uma verdadeira joia histórico-linguística.',
    category: 'Imigração',
    status: 'pending',
    audioMood: 'Voz terna de ancião narrando memórias em dialeto'
  },
  {
    id: 'item-pending-2',
    type: 'ponto_mapa',
    title: 'Minha Árvore de Sombra Favorita na Entrada',
    author: 'Clarissa Santos',
    date: '2026-06-02',
    content: 'Na curva antes do portal de entrada do Vale, há uma figueira centenária. Ali os estudantes de violoncelo descansavam entre os ensaios exaustivos da tarde no calor de inverno e trocavam partituras sob o som da folhagem.',
    category: 'Natureza',
    status: 'pending',
    latX: 25,
    latY: 78,
    audioMood: 'Canto sutil de curiós e farfalhar de folhas generosas'
  },
  {
    id: 'item-pending-3',
    type: 'festival',
    title: 'O Primeiro Violino Estudante',
    author: 'Marcos de Souza',
    date: '2026-06-03',
    content: 'Eu vim de periferia de Porto Alegre com um violino emprestado em 2012. Lembro de dormir no alojamento comunitário do Vale Vêneto e da hospitalidade da senhora que nos trazia cuca de uva quentinha de manhã cedo. Ali decidi que a música seria minha profissão de vida. Hoje toco na OSPA.',
    category: 'Música Clássica',
    status: 'pending',
    audioMood: 'Solfejo de violino afinando no silêncio da colônia'
  }
];
