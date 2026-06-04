import { LegalPage } from "@/components/legal/LegalPage";
import { cancellationPolicy } from "@/lib/legal/legalContent";

export default function CancellationPage() {
  return <LegalPage document={cancellationPolicy} />;
}
