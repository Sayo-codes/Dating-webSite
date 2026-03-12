import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/shared/lib/auth";
import { PageContainer } from "@/shared/ui/PageContainer";
import { MessagesView } from "@/features/chat/components/MessagesView";

export const metadata = {
  title: "Messages",
  description: "Your conversations",
};

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:gap-6">
        <nav className="flex min-h-[44px] items-center" aria-label="Breadcrumb">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center rounded px-2 py-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white focus-outline"
          >
            ← Home
          </Link>
        </nav>
        <MessagesView
          user={{ id: user.id, username: user.username, role: user.role }}
        />
      </div>
    </PageContainer>
  );
}
