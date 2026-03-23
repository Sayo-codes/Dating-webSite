"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CreatorRow = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  conversationCount: number;
};

type VaultItem = { id: string; url: string; type: string; createdAt?: string };

type ConvRow = {
  id: string;
  userId: string;
  user: { id: string; username: string; email: string };
};

export function AdminMediaVaultClient() {
  const [creators, setCreators] = useState<CreatorRow[]>([]);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [media, setMedia] = useState<VaultItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingVault, setLoadingVault] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMedia, setPickerMedia] = useState<VaultItem | null>(null);
  const [conversations, setConversations] = useState<ConvRow[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [ppv, setPpv] = useState(false);
  const [ppvPrice, setPpvPrice] = useState("10.00");

  const selected = creators.find((c) => c.id === creatorId);

  useEffect(() => {
    (async () => {
      setLoadingList(true);
      try {
        const res = await fetch("/api/admin/creators");
        if (!res.ok) throw new Error("Failed to load creators");
        const data = (await res.json()) as { creators: CreatorRow[] };
        setCreators(data.creators ?? []);
        if (data.creators?.[0]) setCreatorId(data.creators[0].id);
      } catch {
        setError("Could not load creators.");
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  const refreshVault = useCallback(async (id: string) => {
    setLoadingVault(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/creators/${id}/gallery`);
      if (!res.ok) throw new Error("Vault load failed");
      const data = (await res.json()) as { media: VaultItem[] };
      setMedia(data.media ?? []);
    } catch {
      setError("Could not load media vault.");
      setMedia([]);
    } finally {
      setLoadingVault(false);
    }
  }, []);

  useEffect(() => {
    if (!creatorId) {
      setMedia([]);
      return;
    }
    refreshVault(creatorId);
  }, [creatorId, refreshVault]);

  async function uploadFile(file: File) {
    if (!creatorId) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      setError("Only images and videos are allowed.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const presign = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          context: "gallery",
          creatorId,
          size: file.size,
        }),
      });
      if (!presign.ok) {
        const j = await presign.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "Presign failed");
      }
      const { uploadUrl, publicUrl } = (await presign.json()) as {
        uploadUrl: string;
        publicUrl: string;
      };
      const put = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!put.ok) throw new Error("Upload to storage failed");

      const type = isVideo ? "VIDEO" : "IMAGE";
      const reg = await fetch(`/api/admin/creators/${creatorId}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl, type }),
      });
      if (!reg.ok) throw new Error("Failed to register media");
      await refreshVault(creatorId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function openPicker(item: VaultItem) {
    if (!creatorId) return;
    setPickerMedia(item);
    setPpv(false);
    setPpvPrice("10.00");
    setPickerOpen(true);
    setLoadingConvs(true);
    try {
      const res = await fetch(`/api/admin/conversations?creatorId=${creatorId}`);
      if (res.ok) {
        const data = (await res.json()) as { conversations: ConvRow[] };
        setConversations(data.conversations ?? []);
      } else {
        setConversations([]);
      }
    } finally {
      setLoadingConvs(false);
    }
  }

  async function sendToConversation(conversationId: string) {
    if (!pickerMedia) return;
    setSendingId(conversationId);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        body: `✦ From the vault`,
        mediaUrl: pickerMedia.url,
        mediaType: pickerMedia.type,
      };
      if (ppv) {
        payload.isPPV = true;
        const def = pickerMedia.type === "VIDEO" ? "25.00" : "10.00";
        payload.ppvPriceCents = Math.round(parseFloat(ppvPrice || def) * 100);
      }
      const res = await fetch(`/api/admin/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "Send failed");
      }
      setPickerOpen(false);
      setPickerMedia(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send message");
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07070b] p-4 sm:p-8">
      <header className="mb-8 max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d4a853]/80">
          ✦ Agency
        </p>
        <h1 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-white sm:text-3xl">
          Media vault
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/50">
          Upload to S3, manage each creator&apos;s gallery, and push assets straight into fan chats (optional PPV).
        </p>
      </header>

      {error && (
        <div
          className="mb-6 max-w-6xl rounded-xl border border-[#ff2d78]/30 bg-[#ff2d78]/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="mb-6 flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-white/40">Creator</label>
          <select
            value={creatorId ?? ""}
            onChange={(e) => setCreatorId(e.target.value || null)}
            disabled={loadingList}
            className="min-h-[48px] max-w-md rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:border-[#d4a853]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a853]/20"
          >
            {creators.length === 0 && <option value="">No creators</option>}
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.displayName} (@{c.username})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#d4a853]/30 bg-[#d4a853]/10 px-5 py-2.5 text-sm font-medium text-[#f0c97a] transition hover:bg-[#d4a853]/20">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={!creatorId || uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void uploadFile(f);
              }}
            />
            {uploading ? "Uploading…" : "✦ Upload to vault"}
          </label>
          <Link
            href="/admin/messages"
            className="inline-flex min-h-[48px] items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/70 transition hover:border-[#ff2d78]/40 hover:text-white"
          >
            Open messages hub
          </Link>
        </div>
      </div>

      <div className="max-w-6xl rounded-2xl border border-white/[0.08] bg-[rgba(14,12,20,0.6)] p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            ✦ {selected ? `${selected.displayName}'s vault` : "Vault"}
          </h2>
          {loadingVault && <span className="text-xs text-white/40">Refreshing…</span>}
        </div>

        {!creatorId ? (
          <p className="py-12 text-center text-sm text-white/40">Select a creator.</p>
        ) : loadingVault && media.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/40">Loading vault…</p>
        ) : media.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/40">
            No media yet. Upload images or videos to populate the vault.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {media.map((m) => (
              <li
                key={m.id}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition hover:border-[#d4a853]/40"
              >
                <div className="relative aspect-square">
                  {m.type === "IMAGE" ? (
                    <Image
                      src={m.url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized={!m.url.startsWith("/")}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black/40 text-white/50">
                      <span className="text-3xl">🎬</span>
                      <span className="text-xs">Video</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/90 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openPicker(m)}
                      className="flex-1 rounded-lg bg-[#ff2d78] py-2 text-center text-xs font-semibold text-white shadow-[0_0_12px_rgba(255,45,120,0.4)]"
                    >
                      Send to chat
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pickerOpen && pickerMedia && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="dialog"
          aria-modal
          aria-labelledby="vault-picker-title"
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl border border-[#d4a853]/20 bg-[#0e0c14] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 id="vault-picker-title" className="font-[var(--font-heading)] text-lg text-[#f0c97a]">
                ✦ Send to chat
              </h3>
              <p className="mt-1 text-xs text-white/45">Choose a fan conversation for {selected?.displayName}.</p>
            </div>
            <div className="border-b border-white/10 px-5 py-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={ppv} onChange={(e) => setPpv(e.target.checked)} />
                PPV message
              </label>
              {ppv && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-white/50">$</span>
                  <input
                    type="number"
                    min="0.5"
                    step="0.01"
                    value={ppvPrice}
                    onChange={(e) => setPpvPrice(e.target.value)}
                    className="w-28 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white"
                  />
                </div>
              )}
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {loadingConvs ? (
                <p className="p-4 text-center text-sm text-white/40">Loading conversations…</p>
              ) : conversations.length === 0 ? (
                <p className="p-4 text-center text-sm text-white/40">No conversations for this creator yet.</p>
              ) : (
                <ul className="space-y-1">
                  {conversations.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        disabled={!!sendingId}
                        onClick={() => sendToConversation(c.id)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition hover:bg-white/8 disabled:opacity-50"
                      >
                        <span className="font-medium text-white">{c.user.username}</span>
                        <span className="text-xs text-white/40">
                          {sendingId === c.id ? "Sending…" : "Send ✦"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-white/10 p-4">
              <button
                type="button"
                onClick={() => {
                  setPickerOpen(false);
                  setPickerMedia(null);
                }}
                className="rounded-full px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
