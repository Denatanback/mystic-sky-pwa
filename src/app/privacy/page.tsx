import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/lib/legal/legalContent";

export default function PrivacyPage() {
  return <LegalPage document={privacyPolicy} />;
}

