"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/shared/ui/GlassCard";

type CreatorProfile = {
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
  gallery: { id: string; url: string; type: string }[];
};

const avatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ccircle fill='%23333' cx='100' cy='100' r='100'/%3E%3C/svg%3E";

async function uploadFile(
  file: File,
  context: "avatar" | "gallery"
): Promise<string> {
  const res = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      context,
      size: file.size,
    }),
  });
  if (!res.ok) {
    const err = (await res.json()) as { error?: string };
    throw new Error(err.error ?? "Upload failed");
  }
  const { uploadUrl, publicUrl } = (await res.json()) as {
    uploadUrl: string;
    publicUrl: string;
  };
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!putRes.ok) throw new Error("Upload failed");
  return publicUrl;
}

export function CreatorDashboardClient() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<{ url: string; type: "IMAGE" | "VIDEO" } | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const galleryCameraRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    const res = await fetch("/api/creator/profile");
    if (!res.ok) return;
    const data = (await res.json()) as { creator: CreatorProfile };
    setProfile(data.creator);
  };

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, []);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploadingAvatar(true);
    setError(null);
    try {
      const publicUrl = await uploadFile(file, "avatar");
      const res = await fetch("/api/creator/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: publicUrl }),
      });
      if (res.ok) await fetchProfile();
      else setError("Failed to update avatar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setAvatarPreview(null);
      }
      setUploadingAvatar(false);
      avatarInputRef.current && (avatarInputRef.current.value = "");
    }
  };

  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) return;
    const previewUrl = URL.createObjectURL(file);
    setGalleryPreview({ url: previewUrl, type: isVideo ? "VIDEO" : "IMAGE" });
    setUploadingGallery(true);
    setError(null);
    try {
      const publicUrl = await uploadFile(file, "gallery");
      const res = await fetch("/api/creator/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: publicUrl,
          type: isVideo ? "VIDEO" : "IMAGE",
        }),
      });
      if (res.ok) await fetchProfile();
      else setError("Failed to add to gallery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setGalleryPreview(null);
      }
      setUploadingGallery(false);
      galleryInputRef.current && (galleryInputRef.current.value = "");
      galleryCameraRef.current && (galleryCameraRef.current.value = "");
    }
  };

  const removeGalleryItem = async (id: string) => {
    const res = await fetch(`/api/creator/gallery/${id}`, { method: "DELETE" });
    if (res.ok) await fetchProfile();
  };

  if (loading) {
    return (
      <GlassCard className="p-8">
        <p className="text-white/60">Loading…</p>
      </GlassCard>
    );
  }

  if (!profile) {
    return (
      <GlassCard className="p-8">
        <p className="text-white/60">Creator profile not found.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white">
          Creator dashboard
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Manage your profile and gallery. Your public page:{" "}
          <Link
            href={`/creators/${profile.username}`}
            className="text-[var(--accent-primary)] hover:underline"
          >
            /creators/{profile.username}
          </Link>
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/20 border border-red-400/40 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <GlassCard className="p-6">
        <h2 className="section-heading mb-4">Profile photo</h2>
        <div className="flex flex-wrap items-end gap-6">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-white/10">
            <Image
              src={avatarPreview ?? profile.avatarUrl ?? avatarPlaceholder}
              alt="Avatar"
              fill
              className="object-cover"
              unoptimized={!!profile.avatarUrl && !profile.avatarUrl.startsWith("/")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="pill-button-primary focus-outline px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {uploadingAvatar ? "Uploading…" : "Upload new photo"}
            </button>
            <p className="text-xs text-white/50">JPEG, PNG, WebP or GIF. Max 15 MB.</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="section-heading mb-4">Gallery</h2>
        <p className="mb-4 text-sm text-white/60">
          Add images or videos to your profile. They appear on your public page.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleGallerySelect}
          />
          <input
            ref={galleryCameraRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            className="hidden"
            onChange={handleGallerySelect}
          />
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploadingGallery}
            className="pill-button-primary focus-outline px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {uploadingGallery ? "Uploading…" : "Choose from device"}
          </button>
          <button
            type="button"
            onClick={() => galleryCameraRef.current?.click()}
            disabled={uploadingGallery}
            className="focus-outline rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50"
          >
            Take photo / video
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {galleryPreview && (
            <div className="group relative aspect-square overflow-hidden rounded-xl bg-white/5">
              {galleryPreview.type === "IMAGE" ? (
                <Image
                  src={galleryPreview.url}
                  alt="Uploading preview"
                  fill
                  className="object-cover opacity-75"
                  unoptimized
                />
              ) : (
                <video
                  src={galleryPreview.url}
                  className="h-full w-full object-cover opacity-75"
                  autoPlay
                  muted
                  loop
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-xs font-medium text-white">Uploading…</p>
              </div>
            </div>
          )}
          {profile.gallery.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-white/5"
            >
              {item.type === "IMAGE" ? (
                <Image
                  src={item.url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={!item.url.startsWith("/")}
                />
              ) : (
                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
              <button
                type="button"
                onClick={() => removeGalleryItem(item.id)}
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
