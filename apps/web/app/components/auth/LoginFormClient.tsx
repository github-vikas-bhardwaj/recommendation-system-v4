"use client";

import { useActionState } from "react";

import { loginAction } from "@/actions/login";
import { loginInitialState } from "@/lib/schemas/login";

import { LoginFormFields } from "./LoginFormFields";

type LoginFormClientProps = {
  next?: string;
};

export function LoginFormClient({ next }: LoginFormClientProps) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    loginInitialState,
  );

  const fieldErrors = state.ok === false ? state.fieldErrors : undefined;
  const formError = state.ok === false ? state.formError : undefined;
  const values = state.ok === false ? state.values : undefined;
  const formKey =
    state.ok === false && state.submitId != null ? state.submitId : "initial";

  return (
    <form
      key={formKey}
      className="space-y-5"
      aria-label="Login form"
      action={formAction}
    >
      <LoginFormFields
        fieldErrors={fieldErrors}
        formError={formError}
        isPending={isPending}
        values={values}
      />
      {next ? <input type="hidden" name="next" value={next} /> : null}
    </form>
  );
}
