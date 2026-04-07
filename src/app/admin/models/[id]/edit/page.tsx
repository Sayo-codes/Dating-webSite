import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { EditModelForm } from "@/components/Admin/EditModelForm";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Edit Model | Admin",
};

export default async function AdminModelEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const creator = await prisma.creator.findUnique({
    where: { id },
  });

  if (!creator) notFound();

  return (
    <div className="page-content mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={`/admin/models/${creator.id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors focus-outline rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Model Details
      </Link>

      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold tracking-tight text-white mb-2">
          Edit Model: {creator.displayName}
        </h1>
        <p className="text-sm text-white/50">
          Update profile settings, upload a new avatar, or change platform status.
        </p>
      </div>

      <EditModelForm creator={creator} />
    </div>
  );
}
