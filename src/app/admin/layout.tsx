import { requireAdmin } from "@/shared/lib/auth";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex min-h-screen flex-col sm:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1 overflow-auto">
          <div className="page-content mx-auto max-w-6xl py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
