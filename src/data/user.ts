import type { UserProfile } from "@/lib/types";

export const mockUser: UserProfile = {
  name: "Алина",
  birthDate: "14.06.1992",
  birthTime: "08:45",
  birthPlace: "Москва, Россия",
  level: "Искатель",
  levelProgress: 73,
  keys: 12,
  subscriptionLabel: "Mystic Plus активен"
};

export const levels = ["Новичок", "Искатель", "Слушающий", "Видящий", "Проводник", "Оракул"] as const;
