import { LegalPage } from "@/components/legal/LegalPage";
import { supportContactPolicy } from "@/lib/legal/legalContent";

export default function SupportPage() {
  return <LegalPage document={supportContactPolicy} />;
}
