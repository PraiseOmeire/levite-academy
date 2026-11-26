import { Suspense } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Lesson" };

// Not async: params are read inside <Suspense> so the page shell can still prerender.
export default function LessonPage(
  props: PageProps<"/learn/[enrollmentId]/lessons/[lessonId]">,
) {
  return (
    <PagePlaceholder
      title="Lesson"
      description={
        <Suspense fallback="Loading lesson…">
          {props.params.then(
            ({ lessonId }) =>
              `Video player for lesson ${lessonId}. The assignment appears after more than 50% is watched; submit a recording and see instructor feedback.`,
          )}
        </Suspense>
      }
      phase={2}
    />
  );
}
