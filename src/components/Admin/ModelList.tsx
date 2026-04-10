"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ExternalLink, Pencil, Send, Trash2, Layout } from "lucide-react";
import { ManagePostsModal } from "@/features/admin/components/ManagePostsModal";
import { deleteModel } from "@/actions/deleteModel";

export type AdminModelRow = {
  id: string;
  username: string;
  displayName: string;
  age: number | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  location: string | null;
  profession: string | null;
  verified: boolean;
  conversationCount: number;
};

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle fill='%23222' cx='40' cy='40' r='40'/%3E%3C/svg%3E";

type Props = {
  models: AdminModelRow[];
  onChanged: () => void;
  onToast: (message: string, tone: "success" | "error") => void;
  onPostToFeed?: (creatorId: string) => void;
};

export function ModelList({ models, onChanged, onToast, onPostToFeed }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [manageTarget, setManageTarget] = useState<AdminModelRow | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runDelete = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      const res = await deleteModel(id);
      setPendingId(null);
      setConfirmId(null);
      if (res.ok) {
        onToast("Creator removed ✦", "success");
        onChanged();
      } else {
        onToast(res.error ?? "Delete failed", "error");
      }
    });
  };

  const isBusy = (id: string) => pendingId === id && isPending;

  return (
    <>
      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {models.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-4 shadow-[0_0_24px_-8px_rgba(212,168,83,0.12)]"
          >
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-[#d4a853]/25">
                <Image
                  src={m.avatarUrl ?? placeholder}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={!!m.avatarUrl && !m.avatarUrl.startsWith("/")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-heading)] font-semibold text-white">{m.displayName}</p>
                <p className="text-xs text-[#f0c97a]/80">@{m.username}</p>
                {m.age != null && <p className="mt-1 text-xs text-white/50">Age {m.age}</p>}
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.verified && (
                    <span className="rounded-full bg-[#d4a853]/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[#f0c97a]">
                      Verified
                    </span>
                  )}
                  <span className="text-xs text-white/45">{m.conversationCount} chats</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
              <button
                type="button"
                disabled
                title="Editor coming soon — use Media vault for gallery"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-white/35"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Edit
              </button>
              {onPostToFeed && (
                <button
                  type="button"
                  onClick={() => onPostToFeed(m.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#ff2d78]/40 bg-[#ff2d78]/10 px-3 py-2 text-xs font-medium text-[#ff6fa3] transition-colors hover:border-[#ff2d78]/60 hover:bg-[#ff2d78]/20"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden />
                  Post to Feed
                </button>
              )}
                  <button
                    type="button"
                    onClick={() => setManageTarget(m)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Layout className="h-3.5 w-3.5" aria-hidden />
                    Manage Feed
                  </button>
                  <Link
                    href={`/admin/models/${m.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Edit
              </Link>
              <Link
                href={`/creators/${m.username}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d4a853]/30 px-3 py-2 text-xs text-[#f0c97a] transition-colors hover:bg-[#d4a853]/10"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                View
              </Link>
              <button
                type="button"
                onClick={() => setConfirmId(m.id)}
                disabled={isBusy(m.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition-colors hover:border-red-400/50 hover:bg-red-500/20 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                {isBusy(m.id) ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0c12] shadow-[0_0_40px_-12px_rgba(255,45,120,0.15)] md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.03]">
              <th className="p-4 font-medium text-[#f0c97a]/90">Model ✦</th>
              <th className="p-4 font-medium text-[#f0c97a]/90">Username</th>
              <th className="p-4 font-medium text-[#f0c97a]/90">Age</th>
              <th className="p-4 font-medium text-[#f0c97a]/90">Location</th>
              <th className="p-4 font-medium text-[#f0c97a]/90">Verified</th>
              <th className="p-4 font-medium text-[#f0c97a]/90">Chats</th>
              <th className="p-4 font-medium text-[#f0c97a]/90">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id} className="border-b border-white/[0.05] transition-colors hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-[#d4a853]/20">
                      <Image
                        src={m.avatarUrl ?? placeholder}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized={!!m.avatarUrl && !m.avatarUrl.startsWith("/")}
                      />
                    </div>
                    <span className="font-medium text-white">{m.displayName}</span>
                  </div>
                </td>
                <td className="p-4 text-white/65">@{m.username}</td>
                <td className="p-4 text-white/55">{m.age ?? "—"}</td>
                <td className="max-w-[140px] truncate p-4 text-white/55">{m.location ?? "—"}</td>
                <td className="p-4">
                  {m.verified ? (
                    <span className="rounded-full bg-[#d4a853]/15 px-2 py-0.5 text-[0.65rem] font-semibold text-[#f0c97a]">
                      Yes
                    </span>
                  ) : (
                    <span className="text-white/35">—</span>
                  )}
                </td>
                <td className="p-4 text-white/55">{m.conversationCount}</td>
                <td className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/models/${m.id}/edit`}
                      className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                      aria-label="Edit model"
                      title="Edit model"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </Link>
                    {onPostToFeed && (
                      <button
                        type="button"
                        onClick={() => onPostToFeed(m.id)}
                        className="rounded-lg p-2 text-[#ff6fa3]/80 transition-colors hover:bg-[#ff2d78]/10 hover:text-[#ff6fa3]"
                        aria-label="Post to feed"
                        title="Post to feed"
                      >
                        <Send className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setManageTarget(m)}
                      className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                      aria-label="Manage feed"
                      title="Manage feed"
                    >
                      <Layout className="h-4 w-4" aria-hidden />
                    </button>
                    <Link
                      href={`/creators/${m.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg p-2 text-[#f0c97a]/80 transition-colors hover:bg-white/5 hover:text-[#f0c97a]"
                      aria-label="View public profile"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmId(m.id)}
                      disabled={isBusy(m.id)}
                      className="rounded-lg p-2 text-red-400/90 transition-colors hover:bg-red-500/15 hover:text-red-300 disabled:opacity-50"
                      aria-label="Delete creator"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-model-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e14] p-6 shadow-[0_0_48px_-8px_rgba(255,45,120,0.35)]">
            <h2 id="delete-model-title" className="font-[var(--font-heading)] text-lg font-semibold text-white">
              Remove this creator? ✦
            </h2>
            <p className="mt-2 text-sm text-white/55">
              This deletes their profile, gallery records, and related data per your database rules. This cannot be
              undone.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => runDelete(confirmId)}
                disabled={!confirmId || isBusy(confirmId)}
                className="rounded-full bg-gradient-to-r from-[#ff2d78] to-[#b91c1c] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,45,120,0.35)] transition-opacity hover:opacity-95 disabled:opacity-50"
              >
                {confirmId && isBusy(confirmId) ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
      {manageTarget && (
        <ManagePostsModal
          isOpen={true}
          creatorId={manageTarget.id}
          creatorUsername={manageTarget.username}
          creatorName={manageTarget.displayName}
          onClose={() => setManageTarget(null)}
          onToast={onToast}
        />
      )}
    </>
  );
}
