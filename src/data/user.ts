import type { UserProfile } from "@/lib/types";

export const mockUser: UserProfile = {
  name: "Alyssa",
  birthDate: "14.06.1992",
  birthTime: "08:45",
  birthPlace: "New York, United States",
  level: "Seeker",
  levelProgress: 73,
  keys: 12,
  subscriptionLabel: "Mystic Plus active",
};

export const levels = ["Newcomer", "Seeker", "Listener", "Seer", "Guide", "Oracle"] as const;
