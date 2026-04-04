"use client";

import { useState, useTransition, useRef } from "react";
import { X, UserPlus, ImagePlus } from "lucide-react";
import { createModel } from "@/actions/createModel";
import { ImageCropUploader } from "@/components/ImageCropUploader";

async function uploadCreatorImage(
  file: File,
  creatorId: string,
  context: "avatar" | "banner"
): Promise<string> {
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
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!putRes.ok) throw new Error("Upload to storage failed");
  return publicUrl;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onToast: (message: string, tone: "success" | "error") => void;
};

export function CreateModelModal({ open, onClose, onSuccess, onToast }: Props) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [verified, setVerified] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  if (!open) return null;

  const reset = () => {
    setUsername("");
    setDisplayName("");
    setAge("");
    setLocation("");
    setBio("");
    setProfession("");
    setHeight("");
    setWeight("");
    setVerified(false);
    setAvatarFile(null);
    setBannerFile(null);
    setFormError(null);
    if (avatarRef.current) avatarRef.current.value = "";
    if (bannerRef.current) bannerRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const ageNum = age.trim() === "" ? null : parseInt(age, 10);
    if (age.trim() !== "" && (Number.isNaN(ageNum) || ageNum! < 18 || ageNum! > 120)) {
      setFormError("Enter a valid age (18–120) or leave blank.");
      return;
    }

    startTransition(async () => {
      const result = await createModel({
        username,
        displayName,
        age: ageNum,
        location,
        bio,
        profession,
        height,
        weight,
        verified,
      });

      if (!result.ok || !result.id) {
        setFormError(result.error ?? "Could not create.");
        return;
      }

      const id = result.id;

      try {
        if (avatarFile) {
          if (!avatarFile.type.startsWith("image/")) throw new Error("Avatar must be an image.");
          const url = await uploadCreatorImage(avatarFile, id, "avatar");
          const patch = await fetch(`/api/admin/creators/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatarUrl: url }),
          });
          if (!patch.ok) throw new Error("Saved profile but avatar URL failed to attach.");
        }
        if (bannerFile) {
          if (!bannerFile.type.startsWith("image/")) throw new Error("Banner must be an image.");
          const url = await uploadCreatorImage(bannerFile, id, "banner");
          const patch = await fetch(`/api/admin/creators/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bannerUrl: url }),
          });
          if (!patch.ok) throw new Error("Saved profile but banner URL failed to attach.");
        }
      } catch (err) {
        onToast(err instanceof Error ? err.message : "Upload issue after create", "error");
        onSuccess();
        handleClose();
        return;
      }

      onToast("Creator created ✦", "success");
      onSuccess();
      handleClose();
    });
  };

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[#07070b]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#d4a853]/50 focus:ring-1 focus:ring-[#ff2d78]/30";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-model-title"
    >
      <div
        className="relative max-h-[min(92vh,860px)] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#d4a853]/25 bg-[#0a0a10]/96 shadow-[0_0_60px_-12px_rgba(255,45,120,0.4),0_0_40px_-16px_rgba(212,168,83,0.2)]"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="focus-outline absolute right-4 top-4 rounded-full p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-white/[0.06] px-6 pb-4 pt-6">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#f0c97a]/80">Rsdate</p>
          <h2 id="create-model-title" className="mt-1 flex items-center gap-2 font-[var(--font-heading)] text-xl font-bold text-white sm:text-2xl">
            <UserPlus className="h-6 w-6 text-[#d4a853]" aria-hidden />
            Create New Model ✦
          </h2>
          <p className="mt-2 text-sm text-white/50">Add a creator profile. Images upload after the record is created.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          {formError && (
            <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {formError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">
                Username <span className="text-[#ff2d78]">*</span>
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                required
                placeholder="evelyn-rose"
                className={fieldClass}
                autoComplete="off"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">
                Display name <span className="text-[#ff2d78]">*</span>
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Chloe"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Age</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                inputMode="numeric"
                placeholder="26"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Chicago, IL"
                className={fieldClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Bio / description</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Short bio for the public profile…"
                className={`${fieldClass} resize-y min-h-[88px]`}
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Profession</label>
              <input value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="Model" className={fieldClass} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Height</label>
              <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder={`5'6\"`} className={fieldClass} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Weight</label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="125 lbs" className={fieldClass} />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#07070b]/50 px-4 py-3">
            <input
              id="verified-toggle"
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-[#07070b] text-[#d4a853] focus:ring-[#ff2d78]/40"
            />
            <label htmlFor="verified-toggle" className="text-sm text-white/80">
              Show <span className="text-[#f0c97a]">verified</span> badge on profile ✦
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Avatar image</label>
              <ImageCropUploader
                outputSize={400}
                onUploadComplete={(blob) => {
                  const file = new File([blob], "avatar.png", { type: "image/png" });
                  setAvatarFile(file);
                }}
              >
                <button
                  type="button"
                  className="focus-outline mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d4a853]/35 bg-[#07070b]/60 px-3 py-3 text-sm text-[#f0c97a]/90 transition-colors hover:border-[#d4a853]/55 hover:bg-[#d4a853]/5 pointer-events-none"
                >
                  <ImagePlus className="h-4 w-4" aria-hidden />
                  {avatarFile ? "Cropped Photo Added ✦" : "Choose portrait…"}
                </button>
              </ImageCropUploader>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Banner (optional)</label>
              <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} />
              <button
                type="button"
                onClick={() => bannerRef.current?.click()}
                className="focus-outline mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#07070b]/60 px-3 py-3 text-sm text-white/60 transition-colors hover:border-[#ff2d78]/35 hover:text-white/80"
              >
                <ImagePlus className="h-4 w-4" aria-hidden />
                {bannerFile ? bannerFile.name.slice(0, 28) : "Choose banner…"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-gradient-to-r from-[#ff2d78] to-[#d4a853] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(255,45,120,0.35)] transition-[filter,opacity] hover:brightness-110 disabled:opacity-50"
            >
              {pending ? "Creating…" : "Create model ✦"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
