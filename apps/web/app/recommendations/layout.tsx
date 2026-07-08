import { requireUser } from "@/lib/auth/require-user";

export default async function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <>{children}</>;
}
