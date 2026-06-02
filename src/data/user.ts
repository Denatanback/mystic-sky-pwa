import type { UserProfile } from "@/lib/types";

export const mockUser: UserProfile = {
  name: "Alina",
  birthDate: "14.06.1992",
  birthTime: "08:45",
  birthPlace: "Moscow, Russia",
  level: "Seeker",
  levelProgress: 73,
  keys: 12,
  subscriptionLabel: "Mystic Plus active"
};

export const levels = ["Beginner", "Seeker", "Listener", "Seer", "Guide", "Oracle"] as const;
