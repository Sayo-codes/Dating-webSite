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
          {children}
        </div>
      </div>
    </div>
  );
}
