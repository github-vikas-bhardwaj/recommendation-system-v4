import type { Metadata } from "next";

import { AuthCard } from "../components/auth/AuthCard";
import { AuthHeading } from "../components/auth/AuthHeading";
import { AuthPageShell } from "../components/auth/AuthPageShell";
import { LoginForm } from "../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in — ReelMind",
  description: "Log in to your ReelMind account.",
};

export default function LoginPage() {
  return (
    <AuthPageShell>
      <AuthCard>
        <AuthHeading
          title="Welcome back"
          description="Log in to pick up your recommendations where you left off."
        />
        <LoginForm />
      </AuthCard>
    </AuthPageShell>
  );
}
