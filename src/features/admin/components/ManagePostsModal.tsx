"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Calendar, Lock, Unlock, Loader2 } from "lucide-react";
import Image from "next/image";

type Post = {
  id: string;
  caption: string | null;
  previewUrl: string;
  mediaType: string;
  isLocked: boolean;
  createdAt: string;
};

type ManagePostsModalProps = {
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  isOpen: boolean;
  onClose: () => void;
  onToast: (message: string, tone: "success" | "error") => void;
};

export function ManagePostsModal({
  creatorUsername,
  creatorName,
  isOpen,
  onClose,
  onToast,
}: ManagePostsModalProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPosts();
    }
  }, [isOpen, creatorUsername]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/creators/${creatorUsername}/posts?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    setDeleteId(postId);
    try {
      const res = await fetch(`/api/creators/${creatorUsername}/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        onToast("Post deleted", "success");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete post");
      }
    } catch (error) {
      onToast(error instanceof Error ? error.message : "Failed to delete", "error");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full h-full sm:h-auto sm:max-w-3xl bg-[#0a0a0f] sm:rounded-[28px] border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Manage Posts: {creatorName}
            </h2>
            <p className="text-sm text-white/40 mt-0.5">View and delete feed posts</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-[#d4a853] animate-spin" />
              <p className="text-white/40">Loading feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-white/60 font-medium text-lg">No posts found</p>
              <p className="text-white/30 text-sm mt-1">This creator hasn't posted anything to their feed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.map((post) => (
                <div 
                  key={post.id}
                  className="group relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20"
                >
                  <div className="aspect-square relative bg-black/40">
                    <Image 
                      src={post.previewUrl} 
                      alt="" 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={!post.previewUrl.startsWith("/")}
                    />
                    
                    {/* Overlay info */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className="bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1.5 border border-white/10">
                        {post.isLocked ? <Lock className="h-3 w-3 text-[#d4a853]" /> : <Unlock className="h-3 w-3 text-green-400" />}
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                          {post.isLocked ? 'Premium' : 'Free'}
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                       <p className="text-white text-xs line-clamp-2 italic font-light">
                          {post.caption || "No caption"}
                       </p>
                       <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/40">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                       </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-white/[0.02] border-t border-white/5 flex justify-end items-center">
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting && deleteId === post.id}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 group/del"
                      title="Delete post"
                    >
                      {isDeleting && deleteId === post.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-5 w-5" />
                          <span className="text-sm font-bold mr-2">Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full min-h-[48px] px-6 rounded-full border border-white/10 text-white/70 hover:bg-white/5 transition-colors font-medium text-base"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
