import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { CommunityItem } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Garante que a URL tenha https:// e remove barra final
const supabaseUrl = rawUrl
  ? (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`).replace(/\/+$/, '')
  : '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('[v0] Falha ao criar o cliente Supabase:', e);
    client = null;
  }
}
export const supabase: SupabaseClient | null = client;

export function mapDbToItem(db: any): CommunityItem {
  return {
    id: String(db.id),
    type: db.type,
    title: db.title,
    author: db.author,
    date: db.date,
    content: db.content,
    category: db.category,
    status: db.status,
    mediaUrl: db.media_url || undefined,
    mediaType: db.media_type || 'none',
    mediaFileName: db.media_file_name || undefined,
    latX: db.lat_x !== null && db.lat_x !== undefined ? Number(db.lat_x) : undefined,
    latY: db.lat_y !== null && db.lat_y !== undefined ? Number(db.lat_y) : undefined,
    audioMood: db.audio_mood || undefined,
  };
}

export function mapItemToDb(item: CommunityItem) {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    author: item.author,
    date: item.date,
    content: item.content,
    category: item.category,
    status: item.status,
    media_url: item.mediaUrl || null,
    media_type: item.mediaType || 'none',
    media_file_name: item.mediaFileName || null,
    lat_x: item.latX ?? null,
    lat_y: item.latY ?? null,
    audio_mood: item.audioMood || null,
  };
}
