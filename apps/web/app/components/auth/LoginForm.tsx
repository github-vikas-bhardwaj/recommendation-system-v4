import { FormButton } from "../ui/FormButton";
import { FormField } from "../ui/FormField";

export function LoginForm() {
  return (
    <form className="space-y-5" aria-label="Login form">
      <FormField
        id="login-email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <FormField
        id="login-password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />
      <FormButton type="button">Log in</FormButton>
    </form>
  );
}
