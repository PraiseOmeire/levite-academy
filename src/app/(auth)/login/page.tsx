import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Welcome back</h1>
      {/* The form reads ?next= from the URL, which is request data. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
