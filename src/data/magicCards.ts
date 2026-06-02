import type { AssociationCard, MagicVector } from "@/lib/types";

export const magicVectors: MagicVector[] = [
  { id: "self", title: "Self", question: "Which card reflects you right now?" },
  { id: "love", title: "Love", question: "Which card reflects your pattern in love?" },
  { id: "money", title: "Money", question: "Which card reflects your relationship with money?" },
  { id: "family", title: "Family", question: "Which card reflects your role in family?" },
  { id: "career", title: "Career", question: "Which card reflects the next step in work?" },
  { id: "path", title: "Path", question: "Which card reflects where to move next?" },
  { id: "shadow", title: "Shadow", question: "Which card reflects what you avoid?" },
  { id: "resource", title: "Resource", question: "Which card reflects your strength right now?" },
];

export const associationCards: AssociationCard[] = [
  { id: "door", title: "Door", symbol: "▯", description: "The threshold between old and new." },
  { id: "lamp", title: "Lamp", symbol: "✺", description: "What helps you see the truth." },
  { id: "bird", title: "Bird", symbol: "⌁", description: "Freedom, movement, and the first step." },
  { id: "mirror", title: "Mirror", symbol: "◌", description: "A meeting with what is already visible within." },
  { id: "road", title: "Road", symbol: "⌇", description: "A direction chosen through action." },
  { id: "star", title: "Star", symbol: "✦", description: "A guide you cannot prove, but can feel." },
  { id: "key", title: "Key", symbol: "⚿", description: "Access to an answer already nearby." },
  { id: "well", title: "Well", symbol: "◍", description: "A resource it is time to return to." },
  { id: "mask", title: "Mask", symbol: "◒", description: "A role it may be time to notice." },
];
