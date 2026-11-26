import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Students" };

export default function AdminStudentsPage() {
  return (
    <PagePlaceholder
      title="Students"
      description="Registered students and their enrollments."
      phase={5}
    />
  );
}
