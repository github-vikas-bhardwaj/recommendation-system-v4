import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Invalid email address" })),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

const loginFields = ["email", "password"] as const;
export type LoginField = (typeof loginFields)[number];
export type LoginFormValues = Record<LoginField, string>;

export function parseLoginFormValues(formData: FormData): LoginFormValues {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export function mapLoginFieldErrors(
  error: z.ZodError,
): Partial<Record<LoginField, string>> {
  const fieldErrors: Partial<Record<LoginField, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      typeof field === "string" &&
      loginFields.includes(field as LoginField) &&
      !fieldErrors[field as LoginField]
    ) {
      fieldErrors[field as LoginField] = issue.message;
    }
  }

  return fieldErrors;
}

export type LoginActionState =
  | {
      ok: false;
      fieldErrors?: Partial<Record<LoginField, string>>;
      formError?: string;
      values?: LoginFormValues;
      submitId?: number;
    }
  | { ok: true }; // you won't return this — redirect throws instead

export const loginInitialState: LoginActionState = { ok: false };

export function loginValuesWithoutPassword(
  values: LoginFormValues,
): LoginFormValues {
  return { ...values, password: "" };
}

export function loginFailureState(
  values: LoginFormValues,
  overrides: Omit<Extract<LoginActionState, { ok: false }>, "ok" | "submitId">,
): Extract<LoginActionState, { ok: false }> {
  return {
    ok: false,
    ...overrides,
    values: loginValuesWithoutPassword(values),
    submitId: Date.now(),
  };
}
