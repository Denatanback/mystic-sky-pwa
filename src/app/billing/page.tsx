import { LegalPage } from "@/components/legal/LegalPage";
import { billingTerms } from "@/lib/legal/legalContent";

export default function BillingPage() {
  return <LegalPage document={billingTerms} />;
}

