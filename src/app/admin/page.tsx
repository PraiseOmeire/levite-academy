import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Admin overview" };

export default function AdminOverviewPage() {
  return (
    <PagePlaceholder
      title="Admin overview"
      description="Registrations per week and month, active and expiring subscriptions, and submissions waiting for review."
      phase={5}
    />
  );
}
