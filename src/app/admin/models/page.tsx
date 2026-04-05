import { prisma } from "@/shared/lib/prisma";
import { AdminModelsPageClient } from "@/features/admin/components/AdminModelsPageClient";

export const metadata = {
  title: "Admin – Models ✦ Rsdate",
  description: "Create and manage creator profiles",
};

type PageProps = {
  searchParams: Promise<{ new?: string }>;
};

export default async function AdminModelsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const defaultOpenCreate = sp.new === "1" || sp.new === "true";

  const creators = await prisma.creator.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { conversations: true } },
    },
  });

  const initialModels = creators.map((c: any) => ({
    id: c.id,
    username: c.username,
    displayName: c.displayName,
    age: c.age,
    avatarUrl: c.avatarUrl,
    bannerUrl: c.bannerUrl,
    bio: c.bio,
    location: c.location,
    profession: c.profession,
    verified: c.verified,
    conversationCount: c._count.conversations,
  }));

  return (
    <div className="page-content mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <AdminModelsPageClient initialModels={initialModels} defaultOpenCreate={defaultOpenCreate} />
    </div>
  );
}
