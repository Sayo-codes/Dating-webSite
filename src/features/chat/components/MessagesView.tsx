"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useSocket } from "../useSocket";
import { SkeletonConversationList } from "@/shared/ui/Skeleton";

type User = { id: string; username: string; role: string };

type CreatorInfo = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  verified: boolean;
};

type UserInfo = { id: string; username: string };

type ConversationItem = {
  id: string;
  creator?: CreatorInfo;
  user?: UserInfo;
  lastMessage: {
    id: string;
    body: string | null;
    mediaUrl: string | null;
    mediaType: string | null;
    senderType: string;
    createdAt: string;
  } | null;
  updatedAt: string;
  unreadCount?: number;
};

type Message = {
  id: string;
  conversationId: string;
  senderType: string;
  body: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
};

type MessagesViewProps = { user: User };

const avatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle fill='%23333' cx='24' cy='24' r='24'/%3E%3C/svg%3E";

function AttachIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function MessagesView({ user }: MessagesViewProps) {
  const searchParams = useSearchParams();
  const creatorIdFromQuery = searchParams.get("creator");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{ url: string; mediaType: "IMAGE" | "VIDEO" } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { connected, join, leave, onMessageNew } = useSocket();

  const isCreator = user.role === "creator";
  const baseUrl = isCreator ? "/api/creator/conversations" : "/api/conversations";

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  const otherParty = selectedConversation
    ? isCreator
      ? selectedConversation.user
      : selectedConversation.creator
    : null;

  const fetchConversations = useCallback(async () => {
    const res = await fetch(baseUrl);
    if (!res.ok) return;
    const data = (await res.json()) as { conversations: ConversationItem[] };
    setConversations(data.conversations ?? []);
  }, [baseUrl]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchConversations();
      if (creatorIdFromQuery) {
        const res = await fetch(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creatorId: creatorIdFromQuery }),
        });
        if (res.ok) {
          const data = (await res.json()) as { conversation: ConversationItem & { id: string } };
          const conv = data.conversation;
          setSelectedId(conv.id);
          await fetchConversations();
        }
      }
      setLoading(false);
    })();
  }, [creatorIdFromQuery, baseUrl, fetchConversations]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    leave(selectedId);
    join(selectedId);
    (async () => {
      const res = await fetch(`${baseUrl}/${selectedId}/messages`);
      if (!res.ok) return;
      const data = (await res.json()) as { messages: Message[] };
      setMessages(data.messages ?? []);
      setTimeout(scrollToBottom, 100);
    })();
    return () => leave(selectedId);
  }, [selectedId, baseUrl, join, leave, scrollToBottom]);

  useEffect(() => {
    return onMessageNew((data: any) => {
      const msg = data as Message;
      
      // If for current conversation, add to thread
      if (msg.conversationId === selectedId) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        setTimeout(scrollToBottom, 50);
      }

      // Update conversation list item
      setConversations((prev) => {
        const next = prev.map((c) => {
          if (c.id === msg.conversationId) {
            const isUnread = msg.conversationId !== selectedId;
            return {
              ...c,
              lastMessage: {
                id: msg.id,
                body: msg.body,
                mediaUrl: msg.mediaUrl,
                mediaType: msg.mediaType,
                senderType: msg.senderType,
                createdAt: msg.createdAt,
              },
              unreadCount: isUnread ? (c.unreadCount || 0) + 1 : 0,
              updatedAt: msg.createdAt,
            };
          }
          return c;
        });
        // Sort by most recent
        return [...next].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    });
  }, [onMessageNew, selectedId, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!selectedId || (!text && !sending)) return;
    setSending(true);
    setInput("");
    try {
      const res = await fetch(`${baseUrl}/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text || undefined }),
      });
      if (res.ok) {
        const data = (await res.json()) as { message: Message };
        setMessages((prev) => [...prev, data.message]);
        setTimeout(scrollToBottom, 50);
      } else {
        setInput(text);
      }
    } finally {
      setSending(false);
    }
  };

  const requestCameraAndOpenInput = useCallback(async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      cameraInputRef.current?.click();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Camera access denied.";
      setCameraError(message);
      setTimeout(() => setCameraError(null), 4000);
    }
  }, []);

  const uploadAndSendMedia = async (file: File) => {
    if (!selectedId) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) return;
    const mediaType = isImage ? "IMAGE" : "VIDEO";
    const localUrl = URL.createObjectURL(file);
    setPendingUpload({ url: localUrl, mediaType });
    setUploadingMedia(true);
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          context: "message",
          conversationId: selectedId,
          size: file.size,
        }),
      });
      if (!presignRes.ok) {
        const err = (await presignRes.json()) as { error?: string };
        throw new Error(err.error ?? "Upload failed");
      }
      const { uploadUrl, publicUrl } = (await presignRes.json()) as {
        uploadUrl: string;
        publicUrl: string;
      };
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!putRes.ok) throw new Error("Upload failed");

      const msgRes = await fetch(`${baseUrl}/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: input.trim() || undefined,
          mediaUrl: publicUrl,
          mediaType,
        }),
      });
      if (msgRes.ok) {
        const data = (await msgRes.json()) as { message: Message };
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } finally {
      setUploadingMedia(false);
      if (localUrl) {
        URL.revokeObjectURL(localUrl);
        setPendingUpload(null);
      }
      fileInputRef.current && (fileInputRef.current.value = "");
      cameraInputRef.current && (cameraInputRef.current.value = "");
    }
  };

  const showListOnMobile = !selectedId;
  const showThreadOnMobile = !!selectedId;

  return (
    <div className="flex h-[calc(100dvh-6rem)] min-h-[320px] max-h-[840px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] shadow-[var(--shadow-card)] sm:max-h-none sm:h-[calc(100vh-8rem)] sm:min-h-[420px] sm:flex-row">
      {/* Conversation list - on mobile hidden when thread is open */}
      <aside
        className={`flex w-full flex-col border-b border-white/10 sm:h-full sm:w-80 sm:border-b-0 sm:border-r ${
          showThreadOnMobile ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
          <h1 className="font-[var(--font-heading)] text-lg font-semibold text-white">
            Messages
          </h1>
          {connected && (
            <p className="mt-1.5 text-xs text-[var(--status-online)]">Live</p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="p-4 sm:p-5">
              <SkeletonConversationList count={8} />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-[var(--text-muted)]">
              No conversations yet.
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {conversations.map((c) => {
                const name = isCreator
                  ? (c.user?.username ?? "User")
                  : (c.creator?.displayName ?? c.creator?.username ?? "Creator");
                const avatar = isCreator ? null : (c.creator?.avatarUrl ?? null);
                const isSelected = c.id === selectedId;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(c.id);
                        setConversations((prev) =>
                          prev.map((conv) =>
                            conv.id === c.id ? { ...conv, unreadCount: 0 } : conv
                          )
                        );
                      }}
                      className={`flex w-full min-h-[44px] items-center gap-3 p-4 text-left transition-all duration-150 active:opacity-70 hover:bg-white/5 sm:min-h-0 sm:p-3 ${isSelected ? "bg-white/10" : ""}`}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                        <Image
                          src={avatar ?? avatarPlaceholder}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized={!!avatar && !avatar.startsWith("/")}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-white">{name}</p>
                          {c.unreadCount ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[10px] font-bold text-[#05060a]">
                              {c.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        <p className={`truncate text-xs ${c.unreadCount ? "font-semibold text-white" : "text-[var(--text-muted)]"}`}>
                          {c.lastMessage
                            ? c.lastMessage.body ?? "Media"
                            : "No messages"}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Thread + composer - on mobile only visible when conversation selected */}
      <section
        className={`flex flex-1 flex-col min-w-0 ${showListOnMobile ? "hidden sm:flex" : "flex"}`}
      >
        {selectedConversation && otherParty ? (
          <>
            <header className="flex min-h-[56px] shrink-0 items-center gap-3 border-b border-white/10 px-3 py-2 sm:p-3">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="focus-outline -ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition-all duration-150 active:scale-90 hover:bg-white/10 hover:text-white sm:hidden"
                aria-label="Back to conversations"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                {!isCreator && selectedConversation.creator?.avatarUrl ? (
                  <Image
                    src={selectedConversation.creator.avatarUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={!selectedConversation.creator.avatarUrl.startsWith("/")}
                  />
                ) : (
                  <div className="h-full w-full bg-white/10" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">
                  {isCreator
                    ? otherParty.username
                    : selectedConversation.creator?.displayName ?? selectedConversation.creator?.username}
                </p>
                <p className="text-xs text-white/50">
                  {connected ? "Online" : "Offline"}
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 sm:p-4">
              {messages.map((m) => {
                const isMe =
                  (isCreator && m.senderType === "CREATOR") ||
                  (!isCreator && m.senderType === "USER");
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-2.5 shadow-[var(--shadow-soft-subtle)] ${
                        isMe
                          ? "bg-[var(--accent-primary)]/90 text-[#05060a]"
                          : "border border-white/10 bg-white/10 text-white"
                      }`}
                    >
                      {m.body && <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>}
                      {m.mediaUrl && (
                        <div className="mt-2">
                          {m.mediaType === "IMAGE" && (
                            <a
                              href={m.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block overflow-hidden rounded-lg"
                            >
                              <img
                                src={m.mediaUrl}
                                alt=""
                                className="max-h-48 w-auto object-cover"
                              />
                            </a>
                          )}
                          {m.mediaType === "VIDEO" && (
                            <video
                              src={m.mediaUrl}
                              controls
                              className="max-h-48 rounded-lg"
                              preload="metadata"
                            />
                          )}
                          {m.mediaType === "VOICE" && (
                            <a
                              href={m.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs underline"
                            >
                              Voice message
                            </a>
                          )}
                        </div>
                      )}
                      <p className={`mt-1 text-xs ${isMe ? "text-[#05060a]/70" : "text-white/50"}`}>
                        {new Date(m.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {pendingUpload && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] min-w-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-white shadow-[var(--shadow-soft-subtle)]">
                    <p className="text-xs text-white/60">Uploading…</p>
                    <div className="mt-2">
                      {pendingUpload.mediaType === "IMAGE" && (
                        <img
                          src={pendingUpload.url}
                          alt="Uploading preview"
                          className="max-h-40 w-auto rounded-lg object-cover opacity-80"
                        />
                      )}
                      {pendingUpload.mediaType === "VIDEO" && (
                        <video
                          src={pendingUpload.url}
                          className="max-h-40 rounded-lg opacity-80"
                          autoPlay
                          muted
                          loop
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadAndSendMedia(f);
                  }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadAndSendMedia(f);
                  }}
                />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending || uploadingMedia}
                    className="focus-outline shrink-0 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/70 transition-all duration-150 active:scale-90 hover:bg-white/10 hover:text-white disabled:opacity-50"
                    title="Attach photo or video"
                    aria-label="Attach photo or video"
                  >
                  <AttachIcon />
                </button>
                <div className="relative shrink-0">
                   <button
                    type="button"
                    onClick={requestCameraAndOpenInput}
                    disabled={sending || uploadingMedia}
                    className="focus-outline flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/70 transition-all duration-150 active:scale-90 hover:bg-white/10 hover:text-white disabled:opacity-50"
                    title="Take photo or video"
                    aria-label="Take photo or video"
                  >
                    <CameraIcon />
                  </button>
                  {cameraError && (
                    <p className="absolute bottom-full left-0 right-0 mb-1 whitespace-nowrap text-xs text-red-300" role="alert">
                      {cameraError}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="input-base focus-outline min-h-[44px] min-w-0 flex-1 rounded-full px-4 py-3 text-[16px] sm:text-[16px]"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || (!input.trim() && !uploadingMedia)}
                  className="pill-button-primary focus-outline shrink-0 min-h-[44px] min-w-[44px] px-4 py-3 text-sm font-medium transition-all duration-150 active:scale-95 disabled:opacity-50"
                >
                  {uploadingMedia ? "…" : "Send"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 py-12 text-center text-sm text-[var(--text-muted)]">
            Select a conversation or message a creator from their profile.
          </div>
        )}
      </section>
    </div>
  );
}
