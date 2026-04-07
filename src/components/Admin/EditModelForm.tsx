"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageCropUploader } from "@/components/ImageCropUploader";
import { ImagePlus, MapPin, Search, ChevronDown } from "lucide-react";
import Image from "next/image";

type CreatorData = {
  id: string;
  username: string;
  displayName: string;
  age: number | null;
  location: string | null;
  bio: string | null;
  profession: string | null;
  height: string | null;
  weight: string | null;
  verified: boolean;
  avatarUrl: string | null;
};

// Simplified US_CITIES for brevity, matching the create form
const US_CITIES = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA", "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC", "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC", "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK", "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA", "Kansas City, MO", "Mesa, AZ", "Atlanta, GA", "Omaha, NE", "Colorado Springs, CO", "Raleigh, NC", "Miami, FL", "Oakland, CA", "Minneapolis, MN", "Tampa, FL", "Honolulu, HI", "St. Louis, MO"
];

async function uploadCreatorImage(
  file: File,
  creatorId: string,
  context: "avatar" | "gallery"
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

export function EditModelForm({ creator }: { creator: CreatorData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // States
  const [username, setUsername] = useState(creator.username);
  const [displayName, setDisplayName] = useState(creator.displayName);
  const [age, setAge] = useState(creator.age?.toString() || "");
  const [bio, setBio] = useState(creator.bio || "");
  const [location, setLocation] = useState(creator.location || "");
  const [profession, setProfession] = useState(creator.profession || "");
  const [height, setHeight] = useState(creator.height || "");
  const [weight, setWeight] = useState(creator.weight || "");
  const [verified, setVerified] = useState(creator.verified);
  
  const [avatarUrl, setAvatarUrl] = useState(creator.avatarUrl);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  // Dropdown state
  const [isCityDropOpen, setIsCityDropOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const filteredCities = US_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ageNum = age.trim() === "" ? null : parseInt(age, 10);
    
    startTransition(async () => {
      try {
        let finalAvatarUrl = avatarUrl;

        // Upload new avatar if changed
        if (newAvatarFile) {
          finalAvatarUrl = await uploadCreatorImage(newAvatarFile, creator.id, "avatar");
        }

        // Patch the creator data
        const res = await fetch(`/api/admin/creators/${creator.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            displayName,
            age: ageNum,
            location,
            bio,
            profession,
            height,
            weight,
            verified,
            avatarUrl: finalAvatarUrl,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update creator profile.");
        }

        router.push(`/admin/models/${creator.id}`);
        router.refresh();
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      }
    });
  };

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[#07070b]/80 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#d4a853]/50 focus:ring-1 focus:ring-[#ff2d78]/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Picture Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-6 rounded-[24px] border border-white/10 bg-[#0c0c12] p-6 shadow-lg">
        <ImageCropUploader
          outputSize={400}
          onUploadComplete={(blob) => {
            const file = new File([blob], "avatar.png", { type: "image/png" });
            setNewAvatarFile(file);
            setAvatarPreviewUrl(URL.createObjectURL(blob));
          }}
        >
          <button type="button" className="relative group overflow-hidden w-28 h-28 shrink-0 rounded-2xl bg-black/50 ring-1 ring-white/10 hover:ring-[#d4a853]/50 transition-all focus-outline block">
            {(avatarPreviewUrl || avatarUrl) ? (
              <Image
                src={avatarPreviewUrl || avatarUrl!}
                alt="Profile photo"
                fill
                className="object-cover transition-opacity group-hover:opacity-50"
                unoptimized={true}
              />
            ) : (
               <div className="flex w-full h-full items-center justify-center bg-black/20 text-[#d4a853]">
                 <ImagePlus className="h-8 w-8 opacity-40" />
               </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <span className="text-xs font-semibold text-white tracking-widest uppercase">Change</span>
            </div>
          </button>
        </ImageCropUploader>
        <div>
          <h3 className="text-white font-medium">Profile Photo</h3>
          <p className="text-sm text-white/50 mt-1">
            Tap the image to upload a new avatar. JPG or PNG. Try to use a high-quality, recognizable portrait.
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-[#0c0c12] p-6 shadow-lg">
        <div className="grid gap-5 sm:grid-cols-2">
          
          <div className="sm:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">
              Display Name <span className="text-[#ff2d78]">*</span>
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">
              Username <span className="text-[#ff2d78]">*</span>
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Age</label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
              inputMode="numeric"
              className={fieldClass}
            />
          </div>
          
          <div className="relative">
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Location</label>
            <input
              type="text"
              readOnly
              value={location}
              onClick={() => setIsCityDropOpen(!isCityDropOpen)}
              placeholder="Select City"
              className={`${fieldClass} cursor-pointer pr-10`}
            />
            <ChevronDown className="absolute right-3.5 top-[34px] h-4 w-4 text-white/30" />

            {isCityDropOpen && (
              <div className="absolute left-0 right-0 z-[100] mt-2 max-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl backdrop-blur-xl">
                <div className="p-2 border-b border-white/5">
                  <input
                    autoFocus
                    placeholder="Search cities..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full bg-white/5 py-2 px-3 text-xs text-white outline-none"
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto px-1 py-1 custom-scrollbar">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => { setLocation(city); setIsCityDropOpen(false); setCitySearch(""); }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#d4a853]/60" /> {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Profession</label>
            <input value={profession} onChange={(e) => setProfession(e.target.value)} className={fieldClass} />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Height</label>
            <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder={`5'6"`} className={fieldClass} />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Weight</label>
            <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="125 lbs" className={fieldClass} />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Bio / About</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className={`${fieldClass} resize-y bg-[#07070b]/60`}
            />
          </div>

        </div>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#07070b]/50 px-4 py-3">
          <input
            id="verified-toggle"
            type="checkbox"
            checked={verified}
            onChange={(e) => setVerified(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-[#07070b] text-[#d4a853] focus:ring-[#ff2d78]/40"
          />
          <label htmlFor="verified-toggle" className="text-sm text-white/80 select-none cursor-pointer">
            Show <span className="text-[#f0c97a]">verified</span> badge on profile ✦
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-end pt-2 border-t border-white/10 mt-6 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-[#d4a853] to-[#f0c97a] px-8 py-3 text-sm font-semibold text-[#1a1208] shadow-[0_8px_32px_rgba(212,168,83,0.30)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
