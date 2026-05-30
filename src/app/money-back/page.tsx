import { LegalPage } from "@/components/legal/LegalPage";
import { moneyBackPolicy } from "@/lib/legal/legalContent";

export default function MoneyBackPage() {
  return <LegalPage document={moneyBackPolicy} />;
}

