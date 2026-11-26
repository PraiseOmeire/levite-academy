import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "My instruments" };

export default function DashboardPage() {
  return (
    <PagePlaceholder
      title="My instruments"
      description="Your enrollments, subscription status and progress (Lesson X of Y)."
      phase={1}
    />
  );
}
