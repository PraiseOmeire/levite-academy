import { Suspense } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Review submission" };

// Not async: params are read inside <Suspense> so the page shell can still prerender.
export default function ReviewSubmissionPage(
  props: PageProps<"/admin/submissions/[submissionId]">,
) {
  return (
    <PagePlaceholder
      title="Review submission"
      description={
        <Suspense fallback="Loading submission…">
          {props.params.then(
            ({ submissionId }) =>
              `Watch submission ${submissionId}, then approve or reject it with written feedback.`,
          )}
        </Suspense>
      }
      phase={3}
    />
  );
}
