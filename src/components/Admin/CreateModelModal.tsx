"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { X, UserPlus, ImagePlus, ChevronDown, MapPin, Search } from "lucide-react";
import { createModel } from "@/actions/createModel";
import { ImageCropUploader } from "@/components/ImageCropUploader";

const US_CITIES = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA", "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC", "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC", "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK", "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA", "Kansas City, MO", "Mesa, AZ", "Atlanta, GA", "Omaha, NE", "Colorado Springs, CO", "Raleigh, NC", "Long Beach, CA", "Virginia Beach, VA", "Miami, FL", "Oakland, CA", "Minneapolis, MN", "Tulsa, OK", "Arlington, TX", "New Orleans, LA", "Wichita, KS", "Cleveland, OH", "Tampa, FL", "Bakersfield, CA", "Aurora, CO", "Anaheim, CA", "Honolulu, HI", "Santa Ana, CA", "Riverside, CA", "Corpus Christi, TX", "Lexington, KY", "Stockton, CA", "Henderson, NV", "Saint Paul, MN", "St. Louis, MO", "Cincinnati, OH", "Pittsburgh, PA", "Greensboro, NC", "Anchorage, AK", "Plano, TX", "Lincoln, NE", "Orlando, FL", "Irvine, CA", "Newark, NJ", "Toledo, OH", "Durham, NC", "Chula Vista, CA", "Fort Wayne, IN", "Jersey City, NJ", "St. Petersburg, FL", "Laredo, TX", "Madison, WI", "Chandler, AZ", "Buffalo, NY", "Lubbock, TX", "Scottsdale, AZ", "Reno, NV", "Glendale, AZ", "Gilbert, AZ", "Winston-Salem, NC", "North Las Vegas, NV", "Norfolk, VA", "Chesapeake, VA", "Garland, TX", "Irving, TX", "Hialeah, FL", "Fremont, CA", "Boise, ID", "Richmond, VA", "Baton Rouge, LA", "Spokane, WA", "Des Moines, IA", "Tacoma, WA", "San Bernardino, CA", "Modesto, CA", "Fontana, CA", "Santa Clarita, CA", "Oxnard, CA", "Birmingham, AL", "Fayetteville, NC", "Rochester, NY", "Moreno Valley, CA", "Glendale, CA", "Yonkers, NY", "Salt Lake City, UT", "Amarillo, TX", "Augusta, GA", "Columbus, GA", "Grand Rapids, MI", "Huntington Beach, CA", "Little Rock, AR", "Montgomery, AL", "Akron, OH", "Shreveport, LA", "Mobile, AL", "Huntsville, AL", "Tallahassee, FL", "Grand Prairie, TX", "Overland Park, KS", "Knoxville, TN", "Port St. Lucie, FL", "Worcester, MA", "Brownsville, TX", "Tempe, AZ", "Providence, RI", "Cape Coral, FL", "Chattanooga, TN", "Jackson, MS", "Fort Lauderdale, FL", "Santa Rosa, CA", "Rancho Cucamonga, CA", "Oceanside, CA", "Sioux Falls, SD", "Garden Grove, CA", "Ontario, CA", "Vancouver, WA", "Elk Grove, CA", "Pembroke Pines, FL", "Salem, OR", "Eugene, OR", "Corona, CA", "Springfield, MO", "Naperville, IL", "Joliet, IL", "Paterson, NJ", "Savannah, GA", "Bridgeport, CT", "Escondido, CA", "Killeen, TX", "Alexandria, VA", "McAllen, TX", "Mesquite, TX", "Hollywood, FL", "Surprise, AZ", "Rockford, IL", "Thornton, CO", "Lancaster, CA", "Palmdale, CA", "Bellevue, WA", "Hayward, CA", "Salinas, CA", "Frisco, TX", "Pomona, CA", "Lakewood, CO", "Sunnyvale, CA", "Macon, GA", "Kansas City, KS", "Clarksville, TN", "Springfield, MA", "Pasadena, TX", "Roseville, CA", "Charleston, SC", "Dayton, OH", "Fullerton, CA", "Visalia, CA", "Waco, TX", "Miramar, FL", "Olathe, KS", "Sterling Heights, MI", "Victorville, CA", "Cedar Rapids, IA", "Warren, MI", "Gainesville, FL", "Topeka, KS", "Stamford, CT", "New Haven, CT", "Kent, WA", "Concord, CA", "Elizabeth, NJ", "Columbia, SC", "Thousand Oaks, CA", "Fargo, ND", "Billings, MT", "Cheyenne, WY", "Burlington, VT", "Dover, DE", "Charleston, WV", "Manchester, NH", "Portland, ME"
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
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  // Dropdown state
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = US_CITIES.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 50); // Limit to 50 results for performance

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
    setCardFile(null);
    setFormError(null);
    setCitySearch("");
    setIsCityDropdownOpen(false);
    if (avatarRef.current) avatarRef.current.value = "";
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
        if (cardFile) {
          if (!cardFile.type.startsWith("image/")) throw new Error("Card must be an image.");
          const url = await uploadCreatorImage(cardFile, id, "gallery"); // Using gallery context for S3 path
          const patch = await fetch(`/api/admin/creators/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cardImage: url }),
          });
          if (!patch.ok) throw new Error("Saved profile but card URL failed to attach.");
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
            <div className="relative" ref={dropdownRef}>
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Location</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={location}
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  placeholder="Select City"
                  className={`${fieldClass} cursor-pointer pr-10`}
                />
                <ChevronDown className={`absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-transform ${isCityDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {isCityDropdownOpen && (
                <div className="absolute left-0 right-0 z-[100] mt-2 max-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-white/5 p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search cities..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="w-full bg-white/5 py-2 pl-9 pr-4 text-xs text-white outline-none placeholder:text-white/20 focus:bg-white/10"
                      />
                    </div>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto px-1 py-1 custom-scrollbar">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setLocation(city);
                            setIsCityDropdownOpen(false);
                            setCitySearch("");
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <MapPin className="h-3.5 w-3.5 text-[#d4a853]/60" />
                          {city}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-xs text-white/30">No cities found matching "{citySearch}"</div>
                    )}
                  </div>
                </div>
              )}
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
                  className="focus-outline mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d4a853]/35 bg-[#07070b]/60 px-3 py-3 text-sm text-[#f0c97a]/90 transition-colors hover:border-[#d4a853]/55 hover:bg-[#d4a853]/5"
                >
                  <ImagePlus className="h-4 w-4" aria-hidden />
                  {avatarFile ? "Cropped Photo Added ✦" : "Choose portrait…"}
                </button>
              </ImageCropUploader>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[#f0c97a]/70">Card Image (10:14 Ratio)</label>
              <ImageCropUploader
                mode="card"
                onUploadComplete={(blob) => {
                  const file = new File([blob], "card.png", { type: "image/png" });
                  setCardFile(file);
                }}
              >
                <button
                  type="button"
                  className="focus-outline mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#ff2d78]/35 bg-[#07070b]/60 px-3 py-3 text-sm text-[#ff2d78]/90 transition-colors hover:border-[#ff2d78]/55 hover:bg-[#ff2d78]/5"
                >
                  <ImagePlus className="h-4 w-4" aria-hidden />
                  {cardFile ? "Card Photo Added ✦" : "Choose card image…"}
                </button>
              </ImageCropUploader>
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
