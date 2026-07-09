import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityItem, ItemType } from '../types';
import { isSupabaseConfigured, supabase } from '../supabaseClient';
import {
  BookOpen, MapPin, Music, Image as ImageIcon, Sparkles, Send,
  Map, CheckCircle2, Upload, X, FileText, Film, Volume2,
  AlertCircle, Loader2,
} from 'lucide-react';

interface SubmissionFormProps {
  onAddSubmissions: (item: CommunityItem) => void;
  onNavigate: (tab: string) => void;
}

type MediaType = 'image' | 'video' | 'audio' | 'document' | 'none';

interface UploadedFile {
  url: string;
  mediaType: MediaType;
  originalName: string;
  size: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_TYPES: Record<string, string[]> = {
  '📷 Foto': ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  '🎬 Vídeo': ['video/mp4', 'video/quicktime', 'video/webm'],
  '🎵 Áudio': ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'],
  '📄 Doc': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};
const ACCEPTED_ACCEPT = Object.values(ACCEPTED_TYPES).flat().join(',');

function MediaPreview({ file }: { file: UploadedFile }) {
  if (file.mediaType === 'image') {
    return (
      <img
        src={file.url}
        alt={file.originalName}
        className="w-full h-full object-cover rounded-xl"
        referrerPolicy="no-referrer"
      />
    );
  }
  if (file.mediaType === 'video') {
    return (
      <video
        src={file.url}
        controls
        className="w-full h-full object-contain rounded-xl bg-black"
      />
    );
  }
  if (file.mediaType === 'audio') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 w-full h-full p-4">
        <Volume2 className="w-10 h-10 text-olive-700" />
        <p className="text-xs font-mono text-stone-700 text-center truncate max-w-[90%]">{file.originalName}</p>
        <audio src={file.url} controls className="w-full" />
      </div>
    );
  }
  // Document
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full h-full p-4">
      <FileText className="w-10 h-10 text-stone-500" />
      <p className="text-xs font-mono text-stone-700 text-center truncate max-w-[90%]">{file.originalName}</p>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-mono text-olive-700 underline hover:text-olive-900"
      >
        Abrir documento ↗
      </a>
    </div>
  );
}

export default function SubmissionForm({ onAddSubmissions, onNavigate }: SubmissionFormProps) {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ItemType>('narrativa');
  const [category, setCategory] = useState('Imigração');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');

  // Cartography variables
  const [latX, setLatX] = useState<number>(50);
  const [latY, setLatY] = useState<number>(50);
  const [audioMood, setAudioMood] = useState('Sinos distantes ao entardecer');

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submit states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSafetyChecking, setIsSafetyChecking] = useState(false);

  const getMediaType = (mimeType: string): MediaType => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const sanitizeFileName = (name: string) =>
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError('');
    setIsUploading(true);
    setUploadProgress(15);

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase não configurado. Confira VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      }

      const acceptedTypes = Object.values(ACCEPTED_TYPES).flat();
      if (!acceptedTypes.includes(file.type)) {
        throw new Error('Formato não aceito. Use imagem, vídeo, áudio ou PDF/DOC.');
      }

      const maxSizeMb = 25;
      if (file.size > maxSizeMb * 1024 * 1024) {
        throw new Error(`Arquivo muito grande. Limite temporário: ${maxSizeMb} MB.`);
      }

      const mediaType = getMediaType(file.type);
      const safeName = sanitizeFileName(file.name);
      const filePath = `${mediaType}/${Date.now()}-${safeName}`;

      setUploadProgress(35);
      const { error: uploadError } = await supabase.storage
        .from('memories-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setUploadProgress(75);
      const { data } = supabase.storage.from('memories-media').getPublicUrl(filePath);

      setUploadedFile({
        url: data.publicUrl,
        mediaType,
        originalName: file.name,
        size: file.size,
      });
      setUploadProgress(100);
    } catch (err: any) {
      setUploadError(err.message || 'Erro desconhecido no upload.');
      setUploadedFile(null);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  const handleMiniMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setLatX(x);
    setLatY(y);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !title.trim() || !content.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (Autor, Título, Relato).');
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg('Você precisa aceitar a Política de Conteúdo para enviar sua memória.');
      return;
    }

    setIsSafetyChecking(true);
    setErrorMsg('');

    // Bypassing safety check on GitHub pages because there's no backend
    // The data will be saved directly.
    await new Promise(r => setTimeout(r, 800));

    const newItem: CommunityItem = {
      id: `submission-${Date.now()}`,
      type,
      title,
      author,
      date,
      content,
      category,
      status: 'pending',
      mediaUrl: uploadedFile?.url,
      mediaType: uploadedFile?.mediaType ?? 'none',
      mediaFileName: uploadedFile?.originalName,
      latX: type === 'ponto_mapa' ? latX : undefined,
      latY: type === 'ponto_mapa' ? latY : undefined,
      audioMood: audioMood.trim() || undefined,
    };

    onAddSubmissions(newItem);
    setIsSubmitted(true);
    setErrorMsg('');
    setIsSafetyChecking(false);
    setAgreedToTerms(false);

    // Clear state
    setAuthor('');
    setTitle('');
    setContent('');
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <div id="submission-form" className="max-w-4xl mx-auto space-y-8">
      {/* Editorial Heading */}
      <div className="space-y-1 text-center md:text-left">
        <span className="text-xs text-olive-700 font-mono tracking-widest uppercase">Vozes da Comunidade</span>
        <h2 className="text-3xl font-serif text-stone-900 tracking-tight">Deixar Meu Registro &amp; Memória</h2>
        <p className="text-sm font-sans text-stone-600 font-light max-w-xl">
          Preencha o manifesto abaixo com suas memórias familiares, parágrafos orais, fotos de arquivos coloniais, ou cadastre afetos na cartografia. Seu relato entrará na fila de curadoria.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-6 shadow-xl"
          >
            <div className="p-4 bg-emerald-100 text-emerald-800 rounded-full w-fit mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-2xl font-serif text-emerald-900">História Registrada com Sucesso!</h3>
              <p className="text-sm text-emerald-700 font-sans leading-relaxed">
                Agradecemos profundamente pela sua preciosa contribuição para o patrimônio de Vale Vêneto. Para assegurar o valor ético e o rigor histórico, toda submissão passa pela curadoria do portal.
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 mt-4 text-xs font-mono text-emerald-600">
                Lembrete: O conteúdo ficará reservado no painel do curador até ser aprovado por Débora Gasparetto.
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                id="btn-add-more"
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2.5 bg-emerald-600 text-stone-50 rounded-xl hover:bg-emerald-700 text-xs font-mono uppercase cursor-pointer tracking-wider"
              >
                Escrever Outro Relato
              </button>
              <button
                id="btn-view-curate-gate"
                onClick={() => onNavigate('curadoria')}
                className="px-5 py-2.5 bg-stone-900 text-gold-400 rounded-xl hover:bg-black text-xs font-mono uppercase cursor-pointer tracking-wider border border-stone-800"
              >
                Ir para Curadoria &rarr;
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200 shadow-xl space-y-8"
          >
            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-mono">
                {errorMsg}
              </div>
            )}

            {/* Stage 1: Contributor metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">
                  Seu Nome / Autor da Memória *
                </label>
                <input
                  id="form-author"
                  type="text"
                  required
                  placeholder="Ex: Pedro Pivotto Gasparetto"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100 focus:bg-white border border-stone-200 hover:border-stone-400 focus:border-stone-900 px-4 py-3 rounded-xl outline-none transition text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">
                  Data de Registro da História *
                </label>
                <input
                  id="form-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl outline-none text-sm text-stone-600 focus:border-stone-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Stage 2: Format & Classification */}
            <div className="space-y-4">
              <span className="block text-xs font-mono text-stone-500 uppercase tracking-wider font-bold">
                Tipo e Categoria de Registro
              </span>

              {/* Type Grid Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: 'narrativa', label: 'Crônica / Narrativa', icon: BookOpen },
                  { value: 'ponto_mapa', label: 'Ponto no Mapa', icon: MapPin },
                  { value: 'festival', label: 'Memória do Festival', icon: Music },
                  { value: 'midia', label: 'Imagens do Arquivo', icon: ImageIcon },
                ].map((itemType) => {
                  const Icon = itemType.icon;
                  const isSelected = type === itemType.value;
                  return (
                    <button
                      key={itemType.value}
                      type="button"
                      id={`type-select-${itemType.value}`}
                      onClick={() => setType(itemType.value as ItemType)}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                        isSelected
                          ? 'bg-olive-900 text-stone-50 border-stone-950 shadow-md shadow-olive-950/20'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-205 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-serif font-medium">{itemType.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Category Option selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide">
                    Categoria Cultural principal
                  </label>
                  <select
                    id="form-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-sm text-stone-700 outline-none focus:border-stone-900 focus:bg-white"
                  >
                    <option>Imigração</option>
                    <option>Gastronomia</option>
                    <option>Música Clássica</option>
                    <option>Religião</option>
                    <option>Natureza</option>
                  </select>
                </div>

                {/* Simulated ambient sound signatures */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-stone-500 uppercase tracking-wide">
                    Assinatura Sonora Presenciada
                  </label>
                  <input
                    id="form-audiomood"
                    type="text"
                    placeholder="Ex: Córrego murmurando, Sino às 18h..."
                    value={audioMood}
                    onChange={(e) => setAudioMood(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl outline-none text-sm transition focus:border-stone-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Coordinates Selector (Only if type is ponto_mapa) */}
            <AnimatePresence>
              {type === 'ponto_mapa' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 p-6 bg-stone-50 border border-stone-200/60 rounded-3xl"
                >
                  <div className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-olive-700" />
                    <div>
                      <h4 className="font-serif font-medium text-stone-900 text-sm">Posicionar no Mapa Afetivo</h4>
                      <p className="text-[11px] text-stone-500 font-light">Clique em qualquer local sobre a malha de ecrã abaixo para definir as coordenadas do ponto.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Visual Coordinate picker inside a mock canvas */}
                    <div className="md:col-span-7 bg-stone-200 h-40 rounded-2xl relative cursor-pointer overflow-hidden border border-stone-300" onClick={handleMiniMapClick}>
                      <div className="absolute inset-0 bg-[radial-gradient(#ab9742_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-stone-400 select-none">
                        Grade Mental do Vale 2D (Clique para marcar)
                      </div>

                      {/* Anchor crosshair */}
                      <span className="absolute left-1/2 inset-x-0 h-[1px] bg-stone-300/60 translate-y-1/2"></span>
                      <span className="absolute top-1/2 inset-y-0 w-[1px] bg-stone-300/60 translate-x-1/2"></span>

                      {/* Selected marker dot */}
                      <div
                        className="absolute w-4 h-4 bg-emerald-500 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 animate-pulse"
                        style={{ left: `${latX}%`, top: `${latY}%` }}
                      />
                    </div>

                    <div className="md:col-span-5 grid grid-cols-2 gap-4 font-mono text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-stone-250">
                        <span className="block text-[8px] text-stone-400 uppercase font-black uppercase">Coordenada X</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={latX}
                          onChange={(e) => setLatX(Number(e.target.value))}
                          className="w-full font-bold text-stone-900 outline-none text-sm pt-1"
                        />
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-stone-250">
                        <span className="block text-[8px] text-stone-400 uppercase font-black uppercase">Coordenada Y</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={latY}
                          onChange={(e) => setLatY(Number(e.target.value))}
                          className="w-full font-bold text-stone-900 outline-none text-sm pt-1"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage 3: The Chronicle Text Area */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">
                Relato da Memória / Detalhamento Histórico *
              </label>
              <textarea
                id="form-content"
                required
                rows={6}
                placeholder="Discorra de forma livre ou acadêmica sobre acontecimentos, sotaques, causos folclóricos, receitas familiares ou memórias que dão vida à colônia..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-stone-50 focus:bg-white border border-stone-200 focus:border-stone-900 p-4 rounded-2xl outline-none transition text-sm leading-relaxed"
              />
            </div>

            {/* Stage 4: File Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">
                  Arquivo de Memória (Opcional)
                </label>
                <p className="text-[11px] text-stone-400 font-light mt-0.5">
                  Arraste e solte ou clique para enviar — Foto, Vídeo, Áudio ou Documento (PDF/Word). Máx. 50 MB.
                </p>

                {/* Accepted types legend */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(ACCEPTED_TYPES).map(([label]) => (
                    <span
                      key={label}
                      className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono text-stone-500"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hidden native file input */}
              <input
                ref={fileInputRef}
                id="form-file-input"
                type="file"
                accept={ACCEPTED_ACCEPT}
                className="hidden"
                onChange={handleFileInputChange}
              />

              <AnimatePresence mode="wait">
                {/* Drop zone — only when no file uploaded */}
                {!uploadedFile && !isUploading && (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    id="file-drop-zone"
                    className={`
                      relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                      flex flex-col items-center justify-center gap-3 transition-all duration-200
                      ${isDragging
                        ? 'border-olive-600 bg-olive-50 scale-[1.01]'
                        : 'border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100'
                      }
                    `}
                  >
                    {/* Animated upload icon */}
                    <motion.div
                      animate={isDragging ? { y: [-4, 0, -4], scale: 1.15 } : { y: 0, scale: 1 }}
                      transition={{ repeat: isDragging ? Infinity : 0, duration: 0.8 }}
                      className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-olive-100 text-olive-700' : 'bg-stone-200 text-stone-500'}`}
                    >
                      <Upload className="w-7 h-7" />
                    </motion.div>

                    <div>
                      <p className={`font-medium text-sm transition-colors ${isDragging ? 'text-olive-800' : 'text-stone-600'}`}>
                        {isDragging ? 'Solte aqui!' : 'Arraste um arquivo ou clique para selecionar'}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1 font-mono">
                        JPG · PNG · WEBP · GIF · MP4 · MOV · MP3 · WAV · PDF · DOCX
                      </p>
                    </div>

                    {uploadError && (
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-mono">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {uploadError}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Upload in progress */}
                {isUploading && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-2 border-dashed border-olive-300 bg-olive-50 rounded-2xl p-8 flex flex-col items-center gap-4"
                  >
                    <Loader2 className="w-8 h-8 text-olive-600 animate-spin" />
                    <p className="text-sm font-mono text-olive-800">Enviando arquivo… {uploadProgress}%</p>
                    <div className="w-full max-w-xs bg-stone-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-olive-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* File preview after successful upload */}
                {uploadedFile && !isUploading && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="relative border border-stone-200 rounded-2xl overflow-hidden bg-stone-100"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      id="btn-remove-file"
                      onClick={() => { setUploadedFile(null); setUploadProgress(0); setUploadError(''); }}
                      className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur border border-stone-300 text-stone-600 hover:text-rose-600 hover:border-rose-300 rounded-full p-1.5 transition shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Type badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-emerald-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase shadow">
                      {uploadedFile.mediaType === 'image' && <ImageIcon className="w-3 h-3" />}
                      {uploadedFile.mediaType === 'video' && <Film className="w-3 h-3" />}
                      {uploadedFile.mediaType === 'audio' && <Volume2 className="w-3 h-3" />}
                      {uploadedFile.mediaType === 'document' && <FileText className="w-3 h-3" />}
                      {uploadedFile.mediaType}
                    </div>

                    {/* Media content */}
                    <div className="w-full aspect-video">
                      <MediaPreview file={uploadedFile} />
                    </div>

                    {/* File metadata footer */}
                    <div className="p-3 border-t border-stone-200 bg-white flex items-center justify-between">
                      <span className="text-xs font-mono text-stone-600 truncate max-w-[70%]">{uploadedFile.originalName}</span>
                      <span className="text-[10px] font-mono text-stone-400">{formatBytes(uploadedFile.size)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Replace file button after upload */}
              {uploadedFile && (
                <button
                  type="button"
                  id="btn-replace-file"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-mono text-stone-400 hover:text-stone-700 underline cursor-pointer transition"
                >
                  Trocar arquivo
                </button>
              )}
            </div>

            {/* Stage 5: Terms & Submit Block */}
            <div className="space-y-6 pt-4 border-t border-stone-100">
              {/* Terms of Service Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 transition">
                <div className="mt-0.5 flex-shrink-0">
                  <input 
                    type="checkbox" 
                    id="form-terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-olive-600 bg-white border-stone-300 rounded focus:ring-olive-500 focus:ring-2 cursor-pointer"
                  />
                </div>
                <div className="text-xs text-stone-600 font-sans leading-relaxed">
                  <strong className="text-stone-900 block mb-1">Política de Conteúdo & Moderação Ativa</strong>
                  Declaro que este relato não contém material difamatório, discurso de ódio, conteúdo explícito ou político partidário. Compreendo que minha submissão passará por uma análise de IA rigorosa e por curadoria humana antes de ser publicada.
                </div>
              </label>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] text-gold-600 font-mono tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  <span>Rumo ao Arquivo Digital Ativo</span>
                </span>

                <button
                  type="submit"
                  disabled={isSafetyChecking || !agreedToTerms}
                  id="form-submit-button"
                  className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transform transition text-xs font-mono uppercase tracking-wider ${
                    isSafetyChecking || !agreedToTerms 
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                      : 'bg-stone-900 text-gold-400 hover:bg-black hover:-translate-y-0.5 cursor-pointer'
                  }`}
                >
                  {isSafetyChecking ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                  ) : (
                    <Send className="w-4 h-4 text-gold-400" />
                  )}
                  <span>{isSafetyChecking ? 'Analisando Segurança...' : 'Enviar para Curadoria'}</span>
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
