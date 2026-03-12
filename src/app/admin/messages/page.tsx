import { AdminMessagesClient } from "@/features/admin/components/AdminMessagesClient";

export const metadata = {
  title: "Admin – Messages",
  description: "View and moderate conversations",
};

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white">
          Messages
        </h1>
        <p className="mt-1 text-sm text-white/60">
          View user conversations and moderate content
        </p>
      </div>
      <AdminMessagesClient />
    </div>
  );
}
