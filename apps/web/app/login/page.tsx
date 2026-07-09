import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "../components/auth/AuthCard";
import { AuthHeading } from "../components/auth/AuthHeading";
import { AuthPageShell } from "../components/auth/AuthPageShell";
import { LoginForm } from "../components/auth/LoginForm";
import { LoginFormSection } from "./LoginFormSection";

export const metadata: Metadata = {
  title: "Log in — ReelMind",
  description: "Log in to your ReelMind account.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <AuthPageShell>
      <AuthCard>
        <AuthHeading
          title="Welcome back"
          description="Log in to pick up your recommendations where you left off."
        />
        <Suspense fallback={<LoginForm />}>
          <LoginFormSection searchParams={searchParams} />
        </Suspense>
      </AuthCard>
    </AuthPageShell>
  );
}
