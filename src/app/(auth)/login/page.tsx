import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <PagePlaceholder
      title="Log in"
      description="Email and password sign-in."
      phase={1}
    />
  );
}
