import { AdminAnalyticsClient } from "@/features/admin/components/AdminAnalyticsClient";

export const metadata = {
  title: "Admin – Analytics",
  description: "Platform analytics",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="page-content mx-auto max-w-6xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Counts and activity over time
          </p>
        </div>
        <AdminAnalyticsClient />
      </div>
    </div>
  );
}
