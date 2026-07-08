import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email({ message: "Invalid email address" })),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform(({ firstName, lastName, email, password }) => ({
    firstName,
    lastName,
    email,
    password,
  }));

export type SignupInput = z.infer<typeof signupSchema>;

const signupFields = [
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
] as const;

export type SignupField = (typeof signupFields)[number];

export type SignupFormValues = Record<SignupField, string>;

export function parseSignupFormValues(formData: FormData): SignupFormValues {
  return {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
}

export function mapSignupFieldErrors(
  error: z.ZodError,
): Partial<Record<SignupField, string>> {
  const fieldErrors: Partial<Record<SignupField, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      typeof field === "string" &&
      signupFields.includes(field as SignupField) &&
      !fieldErrors[field as SignupField]
    ) {
      fieldErrors[field as SignupField] = issue.message;
    }
  }

  return fieldErrors;
}

export type SignupActionState =
  | {
      ok: false;
      fieldErrors?: Partial<
        Record<
          "firstName" | "lastName" | "email" | "password" | "confirmPassword",
          string
        >
      >;
      formError?: string;
      values?: SignupFormValues;
      submitId?: number;
    }
  | {
      ok: true;
      emailConfirmationRequired: true;
      message: string;
    };

export const signupInitialState: SignupActionState = { ok: false };

export function signupValuesWithoutPasswords(
  values: SignupFormValues,
): SignupFormValues {
  return { ...values, password: "", confirmPassword: "" };
}

export function signupFailureState(
  values: SignupFormValues,
  overrides: Omit<Extract<SignupActionState, { ok: false }>, "ok" | "submitId">,
): Extract<SignupActionState, { ok: false }> {
  return {
    ok: false,
    ...overrides,
    values: signupValuesWithoutPasswords(values),
    submitId: Date.now(),
  };
}
