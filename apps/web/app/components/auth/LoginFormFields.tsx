import Link from "next/link";

import type { LoginActionState } from "@/lib/schemas/login";

import { FormButton } from "../ui/FormButton";
import { FormField } from "../ui/FormField";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { PasswordFormField } from "../ui/PasswordFormField";

type LoginFormFieldsProps = {
  fieldErrors?: Extract<LoginActionState, { ok: false }>["fieldErrors"];
  formError?: string;
  isPending: boolean;
  values?: Extract<LoginActionState, { ok: false }>["values"];
};

export function LoginFormFields({
  fieldErrors,
  formError,
  isPending,
  values,
}: LoginFormFieldsProps) {
  return (
    <>
      {formError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </p>
      ) : null}

      <FormField
        id="signup-email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
        defaultValue={values?.email}
        error={fieldErrors?.email}
      />
      <PasswordFormField
        id="signup-password"
        name="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="At least 8 characters."
        required
        defaultValue={values?.password}
        error={fieldErrors?.password}
      />
      <FormButton type="submit" disabled={isPending}>
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <LoadingSpinner size="sm" label="Logging in" />
            Logging in…
          </span>
        ) : (
          "Login"
        )}
      </FormButton>
      <p className="text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-violet-400 transition hover:text-violet-300"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
