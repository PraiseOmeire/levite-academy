import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Create your account" };

export default function RegisterPage() {
  return (
    <PagePlaceholder
      title="Create your account"
      description="Name, email, password and WhatsApp number. The rest is collected during onboarding."
      phase={1}
    />
  );
}
