import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/lib/legal/legalContent";

export default function PolicyAliasPage() {
  return <LegalPage document={privacyPolicy} />;
}

