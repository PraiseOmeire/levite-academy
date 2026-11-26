import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Subscriptions" };

export default function AdminSubscriptionsPage() {
  return (
    <PagePlaceholder
      title="Subscriptions"
      description="Active, expiring soon and expired subscriptions."
      phase={5}
    />
  );
}
