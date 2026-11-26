import { RegisterForm } from "./register-form";

export const metadata = { title: "Create your account" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold">Create your account</h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Step 1 of 4. Next you&apos;ll add your details and choose an instrument.
      </p>
      <RegisterForm />
    </>
  );
}
