"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageCropUploader } from "@/components/ImageCropUploader";

type Creator = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  profession: string | null;
  height: string | null;
  weight: string | null;
  verified: boolean;
  createdAt: string;
  conversationCount: number;
  gallery: { id: string; url: string; type: string }[];
};

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle fill='%23333' cx='40' cy='40' r='40'/%3E%3C/svg%3E";

async function uploadForCreator(file: File, creatorId: string, context: "avatar" | "gallery"): Promise<string> {
  const res = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      context,
      creatorId,
      size: file.size,
    }),
  });
  if (!res.ok) {
    const err = (await res.json()) as { error?: string };
    throw new Error(err.error ?? "Upload failed");
  }
  const { uploadUrl, publicUrl } = (await res.json()) as { uploadUrl: string; publicUrl: string };
  const putRes = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  if (!putRes.ok) throw new Error("Upload failed");
  return publicUrl;
}

export function AdminCreatorsClient() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Creator | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [galleryTargetId, setGalleryTargetId] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const fetchCreators = async () => {
    const res = await fetch("/api/admin/creators");
    if (!res.ok) return;
    const data = (await res.json()) as { creators: Creator[] };
    setCreators(data.creators ?? []);
  };

  useEffect(() => {
    fetchCreators().finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value.trim().toLowerCase();
    const displayName = (form.elements.namedItem("displayName") as HTMLInputElement).value.trim();
    if (!username || !displayName) return;
    setError(null);
    const res = await fetch("/api/admin/creators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, displayName }),
    });
    if (res.ok) {
      await fetchCreators();
      setShowNew(false);
    } else {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Failed");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload: Record<string, string | boolean> = {};
    const add = (name: string, asBool?: boolean) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      if (el) payload[name] = asBool ? el.checked : el.value;
    };
    add("username"); add("displayName"); add("avatarUrl"); add("bio"); add("location"); add("profession"); add("height"); add("weight");
    const verifiedEl = form.elements.namedItem("verified") as HTMLInputElement | null;
    if (verifiedEl) payload.verified = verifiedEl.checked;
    setError(null);
    const res = await fetch(`/api/admin/creators/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchCreators();
      setEditing(null);
    } else {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Failed");
    }
  };

  const handleAvatarUpload = async (creatorId: string, file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploadingId(creatorId);
    setError(null);
    try {
      const publicUrl = await uploadForCreator(file, creatorId, "avatar");
      await fetch(`/api/admin/creators/${creatorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: publicUrl }),
      });
      await fetchCreators();
      if (editing?.id === creatorId) setEditing((e) => (e ? { ...e, avatarUrl: publicUrl } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleGalleryUpload = async (creatorId: string, file: File) => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isImage && !isVideo) return;
    setUploadingId(creatorId);
    setError(null);
    try {
      const publicUrl = await uploadForCreator(file, creatorId, "gallery");
      await fetch(`/api/admin/creators/${creatorId}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl, type: isVideo ? "VIDEO" : "IMAGE" }),
      });
      await fetchCreators();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingId(null);
      galleryInputRef.current && (galleryInputRef.current.value = "");
    }
  };

  if (loading) return <p className="text-white/60">Loading…</p>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-400/40 bg-red-500/20 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && galleryTargetId) handleGalleryUpload(galleryTargetId, f);
            setGalleryTargetId(null);
          }}
        />
        <button
          type="button"
          onClick={() => { setShowNew(true); setEditing(null); }}
          className="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-[#05060a] hover:opacity-90"
        >
          + Create creator
        </button>
      </div>

      {showNew && (
        <div className="rounded-[22px] border border-white/10 bg-[var(--bg-elevated)] p-6">
          <h2 className="section-heading mb-4">New creator</h2>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-white/60">Username</label>
              <input name="username" required className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-xs text-white/60">Display name</label>
              <input name="displayName" required className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-[#05060a]">Create</button>
              <button type="button" onClick={() => setShowNew(false)} className="rounded-full border border-white/30 px-4 py-2 text-sm text-white">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-[22px] border border-white/10 bg-[var(--bg-elevated)] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-3 font-medium text-white/80">Profile</th>
              <th className="p-3 font-medium text-white/80">Username</th>
              <th className="p-3 font-medium text-white/80">Conversations</th>
              <th className="p-3 font-medium text-white/80">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creators.map((c) => (
              <tr key={c.id} className="border-b border-white/5">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                      <Image
                        src={c.avatarUrl ?? placeholder}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized={!!c.avatarUrl && !c.avatarUrl.startsWith("/")}
                      />
                    </div>
                    <span className="font-medium text-white">{c.displayName}</span>
                  </div>
                </td>
                <td className="p-3 text-white/70">@{c.username}</td>
                <td className="p-3 text-white/70">{c.conversationCount}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => { setEditing(c); setShowNew(false); }}
                      className="text-[var(--accent-primary)] hover:underline"
                    >
                      Edit
                    </button>
                    <ImageCropUploader
                      outputSize={400}
                      onUploadComplete={(blob) => {
                        const file = new File([blob], "avatar.png", { type: "image/png" });
                        handleAvatarUpload(c.id, file);
                      }}
                    >
                      <button
                        type="button"
                        disabled={uploadingId === c.id}
                        className="text-white/70 hover:text-white disabled:opacity-50 pointer-events-none"
                      >
                        {uploadingId === c.id ? "…" : "Upload avatar"}
                      </button>
                    </ImageCropUploader>
                    <button
                      type="button"
                      onClick={() => { setGalleryTargetId(c.id); galleryInputRef.current?.click(); }}
                      disabled={uploadingId === c.id}
                      className="text-white/70 hover:text-white disabled:opacity-50"
                    >
                      Add media
                    </button>
                    <Link href={`/creators/${c.username}`} target="_blank" className="text-white/70 hover:text-white">
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="rounded-[22px] border border-white/10 bg-[var(--bg-elevated)] p-6">
          <h2 className="section-heading mb-4">Edit: {editing.displayName}</h2>
          <form onSubmit={(e) => handleUpdate(e, editing.id)} className="grid gap-4 sm:grid-cols-2">
            <div><label className="block text-xs text-white/60">Username</label><input name="username" defaultValue={editing.username} className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" /></div>
            <div><label className="block text-xs text-white/60">Display name</label><input name="displayName" defaultValue={editing.displayName} className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" /></div>
            <div className="sm:col-span-2"><label className="block text-xs text-white/60">Avatar URL</label><input name="avatarUrl" defaultValue={editing.avatarUrl ?? ""} className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" /></div>
            <div className="sm:col-span-2"><label className="block text-xs text-white/60">Bio</label><textarea name="bio" defaultValue={editing.bio ?? ""} rows={3} className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" /></div>
            <div><label className="block text-xs text-white/60">Location</label><input name="location" defaultValue={editing.location ?? ""} className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" /></div>
            <div><label className="block text-xs text-white/60">Profession</label><input name="profession" defaultValue={editing.profession ?? ""} className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" /></div>
            <div><label className="block text-xs text-white/60">Height</label><input name="height" defaultValue={editing.height ?? ""} className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" /></div>
            <div><label className="block text-xs text-white/60">Weight</label><input name="weight" defaultValue={editing.weight ?? ""} className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white" /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="verified" defaultChecked={editing.verified} id="verified" className="rounded" />
              <label htmlFor="verified" className="text-sm text-white/70">Verified</label>
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-[#05060a]">Save</button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/30 px-4 py-2 text-sm text-white">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
