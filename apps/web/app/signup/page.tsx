import type { Metadata } from "next";

import { AuthCard } from "../components/auth/AuthCard";
import { AuthHeading } from "../components/auth/AuthHeading";
import { AuthPageShell } from "../components/auth/AuthPageShell";
import { SignupForm } from "../components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up — ReelMind",
  description: "Create your ReelMind account.",
};

export default function SignupPage() {
  return (
    <AuthPageShell>
      <AuthCard>
        <AuthHeading
          title="Create your account"
          description="Join ReelMind and start getting picks tailored to your taste."
        />
        <SignupForm />
      </AuthCard>
    </AuthPageShell>
  );
}
