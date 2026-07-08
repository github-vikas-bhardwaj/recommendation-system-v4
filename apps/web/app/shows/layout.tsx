import { requireUser } from "@/lib/auth/require-user";

export default async function ShowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <>{children}</>;
}
