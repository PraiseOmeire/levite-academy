import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Courses" };

export default function AdminCoursesPage() {
  return (
    <PagePlaceholder
      title="Courses"
      description="Instruments, levels, modules and lessons. Upload lesson videos and assignments."
      phase={2}
    />
  );
}
