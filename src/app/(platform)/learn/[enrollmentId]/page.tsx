import { Suspense } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Course" };

// Not async: params are read inside <Suspense> so the page shell can still prerender.
export default function CoursePage(props: PageProps<"/learn/[enrollmentId]">) {
  return (
    <PagePlaceholder
      title="Course"
      description={
        <Suspense fallback="Loading course…">
          {props.params.then(
            ({ enrollmentId }) =>
              `Modules and lessons for enrollment ${enrollmentId}: locked, unlocked, "Unlocks on <date>", and Lesson X of Y progress.`,
          )}
        </Suspense>
      }
      phase={2}
    />
  );
}
