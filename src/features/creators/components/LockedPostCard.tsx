"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CreatorPostItem } from "@/lib/types/creator";

type Props = {
  post: CreatorPostItem;
  creatorName: string;
  creatorId: string;
};

export function LockedPostCard({ post, creatorName, creatorId }: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setlikeCount] = useState(post.likeCount);
  const [isLiking, setIsLiking] = useState(false);
  const priceLabel = (post.unlockPriceCents / 100).toFixed(2);
  const subscribeHref = `/premium?creator=${encodeURIComponent(creatorId)}`;

  const toggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const action = isLiked ? "unlike" : "like";
      // Optimistic update
      setIsLiked(!isLiked);
      setlikeCount(prev => isLiked ? prev - 1 : prev + 1);

      await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    } catch (e) {
      // Revert on error
      setIsLiked(!isLiked);
      setlikeCount(post.likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="locked-post glass-card w-full mb-4 transition-all duration-150 active:opacity-90" id={`post-${post.id}`}>
      {/* Post media preview */}
      <div className="locked-post__preview">
        {post.mediaType === "VIDEO" && post.mediaUrl ? (
          <video
            src={post.mediaUrl}
            controls
            className="locked-post__image object-cover w-full h-full"
          />
        ) : (
          <Image
            src={post.mediaUrl || post.previewUrl}
            alt={post.caption ?? `Post by ${creatorName}`}
            fill
            className="locked-post__image"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        )}
      </div>

      {/* Post footer */}
      <div className="locked-post__footer">
        <div className="locked-post__meta">
          {post.caption && (
            <p className="locked-post__caption">{post.caption}</p>
          )}
          <div className="locked-post__stats flex items-center gap-4">
            <button
              onClick={toggleLike}
              disabled={isLiking || post.likesLocked}
              className={`flex items-center gap-1.5 transition-all duration-150 active:scale-95 ${isLiked ? "text-red-500" : "text-[var(--text-muted)] hover:text-white"
                } ${post.likesLocked ? "cursor-default opacity-80" : "cursor-pointer"}`}
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{likeCount}</span>
            </button>
            {post.mediaType === "VIDEO" && (
              <span className="locked-post__type-badge">🎬 Video</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
