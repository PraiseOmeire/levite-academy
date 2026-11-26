import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <PagePlaceholder
      title="Profile"
      description="Your details, photo and next of kin."
      phase={1}
    />
  );
}
