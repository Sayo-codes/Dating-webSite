import { PhotoGallery, GalleryImage } from "@/components/ui/gallery";

/* ─── Creator Data ────────────────────────────────────────────────────────────── */
const FEATURED_CREATORS: GalleryImage[] = [
  {
    id: "creator-1",
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=560&fit=crop&crop=face",
    alt: "Creator Aria",
    creator: "Aria V.",
    badge: "Verified ✦ Elite",
    accentColor: "#d4a853",
  },
  {
    id: "creator-2",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=560&fit=crop&crop=face",
    alt: "Creator Mila",
    creator: "Mila S.",
    badge: "VIP ✦ Online",
    accentColor: "#ff2d78",
  },
  {
    id: "creator-3",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=560&fit=crop&crop=face",
    alt: "Creator Zoe",
    creator: "Zoe K.",
    badge: "Featured",
    accentColor: "#c778ff",
  },
  {
    id: "creator-4",
    src: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=560&fit=crop&crop=face",
    alt: "Creator Isabelle",
    creator: "Isabelle R.",
    badge: "Verified ✦ Elite",
    accentColor: "#d4a853",
  },
  {
    id: "creator-5",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=560&fit=crop&crop=face",
    alt: "Creator Naomi",
    creator: "Naomi L.",
    badge: "VIP",
    accentColor: "#ff2d78",
  },
  {
    id: "creator-6",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=560&fit=crop&crop=face",
    alt: "Creator Luna",
    creator: "Luna M.",
    badge: "New ✦ Rising",
    accentColor: "#d4a853",
  },
];

/* ─── Section Wrapper ─────────────────────────────────────────────────────────── */
export function GallerySection() {
  return (
    <div className="section-shell">
      <PhotoGallery
        images={FEATURED_CREATORS}
        heading="Featured Creators ✦"
        ctaLabel="Browse All Creators ✦"
        ctaHref="/creators"
      />
    </div>
  );
}
