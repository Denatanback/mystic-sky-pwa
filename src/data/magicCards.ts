import type { AssociationCard, MagicVector } from "@/lib/types";

export const magicVectors: MagicVector[] = [
  { id: "self", title: "Себя", question: "Какая карта показывает тебя сейчас?" },
  { id: "love", title: "Любовь", question: "Какая карта показывает твой сценарий в любви?" },
  { id: "money", title: "Деньги", question: "Какая карта показывает твое отношение к деньгам?" },
  { id: "family", title: "Семья", question: "Какая карта показывает твою роль в семье?" },
  { id: "career", title: "Карьера", question: "Какая карта показывает следующий шаг в работе?" },
  { id: "path", title: "Путь", question: "Какая карта показывает, куда тебе двигаться дальше?" },
  { id: "shadow", title: "Тень", question: "Какая карта показывает то, что ты избегаешь?" },
  { id: "resource", title: "Ресурс", question: "Какая карта показывает твою силу сейчас?" }
];

export const associationCards: AssociationCard[] = [
  { id: "door", title: "Дверь", symbol: "▯", description: "Порог между старым и новым." },
  { id: "lamp", title: "Фонарь", symbol: "✺", description: "То, что помогает увидеть правду." },
  { id: "bird", title: "Птица", symbol: "⌁", description: "Свобода, движение, первый шаг." },
  { id: "mirror", title: "Зеркало", symbol: "◌", description: "Встреча с тем, что уже видно внутри." },
  { id: "road", title: "Дорога", symbol: "⌇", description: "Направление, которое выбирается делом." },
  { id: "star", title: "Звезда", symbol: "✦", description: "Ориентир, который нельзя доказать, но можно чувствовать." },
  { id: "key", title: "Ключ", symbol: "⚿", description: "Доступ к ответу, который уже рядом." },
  { id: "well", title: "Источник", symbol: "◍", description: "Ресурс, к которому пора вернуться." },
  { id: "mask", title: "Маска", symbol: "◒", description: "Роль, которую пора заметить." }
];
