import { AdminCreatorsClient } from "@/features/admin/components/AdminCreatorsClient";

export const metadata = {
  title: "Admin – Creators",
  description: "Manage creator profiles",
};

export default function AdminCreatorsPage() {
  return (
    <div className="page-content mx-auto max-w-6xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white">
            Creators
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Create, edit, and manage creator profiles and media
          </p>
        </div>
        <AdminCreatorsClient />
      </div>
    </div>
  );
}
