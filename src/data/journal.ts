import type { JournalEntry } from "@/lib/types";

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    type: "today",
    title: "Daily forecast opened",
    description: "You opened today’s forecast and saved your first focus.",
    date: "Today",
  },
  {
    id: "j2",
    type: "cards",
    title: "Association card: Lamp",
    description: "In your path theme, you chose the image of light and reality-checking.",
    date: "Yesterday",
  },
  {
    id: "j3",
    type: "sky",
    title: "New star in Astrology",
    description: "The basic layer of your Sun sign has opened.",
    date: "2 days ago",
  },
];
