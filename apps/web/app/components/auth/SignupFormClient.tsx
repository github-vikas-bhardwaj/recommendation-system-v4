"use client";

import { useActionState } from "react";

import { signupAction } from "@/actions/signup";
import { signupInitialState } from "@/lib/schemas/signup";

import { SignupFormFields } from "./SignupFormFields";

export function SignupFormClient() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    signupInitialState,
  );

  const emailConfirmationMessage =
    state.ok === true && state.emailConfirmationRequired
      ? state.message
      : undefined;
  const fieldErrors = state.ok === false ? state.fieldErrors : undefined;
  const formError = state.ok === false ? state.formError : undefined;
  const values = state.ok === false ? state.values : undefined;
  const formKey =
    state.ok === false && state.submitId != null ? state.submitId : "initial";

  return (
    <form
      key={formKey}
      className="space-y-5"
      aria-label="Sign up form"
      action={formAction}
    >
      <SignupFormFields
        fieldErrors={fieldErrors}
        formError={formError}
        emailConfirmationMessage={emailConfirmationMessage}
        isPending={isPending}
        values={values}
      />
    </form>
  );
}
