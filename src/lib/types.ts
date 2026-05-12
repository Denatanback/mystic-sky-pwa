export type PathId = "astrology" | "numerology" | "human-design" | "past-life" | "spiritual-practices";

export type SkyPath = {
  id: PathId;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  progress: number;
  openedStars: number;
  totalStars: number;
  icon: string;
  stars: SkyStar[];
};

export type SkyStar = {
  id: string;
  title: string;
  layer: "basic" | "deep" | "premium";
  status: "opened" | "available" | "locked";
};

export type UserLevel = "Новичок" | "Искатель" | "Слушающий" | "Видящий" | "Проводник" | "Оракул";

export type UserProfile = {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  level: UserLevel;
  levelProgress: number;
  keys: number;
  subscriptionLabel: string;
};

export type MagicVectorId = "self" | "love" | "money" | "family" | "career" | "path" | "shadow" | "resource";

export type MagicVector = {
  id: MagicVectorId;
  title: string;
  question: string;
};

export type AssociationCard = {
  id: string;
  title: string;
  symbol: string;
  description: string;
};

export type JournalEntry = {
  id: string;
  type: "sky" | "cards" | "today";
  title: string;
  description: string;
  date: string;
};
