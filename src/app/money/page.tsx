import { LegalPage } from "@/components/legal/LegalPage";
import { moneyBackPolicy } from "@/lib/legal/legalContent";

export default function MoneyAliasPage() {
  return <LegalPage document={moneyBackPolicy} />;
}

