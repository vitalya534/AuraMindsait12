
export enum AgeRange {
  TEEN = '13-18',
  ADULT = '19-35',
  NONE = 'none'
}

export enum ResponseStyle {
  SHORT = 'short',
  LONG = 'long'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NEUTRAL = 'neutral'
}

export interface UserSettings {
  age: AgeRange;
  style: ResponseStyle;
  advice: boolean;
  botGender: Gender;
  userGender: Gender;
  deepAnalysis: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  timestamp: Date;
}

export interface PremiumState {
  isPremium: boolean;
  key: string | null;
}
