import Image from "next/image";
import type { CreatorPostItem } from "@/lib/types/creator";

type Props = {
  post: CreatorPostItem;
  creatorName: string;
};

function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export function LockedPostCard({ post, creatorName }: Props) {
  return (
    <div className="locked-post glass-card" id={`post-${post.id}`}>
      {/* Blurred preview */}
      <div className="locked-post__preview">
        <Image
          src={post.previewUrl}
          alt={post.caption ?? "Locked content"}
          fill
          className="locked-post__image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {post.isLocked && <div className="locked-post__blur-overlay" />}
      </div>

      {/* Lock overlay */}
      {post.isLocked && (
        <div className="locked-overlay">
          <div className="locked-overlay__icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="locked-overlay__text">Exclusive Content</p>
          <button className="locked-overlay__unlock pill-button-primary" type="button">
            Subscribe to unlock – {formatPrice(post.unlockPriceCents)}/month
          </button>
        </div>
      )}

      {/* Post footer */}
      <div className="locked-post__footer">
        <div className="locked-post__meta">
          {post.caption && (
            <p className="locked-post__caption">{post.caption}</p>
          )}
          <div className="locked-post__stats">
            <span className="locked-post__likes">
              ❤️ {post.likeCount}
            </span>
            {post.mediaType === "VIDEO" && (
              <span className="locked-post__type-badge">🎬 Video</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
