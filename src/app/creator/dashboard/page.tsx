import { redirect } from "next/navigation";
import { getCurrentUser } from "@/shared/lib/auth";
import { CreatorDashboardClient } from "@/features/creators/components/CreatorDashboardClient";
import { PageContainer } from "@/shared/ui/PageContainer";

export const metadata = {
  title: "Creator dashboard",
  description: "Manage your profile and gallery",
};

export default async function CreatorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "creator") redirect("/");

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <a href="/" className="text-sm text-white/60 hover:text-white/80">
          ← Home
        </a>
        <CreatorDashboardClient />
      </div>
    </PageContainer>
  );
}
