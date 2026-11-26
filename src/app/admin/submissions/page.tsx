import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Assignment queue" };

export default function AdminSubmissionsPage() {
  return (
    <PagePlaceholder
      title="Assignment queue"
      description="Submissions for your instruments, oldest first, with time left before the 48-hour review promise."
      phase={3}
    />
  );
}
