import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Get started" };

export default function OnboardingPage() {
  return (
    <PagePlaceholder
      title="Get started"
      description="Profile details, then choose an instrument and level (plus familiar genres for intermediate and expert), then pay."
      phase={1}
    />
  );
}
