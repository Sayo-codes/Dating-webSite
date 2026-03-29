import Link from "next/link";
import { requireAdmin } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export const metadata = {
  title: "Admin dashboard",
  description: "Admin overview",
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [userCount, creatorCount, conversationCount, messageCount] = await Promise.all([
    prisma.user.count(),
    prisma.creator.count(),
    prisma.conversation.count(),
    prisma.message.count(),
  ]);

  const cards = [
    { label: "Users", value: userCount, href: "/admin/analytics", color: "from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20" },
    { label: "Models", value: creatorCount, href: "/admin/models", color: "from-[var(--accent-tertiary)]/20 to-[var(--accent-primary)]/20" },
    { label: "Conversations", value: conversationCount, href: "/admin/messages", color: "from-[var(--accent-secondary)]/20 to-[var(--accent-tertiary)]/20" },
    { label: "Messages", value: messageCount, href: "/admin/messages", color: "from-white/10 to-white/5" },
  ];

  return (
    <div className="page-content mx-auto max-w-6xl py-6 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="font-[var(--font-heading)] text-xl font-semibold text-white sm:text-2xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Overview of your platform
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map(({ label, value, href, color }) => (
            <Link
              key={label}
              href={href}
              className={`rounded-[var(--radius-card)] border border-white/10 bg-gradient-to-br ${color} p-4 sm:p-6 transition hover:border-white/20`}
            >
              <p className="text-xs sm:text-sm font-medium text-white/70">{label}</p>
              <p className="mt-1.5 sm:mt-2 font-[var(--font-heading)] text-2xl sm:text-3xl font-semibold text-white">
                {value.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
            <h2 className="section-heading mb-4">Quick actions</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/models?new=1"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  Create creator profile
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/messages"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  View all conversations
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/analytics"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  View analytics
                </Link>
              </li>
            </ul>
          </section>
          <section className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
            <h2 className="section-heading mb-4">Admin</h2>
            <p className="text-sm text-white/70">
              Use the sidebar to navigate to Models, Messages, and Analytics.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
