import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import Image from "next/image";
import { Pencil, ArrowLeft, Image as ImageIcon } from "lucide-react";

export const metadata = {
  title: "Model Details | Admin",
};

export default async function AdminModelDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const creator = await prisma.creator.findUnique({
    where: { id },
    include: {
      _count: { select: { posts: true, conversations: true } },
    },
  });

  if (!creator) notFound();

  return (
    <div className="page-content mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/models"
        className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors focus-outline rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Models
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-white flex items-center gap-3">
            {creator.displayName}
            {creator.verified && (
              <span className="text-[#f0c97a] text-lg" title="Verified">✦</span>
            )}
          </h1>
          <p className="mt-1 text-white/50 text-sm">@{creator.username}</p>
        </div>
        <Link
          href={`/admin/models/${creator.id}/edit`}
          className="focus-outline inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d4a853] to-[#f0c97a] px-6 py-2.5 text-sm font-semibold text-[#1a1208] shadow-[0_8px_32px_rgba(212,168,83,0.35)] transition-[transform,filter] hover:brightness-105 hover:shadow-[0_12px_40px_rgba(212,168,83,0.45)] active:scale-[0.99]"
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Edit Model Overview
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-[#0c0c12] p-6 shadow-xl relative overflow-hidden group">
          <div className="aspect-[4/5] relative w-full rounded-2xl overflow-hidden bg-black/40 ring-1 ring-white/10">
            {creator.avatarUrl ? (
              <Image
                src={creator.avatarUrl}
                alt={creator.displayName}
                fill
                className="object-cover"
                unoptimized={!creator.avatarUrl.startsWith("/")}
              />
            ) : (
              <div className="flex w-full h-full items-center justify-center text-white/20">
                <ImageIcon className="h-10 w-10 opacity-30" />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="rounded-[28px] border border-white/10 bg-[#0c0c12] p-6 shadow-xl">
            <h2 className="text-sm font-medium uppercase tracking-wider text-[#d4a853] mb-4">
              Profile Info
            </h2>
            <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-white/40 mb-1">Age</dt>
                <dd className="text-white font-medium">{creator.age ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-white/40 mb-1">Location</dt>
                <dd className="text-white font-medium">{creator.location ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-white/40 mb-1">Profession</dt>
                <dd className="text-white font-medium">{creator.profession ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-white/40 mb-1">Height</dt>
                <dd className="text-white font-medium">{creator.height ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-white/40 mb-1">Weight</dt>
                <dd className="text-white font-medium">{creator.weight ?? "—"}</dd>
              </div>
            </dl>

            <h3 className="text-white/40 text-sm mt-6 mb-2">Bio</h3>
            <p className="text-white leading-relaxed text-sm whitespace-pre-wrap">
              {creator.bio || <span className="text-white/30 italic">No bio provided.</span>}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0c0c12] p-6 shadow-xl">
            <h2 className="text-sm font-medium uppercase tracking-wider text-[#ff2d78] mb-4">
              Platform Stats
            </h2>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-black/20 rounded-2xl p-4 ring-1 ring-white/5">
              <div>
                <dt className="text-white/40 text-xs uppercase tracking-wide">Followers</dt>
                <dd className="text-white font-mono text-xl mt-1">{creator.followerCount}</dd>
              </div>
              <div>
                <dt className="text-white/40 text-xs uppercase tracking-wide">Subscribers</dt>
                <dd className="text-white font-mono text-xl mt-1">{creator.subscriberCount}</dd>
              </div>
              <div>
                <dt className="text-white/40 text-xs uppercase tracking-wide">Posts</dt>
                <dd className="text-white font-mono text-xl mt-1">{creator._count.posts}</dd>
              </div>
              <div>
                <dt className="text-white/40 text-xs uppercase tracking-wide">Chats</dt>
                <dd className="text-white font-mono text-xl mt-1">{creator._count.conversations}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
