import { AdminMediaVaultClient } from "@/features/admin/components/AdminMediaVaultClient";

export const metadata = {
  title: "Admin – Media Vault",
  description: "✦ Agency media library — S3 uploads and chat distribution",
};

export default function AdminMediaVaultPage() {
  return <AdminMediaVaultClient />;
}
