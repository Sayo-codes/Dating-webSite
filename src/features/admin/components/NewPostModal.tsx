"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, Image as ImageIcon, Video, CheckCircle2 } from "lucide-react";

type NewPostModalProps = {
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onToast: (message: string, tone: "success" | "error") => void;
};

export function NewPostModal({
  creatorId,
  creatorUsername,
  creatorName,
  isOpen,
  onClose,
  onSuccess,
  onToast,
}: NewPostModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handlePost = async () => {
    if (!file) {
      onToast("Please select an image or video first.", "error");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get presigned URL
      const presignRes = await fetch("/api/upload/presign", {
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

      if (!presignRes.ok) {
        const err = await presignRes.json();
        throw new Error(err.error || "Failed to get upload URL");
      }

      const { uploadUrl, publicUrl } = await presignRes.json();

      // 2. Upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("File upload failed");

      // 3. Create post in database
      const createPostRes = await fetch(`/api/creators/${creatorUsername}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl: publicUrl,
          mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
          caption,
        }),
      });

      if (!createPostRes.ok) {
        const err = await createPostRes.json();
        throw new Error(err.error || "Failed to create post");
      }

      onToast("Post published ✦", "success");
      onSuccess();
      onClose();
      // Reset state
      setFile(null);
      setPreviewUrl(null);
      setCaption("");
    } catch (error) {
      onToast(error instanceof Error ? error.message : "Something went wrong", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const isVideo = file?.type.startsWith("video/");

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full h-full sm:h-auto sm:max-w-xl bg-[#0a0a0f] sm:rounded-[28px] border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#d4a853]" />
              New Post for {creatorName}
            </h2>
            <p className="text-sm text-white/40 mt-0.5">Post images or videos to the feed</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* File Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer aspect-video sm:aspect-auto sm:h-64 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden ${
              previewUrl ? 'border-primary/40 bg-white/[0.02]' : 'border-white/10 hover:border-[#d4a853]/40 hover:bg-[#d4a853]/5'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={handleFileChange}
            />
            
            {previewUrl ? (
              <div className="w-full h-full relative">
                {isVideo ? (
                  <video 
                    src={previewUrl} 
                    controls 
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                )}
                {/* Overlay for re-picking */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#d4a853]/10 transition-colors">
                  <Upload className="h-8 w-8 text-white/30 group-hover:text-[#d4a853]/60" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Click to upload media</p>
                  <p className="text-white/40 text-sm mt-1">Images or Videos allowed</p>
                </div>
              </>
            )}
          </div>

          {/* Caption Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#f0c97a]/70">Caption (optional)</label>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#d4a853]/50 focus:border-[#d4a853]/30 min-h-[120px] text-base"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 grid grid-cols-2 gap-4">
          <button 
            onClick={onClose}
            className="min-h-[48px] px-6 rounded-full border border-white/10 text-white/70 hover:bg-white/5 transition-colors font-medium text-base"
          >
            Cancel
          </button>
          <button 
            disabled={!file || isUploading}
            onClick={handlePost}
            className="min-h-[48px] bg-gradient-to-r from-[#d4a853] to-[#ff2d78] rounded-full text-white font-bold text-base shadow-[0_8px_32px_rgba(212,168,83,0.25)] hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Posting...
              </span>
            ) : (
              <>
                Post to Feed ✦
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
