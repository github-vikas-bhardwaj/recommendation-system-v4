import type { SignupActionState } from "@/lib/schemas/signup";

import { FormButton } from "../ui/FormButton";
import { FormField } from "../ui/FormField";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { PasswordFormField } from "../ui/PasswordFormField";

type SignupFormFieldsProps = {
  fieldErrors?: Extract<SignupActionState, { ok: false }>["fieldErrors"];
  formError?: string;
  isPending: boolean;
  values?: Extract<SignupActionState, { ok: false }>["values"];
  emailConfirmationMessage?: string;
};

export function SignupFormFields({
  fieldErrors,
  formError,
  isPending,
  values,
  emailConfirmationMessage,
}: SignupFormFieldsProps) {
  return (
    <>
      {emailConfirmationMessage ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {emailConfirmationMessage}
        </p>
      ) : null}
      {formError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="signup-first-name"
          name="firstName"
          type="text"
          label="First name"
          placeholder="Alex"
          autoComplete="given-name"
          required
          defaultValue={values?.firstName}
          error={fieldErrors?.firstName}
        />
        <FormField
          id="signup-last-name"
          name="lastName"
          type="text"
          label="Last name"
          placeholder="Rivera"
          autoComplete="family-name"
          defaultValue={values?.lastName}
          error={fieldErrors?.lastName}
        />
      </div>
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
      <PasswordFormField
        id="signup-confirm-password"
        name="confirmPassword"
        label="Confirm password"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        defaultValue={values?.confirmPassword}
        error={fieldErrors?.confirmPassword}
      />
      <FormButton type="submit" disabled={isPending}>
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <LoadingSpinner size="sm" label="Creating account" />
            Creating account…
          </span>
        ) : (
          "Create account"
        )}
      </FormButton>
    </>
  );
}
