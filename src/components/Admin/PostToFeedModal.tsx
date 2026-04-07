"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, ImagePlus, Video, Lock, Globe, Send } from "lucide-react";
import Image from "next/image";

type Creator = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onToast: (message: string, tone: "success" | "error") => void;
  creators: Creator[];
  preselectedCreatorId?: string;
};

async function uploadMediaFile(
  file: File,
  creatorId: string,
): Promise<string> {
  const res = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      context: "posts",
      creatorId,
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
  if (!putRes.ok) throw new Error("Upload to storage failed");
  return publicUrl;
}

export function PostToFeedModal({
  open,
  onClose,
  onSuccess,
  onToast,
  creators,
  preselectedCreatorId,
}: Props) {
  const [selectedCreatorId, setSelectedCreatorId] = useState(
    preselectedCreatorId ?? creators[0]?.id ?? "",
  );
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [caption, setCaption] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [priceCents, setPriceCents] = useState(999);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setMediaFile(null);
    setPreviewUrl(null);
    setCaption("");
    setIsLocked(false);
    setPriceCents(999);
    setUploadProgress(0);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) {
        onToast("Only images and videos are supported.", "error");
        return;
      }
      setMediaFile(file);
      setMediaType(isVideo ? "VIDEO" : "IMAGE");
      setPreviewUrl(URL.createObjectURL(file));
    },
    [onToast],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    },
    [handleFileChange],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId) {
      onToast("Select a creator first.", "error");
      return;
    }
    if (!mediaFile) {
      onToast("Please select a photo or video.", "error");
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    try {
      const mediaUrl = await uploadMediaFile(mediaFile, selectedCreatorId);
      setUploadProgress(70);

      const creator = creators.find((c) => c.id === selectedCreatorId);
      if (!creator) throw new Error("Creator not found");

      const res = await fetch(`/api/creators/${creator.username}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl,
          mediaType,
          caption: caption.trim() || null,
          isLocked,
          unlockPriceCents: isLocked ? priceCents : 0,
        }),
      });

      setUploadProgress(95);

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Post creation failed");
      }

      setUploadProgress(100);
      onToast(`Posted to @${creator.username}'s feed ✦`, "success");
      onSuccess();
      handleClose();
    } catch (err) {
      onToast(
        err instanceof Error ? err.message : "Something went wrong",
        "error",
      );
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  const selectedCreator = creators.find((c) => c.id === selectedCreatorId);
  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[#07070b]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#d4a853]/50 focus:ring-1 focus:ring-[#ff2d78]/30";

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-feed-title"
    >
      <div className="relative max-h-[min(94vh,860px)] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#d4a853]/25 bg-[#0a0a10]/97 shadow-[0_0_80px_-12px_rgba(255,45,120,0.5),0_0_40px_-16px_rgba(212,168,83,0.25)]">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-6 pb-4 pt-6">
          <button
            type="button"
            onClick={handleClose}
            className="focus-outline absolute right-4 top-4 rounded-full p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#f0c97a]/80">
            Admin ✦ Post Manager
          </p>
          <h2
            id="post-feed-title"
            className="mt-1 flex items-center gap-2 font-[var(--font-heading)] text-xl font-bold text-white sm:text-2xl"
          >
            <Send className="h-6 w-6 text-[#ff2d78]" aria-hidden />
            Post to Feed ✦
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Post a photo or video directly to any creator's public profile feed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {/* Creator selector */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">
              Post as Creator <span className="text-[#ff2d78]">*</span>
            </label>
            <div className="mt-2 grid gap-2 max-h-[180px] overflow-y-auto pr-1">
              {creators.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCreatorId(c.id)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                    selectedCreatorId === c.id
                      ? "border-[#d4a853]/60 bg-[#d4a853]/10"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                    {c.avatarUrl ? (
                      <Image
                        src={c.avatarUrl}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized={!c.avatarUrl.startsWith("/")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1a1020] text-xs text-white/40">
                        {c.displayName[0]}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {c.displayName}
                    </p>
                    <p className="text-xs text-white/45">@{c.username}</p>
                  </div>
                  {selectedCreatorId === c.id && (
                    <span className="ml-auto text-[#d4a853] text-xs font-semibold">
                      ✦
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Media upload dropzone */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">
              Photo or Video <span className="text-[#ff2d78]">*</span>
            </label>
            {previewUrl ? (
              <div className="relative mt-1.5 overflow-hidden rounded-2xl border border-[#d4a853]/30 bg-black aspect-square max-h-[260px]">
                {mediaType === "VIDEO" ? (
                  <video
                    src={previewUrl}
                    className="h-full w-full object-contain"
                    controls
                  />
                ) : (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaFile(null);
                    setPreviewUrl(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white/80 hover:bg-black/90"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1">
                  {mediaType === "VIDEO" ? (
                    <Video className="h-3.5 w-3.5 text-[#ff2d78]" />
                  ) : (
                    <ImagePlus className="h-3.5 w-3.5 text-[#d4a853]" />
                  )}
                  <span className="text-xs text-white/70">{mediaType}</span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="mt-1.5 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d4a853]/30 bg-[#07070b]/60 py-10 text-center transition-colors hover:border-[#d4a853]/55 hover:bg-[#d4a853]/5"
              >
                <Upload className="h-8 w-8 text-[#d4a853]/60" />
                <div>
                  <p className="text-sm text-white/70">
                    Drop photo or video here
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    JPG, PNG, GIF, MP4, MOV · up to 100MB
                  </p>
                </div>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Write something tempting…"
              className={`${fieldClass} resize-y min-h-[80px]`}
            />
            <p className="mt-1 text-right text-xs text-white/30">
              {caption.length}/500
            </p>
          </div>

          {/* PPV / Public toggle */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#07070b]/50 px-4 py-3">
              <button
                type="button"
                role="switch"
                aria-checked={isLocked}
                onClick={() => setIsLocked((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 transition-colors ${
                  isLocked
                    ? "border-[#ff2d78] bg-[#ff2d78]"
                    : "border-white/20 bg-white/10"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    isLocked ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                {isLocked ? (
                  <Lock className="h-4 w-4 text-[#ff2d78]" />
                ) : (
                  <Globe className="h-4 w-4 text-[#3dff9a]" />
                )}
                <span className="text-sm text-white/80">
                  {isLocked ? (
                    <>
                      <span className="text-[#ff2d78] font-semibold">
                        Pay-Per-View
                      </span>{" "}
                      — locked behind a paywall
                    </>
                  ) : (
                    <>
                      <span className="text-[#3dff9a] font-semibold">
                        Public
                      </span>{" "}
                      — visible to all users free
                    </>
                  )}
                </span>
              </div>
            </div>

            {isLocked && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">
                  Unlock Price (USD)
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/40">
                    $
                  </span>
                  <input
                    type="number"
                    min={0.5}
                    max={999}
                    step={0.5}
                    value={(priceCents / 100).toFixed(2)}
                    onChange={(e) =>
                      setPriceCents(Math.round(parseFloat(e.target.value) * 100))
                    }
                    className={`${fieldClass} pl-7`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upload progress bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d4a853] to-[#ff2d78] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !mediaFile || !selectedCreatorId}
              className="flex-1 rounded-full bg-gradient-to-r from-[#ff2d78] to-[#d4a853] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(255,45,120,0.35)] transition-[filter,opacity] hover:brightness-110 disabled:opacity-40"
            >
              {uploading
                ? "Posting…"
                : `Post to @${selectedCreator?.username ?? "..."} ✦`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
