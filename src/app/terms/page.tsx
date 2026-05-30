import { LegalPage } from "@/components/legal/LegalPage";
import { termsOfUse } from "@/lib/legal/legalContent";

export default function TermsPage() {
  return <LegalPage document={termsOfUse} />;
}

