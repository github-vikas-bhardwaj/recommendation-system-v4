import { FormButton } from "../ui/FormButton";
import { FormField } from "../ui/FormField";

export function SignupForm() {
  return (
    <form className="space-y-5" aria-label="Sign up form">
      <FormField
        id="signup-name"
        name="name"
        type="text"
        label="Full name"
        placeholder="Alex Rivera"
        autoComplete="name"
        required
      />
      <FormField
        id="signup-email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <FormField
        id="signup-password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="At least 8 characters."
        required
      />
      <FormField
        id="signup-confirm-password"
        name="confirmPassword"
        type="password"
        label="Confirm password"
        placeholder="••••••••"
        autoComplete="new-password"
        required
      />
      <FormButton type="button">Create account</FormButton>
    </form>
  );
}
