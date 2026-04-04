"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import type { CreatorPostItem } from "@/lib/types/creator";

/* ── Types ── */
type PostCardProps = {
  post: CreatorPostItem;
  creatorName: string;
  creatorAvatar: string | null;
  creatorHandle: string;
  creatorId: string;
};

type FeedProps = {
  creatorId: string;
  creatorName: string;
  creatorAvatar: string | null;
  creatorHandle: string;
  initialPosts: CreatorPostItem[];
};

/* ── Helpers ── */
const avatarFallback =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%231a1525' width='80' height='80' rx='40'/%3E%3C/svg%3E";

function formatTimeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: false })
      .replace("about ", "")
      .replace("less than a minute", "just now")
      .replace(" minutes", "m")
      .replace(" minute", "m")
      .replace(" hours", "h")
      .replace(" hour", "h")
      .replace(" days", "d")
      .replace(" day", "d")
      .replace(" months", "mo")
      .replace(" month", "mo")
      .replace(" years", "y")
      .replace(" year", "y");
  } catch {
    return "";
  }
}

/* ── Heart Icon ── */
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── Comment Icon ── */
function CommentIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* ── Share Icon ── */
function ShareIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

/* ── Post Card ── */
function PostCard({
  post,
  creatorName,
  creatorAvatar,
  creatorHandle,
  creatorId,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiking, setIsLiking] = useState(false);

  const avatarSrc = creatorAvatar ?? avatarFallback;
  const mediaSrc = post.mediaUrl ?? post.previewUrl;
  const timeAgo = formatTimeAgo(post.createdAt);

  const toggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const wasLiked = isLiked;
    // Optimistic
    setIsLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    try {
      await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: wasLiked ? "unlike" : "like" }),
      });
    } catch {
      // Revert
      setIsLiked(wasLiked);
      setLikeCount(post.likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/creators/${creatorHandle}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${creatorName} on Rsdate`, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <article className="w-full" id={`post-${post.id}`}>
      {/* ── Header row: avatar + name + time ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src={avatarSrc}
            alt=""
            fill
            className="object-cover"
            sizes="32px"
            unoptimized={avatarSrc.startsWith("data:") || !avatarSrc.startsWith("/")}
          />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="truncate text-[15px] font-semibold text-white">
            {creatorName}
          </span>
          <span className="truncate text-[14px] text-white/50">
            @{creatorHandle}
          </span>
        </div>
        {timeAgo && (
          <span className="shrink-0 text-[13px] text-white/40">
            {timeAgo} ago
          </span>
        )}
      </div>

      {/* ── Media ── */}
      <div className="relative w-full" style={{ aspectRatio: "10 / 14" }}>
        {post.mediaType === "VIDEO" && mediaSrc ? (
          <video
            src={mediaSrc}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            style={{ aspectRatio: "10 / 14" }}
          />
        ) : (
          <Image
            src={mediaSrc}
            alt={post.caption ?? `Post by ${creatorName}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 600px"
            unoptimized
          />
        )}
      </div>

      {/* ── Action row ── */}
      <div className="flex items-center gap-0 px-2 py-1">
        <button
          type="button"
          onClick={toggleLike}
          disabled={isLiking}
          className={`flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-lg px-2 transition-colors ${
            isLiked
              ? "text-red-500"
              : "text-white/60 hover:text-white active:text-white"
          }`}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <HeartIcon filled={isLiked} />
          <span className="text-[14px] font-medium">{likeCount}</span>
        </button>

        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-lg px-2 text-white/60 transition-colors hover:text-white active:text-white"
          aria-label="Comments"
        >
          <CommentIcon />
          <span className="text-[14px] font-medium">
            {post.commentCount ?? 0}
          </span>
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleShare}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2 text-white/60 transition-colors hover:text-white active:text-white"
          aria-label="Share"
        >
          <ShareIcon />
        </button>
      </div>

      {/* ── Caption ── */}
      {post.caption && (
        <div className="px-4 pb-4">
          <p className="text-[15px] leading-[1.6] text-white/90">
            {post.caption}
          </p>
        </div>
      )}
    </article>
  );
}

/* ── Exported PostCard for external use ── */
export { PostCard };

/* ── Client Post Feed with Infinite Scroll ── */
export function ClientPostFeed({
  creatorId,
  creatorName,
  creatorAvatar,
  creatorHandle,
  initialPosts,
}: FeedProps) {
  const [posts, setPosts] = useState<CreatorPostItem[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (initialPosts.length >= 10) {
      setNextCursor(initialPosts[initialPosts.length - 1].id);
    }
  }, [initialPosts]);

  const loadMore = useCallback(async () => {
    if (isLoading || !nextCursor) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/creators/${creatorId}/posts?cursor=${nextCursor}&limit=10`
      );
      if (res.ok) {
        const data: { posts: CreatorPostItem[]; nextCursor: string | null } =
          await res.json();
        setPosts((prev) => [...prev, ...data.posts]);
        setNextCursor(data.nextCursor);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [creatorId, nextCursor, isLoading]);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && nextCursor) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );
      if (node) observerRef.current.observe(node);
    },
    [isLoading, nextCursor, loadMore]
  );

  return (
    <div className="flex flex-col">
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <div key={post.id} ref={isLast ? lastPostRef : undefined}>
            <PostCard
              post={post}
              creatorName={creatorName}
              creatorAvatar={creatorAvatar}
              creatorHandle={creatorHandle}
              creatorId={creatorId}
            />
            {/* Thin divider between posts */}
            {!isLast && (
              <div className="mx-4 border-t border-white/[0.08]" />
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-primary)] border-t-transparent" />
        </div>
      )}

      {!nextCursor && posts.length > 0 && !isLoading && (
        <div className="py-8 text-center text-[14px] text-white/40">
          You&apos;ve reached the end
        </div>
      )}
    </div>
  );
}
