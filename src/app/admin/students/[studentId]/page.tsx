import { Suspense } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Student" };

// Not async: params are read inside <Suspense> so the page shell can still prerender.
export default function StudentPage(props: PageProps<"/admin/students/[studentId]">) {
  return (
    <PagePlaceholder
      title="Student"
      description={
        <Suspense fallback="Loading student…">
          {props.params.then(
            ({ studentId }) =>
              `Profile, enrollments, subscription and lesson progress for student ${studentId}.`,
          )}
        </Suspense>
      }
      phase={5}
    />
  );
}
