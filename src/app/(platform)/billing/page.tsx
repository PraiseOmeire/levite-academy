import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <PagePlaceholder
      title="Billing"
      description="Subscriptions per instrument and the auto-renew toggle."
      phase={4}
    />
  );
}
