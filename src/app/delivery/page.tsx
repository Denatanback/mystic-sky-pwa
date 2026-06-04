import { LegalPage } from "@/components/legal/LegalPage";
import { deliveryPolicy } from "@/lib/legal/legalContent";

export default function DeliveryPage() {
  return <LegalPage document={deliveryPolicy} />;
}
