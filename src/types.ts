/**
 * Types representing data structures for Vale Vêneto Portal
 */

export type ItemType = 'narrativa' | 'ponto_mapa' | 'festival' | 'midia';

export type StoryStatus = 'pending' | 'approved' | 'rejected';

export interface CommunityItem {
  id: string;
  type: ItemType;
  title: string;
  author: string;
  date: string;
  content: string;
  category: string; // e.g., "Imigração", "Gastronomia", "Música Clássica", "Religião", "Natureza"
  status: StoryStatus;
  mediaUrl?: string; // Base64 or image URL
  mediaType?: 'image' | 'video' | 'audio' | 'document' | 'none';
  mediaFileName?: string; // Original filename for display purposes
  // Coordinates for Interactive Mental Cartography (0 to 100 percentages)
  latX?: number; 
  latY?: number;
  audioMood?: string; // Simulated ambient acoustic signature (eg. "Sinos distantes", "Córrego", "Sopro na Encosta")
}

export interface FestivalYear {
  year: number;
  edition: string;
  focus: string;
  students: number;
  concerts: number;
  highlights: string[];
  description: string;
}

export interface MentalMapReference {
  id: string;
  name: string;
  type: 'historical' | 'nature' | 'public' | 'music';
  description: string;
  x: number; // grid X
  y: number; // grid Y
  audioSignature: string;
}
