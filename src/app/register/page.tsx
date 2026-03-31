import { safeInternalPath } from "@/shared/lib/safe-redirect";
import { RegisterView } from "./register-view";

export const metadata = {
  title: "Join - Rsdate",
  description: "Create your account to connect with premium creators and exclusive matches.",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = safeInternalPath(next);

  return <RegisterView redirectAfterRegister={nextPath} />;
}
