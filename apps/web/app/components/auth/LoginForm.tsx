import { LoginFormClient } from "./LoginFormClient";

type LoginFormProps = {
  next?: string;
};

export function LoginForm({ next }: LoginFormProps) {
  return <LoginFormClient next={next} />;
}
