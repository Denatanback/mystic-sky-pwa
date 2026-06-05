import {
  dailyCards as sourceDailyCards,
  getDailyCardById as getSourceDailyCardById,
  type DailyCard as SourceDailyCard,
} from "@/lib/dailyCards";

export type DailyCard = SourceDailyCard & {
  title: string;
  theme: string;
  reflection: string;
};

function toLegacyDailyCard(card: SourceDailyCard): DailyCard {
  return {
    ...card,
    title: card.name,
    theme: card.tags[0] ? card.tags[0].replace(/-/g, " ") : "symbolic guidance",
    reflection: card.reflectionQuestion,
  };
}

export const dailyCards: DailyCard[] = sourceDailyCards.map(toLegacyDailyCard);

export function getDailyCardById(id: number | string | null | undefined) {
  const card = getSourceDailyCardById(id);
  return card ? toLegacyDailyCard(card) : null;
}
