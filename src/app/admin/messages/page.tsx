import { AdminMessagingHub } from "@/features/admin/components/AdminMessagingHub";

export const metadata = {
  title: "Admin – Messages",
  description: "Centralized messaging panel – manage all creator conversations",
};

export default function AdminMessagesPage() {
  return <AdminMessagingHub />;
}
