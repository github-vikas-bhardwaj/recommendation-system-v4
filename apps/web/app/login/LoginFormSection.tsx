import { LoginForm } from "@/app/components/auth/LoginForm";

type LoginFormSectionProps = {
  searchParams: Promise<{ next?: string }>;
};

export async function LoginFormSection({
  searchParams,
}: LoginFormSectionProps) {
  const { next } = await searchParams;

  return <LoginForm next={next} />;
}
