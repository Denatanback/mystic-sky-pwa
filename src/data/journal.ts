import type { JournalEntry } from "@/lib/types";

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    type: "today",
    title: "Дневной прогноз открыт",
    description: "Ты получил прогноз дня и сохранил первый фокус.",
    date: "Сегодня"
  },
  {
    id: "j2",
    type: "cards",
    title: "Карта ассоциаций: Фонарь",
    description: "В теме пути ты выбрала образ света и проверки реальности.",
    date: "Вчера"
  },
  {
    id: "j3",
    type: "sky",
    title: "Новая звезда в Астрологии",
    description: "Открыт базовый слой солнечного знака.",
    date: "2 дня назад"
  }
];
