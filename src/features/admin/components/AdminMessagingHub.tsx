"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useSocket } from "@/features/chat/useSocket";

/* ─── Types ─── */
type CreatorItem = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  conversationCount: number;
};

type ConversationItem = {
  id: string;
  userId: string;
  creatorId: string;
  user: { id: string; username: string; email: string };
  creator: { id: string; username: string; displayName: string; avatarUrl: string | null };
  unreadCount: number;
  lastMessage: {
    id: string;
    body: string | null;
    senderType: string;
    mediaUrl: string | null;
    mediaType: string | null;
    isPPV: boolean;
    createdAt: string;
  } | null;
  updatedAt: string;
};

type Message = {
  id: string;
  conversationId: string;
  senderType: string;
  body: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  isPPV: boolean;
  ppvPriceCents: number | null;
  createdAt: string;
};

type SubscriberInfo = {
  user: { id: string; username: string; email: string; createdAt: string } | null;
  totalSpentCents: number;
  isSubscribed: boolean;
};

type MediaVaultItem = {
  id: string;
  url: string;
  type: string;
  createdAt: string;
};

const avatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle fill='%23333' cx='24' cy='24' r='24'/%3E%3C/svg%3E";

/* ─── Icons ─── */
function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function VaultIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="12" x2="14" y2="14" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export function AdminMessagingHub() {
  // ─── State ───
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isPPV, setIsPPV] = useState(false);
  const [ppvPrice, setPpvPrice] = useState("10.00");
  const [subscriberInfo, setSubscriberInfo] = useState<SubscriberInfo | null>(null);
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

  // Media Vault state
  const [showVault, setShowVault] = useState(false);
  const [vaultMedia, setVaultMedia] = useState<MediaVaultItem[]>([]);
  const [loadingVault, setLoadingVault] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { connected, join, leave, onMessageNew } = useSocket();

  const selectedConv = conversations.find((c) => c.id === selectedConvId);
  const selectedCreator = creators.find((c) => c.id === selectedCreatorId);

  // ─── Fetch creators ───
  useEffect(() => {
    (async () => {
      setLoadingCreators(true);
      const res = await fetch("/api/admin/creators");
      if (res.ok) {
        const data = (await res.json()) as { creators: CreatorItem[] };
        setCreators(data.creators ?? []);
      }
      setLoadingCreators(false);
    })();
  }, []);

  // ─── Fetch conversations for selected creator ───
  const fetchConversations = useCallback(async (creatorId?: string | null) => {
    setLoadingConvs(true);
    const url = creatorId ? `/api/admin/conversations?creatorId=${creatorId}` : "/api/admin/conversations";
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as { conversations: ConversationItem[] };
      const convs = data.conversations ?? [];
      setConversations(convs);
      setSelectedConvId((prev) => {
        if (prev && convs.some((c) => c.id === prev)) return prev;
        return convs[0]?.id ?? null;
      });
      const map: Record<string, number> = {};
      for (const c of convs) map[c.id] = c.unreadCount;
      setUnreadMap((prev) => ({ ...prev, ...map }));
    }
    setLoadingConvs(false);
  }, []);

  useEffect(() => {
    fetchConversations(selectedCreatorId);
  }, [selectedCreatorId, fetchConversations]);

  // ─── Fetch messages for selected conversation ───
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      setSubscriberInfo(null);
      return;
    }
    (async () => {
      setLoadingMsgs(true);
      const res = await fetch(`/api/admin/conversations/${selectedConvId}/messages`);
      if (res.ok) {
        const data = (await res.json()) as { messages: Message[] };
        setMessages(data.messages ?? []);
      }
      fetch(`/api/admin/conversations/${selectedConvId}/read`, { method: "POST" });
      setUnreadMap((prev) => ({ ...prev, [selectedConvId]: 0 }));
      const subRes = await fetch(`/api/admin/conversations/${selectedConvId}/subscriber`);
      if (subRes.ok) {
        setSubscriberInfo(await subRes.json() as SubscriberInfo);
      }
      setLoadingMsgs(false);
    })();
  }, [selectedConvId]);

  // ─── Fetch media vault for creator ───
  const fetchVault = useCallback(async (creatorId: string) => {
    setLoadingVault(true);
    try {
      const res = await fetch(`/api/admin/creators/${creatorId}/gallery`);
      if (res.ok) {
        const data = (await res.json()) as { media: MediaVaultItem[] };
        setVaultMedia(data.media ?? []);
      }
    } catch {
      // silent
    }
    setLoadingVault(false);
  }, []);

  // ─── Socket: join conversation rooms ───
  useEffect(() => {
    if (!selectedConvId) return;
    join(selectedConvId);
    return () => leave(selectedConvId);
  }, [selectedConvId, join, leave]);

  // ─── Socket: receive new messages ───
  useEffect(() => {
    return onMessageNew((data: unknown) => {
      const msg = data as Message;
      if (msg.conversationId === selectedConvId) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        fetch(`/api/admin/conversations/${selectedConvId}/read`, { method: "POST" });
      } else {
        setUnreadMap((prev) => ({
          ...prev,
          [msg.conversationId]: (prev[msg.conversationId] ?? 0) + 1,
        }));
      }
    });
  }, [onMessageNew, selectedConvId]);

  // ─── Auto-scroll ───
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Send message as creator ───
  const sendMessage = async () => {
    const text = input.trim();
    if (!selectedConvId || (!text && !sending)) return;
    setSending(true);
    setInput("");
    try {
      const payload: Record<string, unknown> = { body: text || undefined };
      if (isPPV) {
        payload.isPPV = true;
        payload.ppvPriceCents = Math.round(parseFloat(ppvPrice) * 100);
      }
      const res = await fetch(`/api/admin/conversations/${selectedConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as { message: Message };
        setMessages((prev) => [...prev, data.message]);
        setIsPPV(false);
      } else {
        setInput(text);
      }
    } finally {
      setSending(false);
    }
  };

  // ─── Send media from vault ───
  const sendVaultMedia = async (media: MediaVaultItem) => {
    if (!selectedConvId) return;
    setSending(true);
    try {
      const payload: Record<string, unknown> = {
        body: input.trim() || undefined,
        mediaUrl: media.url,
        mediaType: media.type,
      };
      if (isPPV) {
        payload.isPPV = true;
        // Default: $10 for image, $25 for video
        const defaultPrice = media.type === "VIDEO" ? "25.00" : "10.00";
        payload.ppvPriceCents = Math.round(parseFloat(ppvPrice || defaultPrice) * 100);
      }
      const res = await fetch(`/api/admin/conversations/${selectedConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as { message: Message };
        setMessages((prev) => [...prev, data.message]);
        setInput("");
        setIsPPV(false);
        setShowVault(false);
      }
    } finally {
      setSending(false);
    }
  };

  // ─── Upload and send media ───
  const uploadAndSendMedia = async (file: File) => {
    if (!selectedConvId) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) return;
    const mediaType = isImage ? "IMAGE" : "VIDEO";
    setSending(true);
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          context: "message",
          conversationId: selectedConvId,
          size: file.size,
        }),
      });
      if (!presignRes.ok) throw new Error("Upload failed");
      const { uploadUrl, publicUrl } = (await presignRes.json()) as { uploadUrl: string; publicUrl: string };
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!putRes.ok) throw new Error("Upload failed");

      const payload: Record<string, unknown> = {
        body: input.trim() || undefined,
        mediaUrl: publicUrl,
        mediaType,
      };
      if (isPPV) {
        payload.isPPV = true;
        const defaultPrice = mediaType === "VIDEO" ? "25.00" : "10.00";
        payload.ppvPriceCents = Math.round(parseFloat(ppvPrice || defaultPrice) * 100);
      }
      const msgRes = await fetch(`/api/admin/conversations/${selectedConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (msgRes.ok) {
        const data = (await msgRes.json()) as { message: Message };
        setMessages((prev) => [...prev, data.message]);
        setInput("");
        setIsPPV(false);
      }
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* ═══════════════════  RENDER  ═══════════════════ */
  return (
    <div className="admin-msg-hub" id="admin-messaging-hub">
      {/* ── LEFT: Creator list ── */}
      <aside className="admin-msg-creators">
        <div className="admin-msg-panel-header">
          <h2 className="text-sm font-semibold text-white">✦ Creators</h2>
          <span className="text-xs text-white/40">{creators.length}</span>
        </div>
        <div className="admin-msg-panel-body">
          {loadingCreators ? (
            <div className="p-4 text-xs text-white/40">Loading…</div>
          ) : (
            <ul className="divide-y divide-white/5">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCreatorId(null);
                    setShowVault(false);
                  }}
                  className={`admin-msg-list-item ${selectedCreatorId === null ? "active" : ""}`}
                >
                  <div className="admin-msg-avatar flex items-center justify-center bg-white/10 text-xs font-semibold text-white/70">
                    ✦
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">All creators</p>
                    <p className="truncate text-xs text-white/40">Show every conversation</p>
                  </div>
                </button>
              </li>
              {creators.map((c) => {
                const isActive = c.id === selectedCreatorId;
                const creatorUnread = conversations
                  .filter((cv) => cv.creatorId === c.id)
                  .reduce((sum, cv) => sum + (unreadMap[cv.id] ?? 0), 0);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCreatorId(c.id);
                        setSelectedConvId(null);
                        setShowVault(false);
                      }}
                      className={`admin-msg-list-item ${isActive ? "active" : ""}`}
                    >
                      <div className="admin-msg-avatar">
                        <Image
                          src={c.avatarUrl ?? avatarPlaceholder}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized={!!c.avatarUrl && !c.avatarUrl.startsWith("/")}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{c.displayName}</p>
                        <p className="truncate text-xs text-white/40">
                          {c.conversationCount} conversation{c.conversationCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {/* Online status indicator */}
                      <span className="admin-msg-live-dot" />
                      {creatorUnread > 0 && (
                        <span className="admin-msg-badge">{creatorUnread}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* ── CENTER: Conversation list ── */}
      <section className="admin-msg-convos">
        <div className="admin-msg-panel-header">
          <h2 className="text-sm font-semibold text-white">
            {selectedCreator ? `${selectedCreator.displayName}'s Inbox` : "All Conversations"}
          </h2>
          {connected && <span className="admin-msg-live-dot" />}
        </div>
        <div className="admin-msg-panel-body">
          {loadingConvs ? (
            <div className="p-4 text-xs text-white/40">Loading…</div>
          ) : conversations.length === 0 ? (
            <div className="admin-msg-empty">No conversations yet</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {conversations.map((c) => {
                const isActive = c.id === selectedConvId;
                const unread = unreadMap[c.id] ?? 0;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedConvId(c.id);
                        setShowVault(false);
                      }}
                      className={`admin-msg-list-item ${isActive ? "active" : ""}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-white">
                            {c.user.username}
                          </p>
                          {unread > 0 && <span className="admin-msg-badge">{unread}</span>}
                        </div>
                        <p className="truncate text-xs text-white/40 mt-0.5">
                          {c.lastMessage
                            ? c.lastMessage.isPPV
                              ? "🔒 PPV Message"
                              : c.lastMessage.body ?? "📷 Media"
                            : "No messages"}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-white/30">
                        {c.lastMessage
                          ? new Date(c.lastMessage.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ── RIGHT: Chat window ── */}
      <section className="admin-msg-chat">
        {selectedConv ? (
          <>
            {/* Chat header */}
            <div className="admin-msg-chat-header">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {selectedConv.user.username}
                  <span className="ml-2 text-xs text-white/40 font-normal">
                    chatting with {selectedConv.creator.displayName}
                  </span>
                </p>
                <p className="text-xs text-white/40 mt-0.5">{selectedConv.user.email}</p>
              </div>
              {/* Subscription badge */}
              {subscriberInfo && (
                <div className={`admin-msg-sub-badge ${subscriberInfo.isSubscribed ? "subscribed" : ""}`}>
                  {subscriberInfo.isSubscribed ? (
                    <>
                      <span className="admin-msg-sub-dot active" />
                      Subscriber · ${(subscriberInfo.totalSpentCents / 100).toFixed(2)} spent
                    </>
                  ) : (
                    <>
                      <span className="admin-msg-sub-dot" />
                      Free user
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="admin-msg-thread">
              {loadingMsgs ? (
                <div className="p-4 text-xs text-white/40 text-center">Loading messages…</div>
              ) : messages.length === 0 ? (
                <div className="admin-msg-empty">No messages in this conversation</div>
              ) : (
                messages.map((m) => {
                  const isCreator = m.senderType === "CREATOR";
                  return (
                    <div key={m.id} className={`flex ${isCreator ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`admin-msg-bubble ${isCreator ? "sent" : "received"} ${m.isPPV ? "ppv" : ""}`}
                      >
                        {m.isPPV && (
                          <div className="admin-msg-ppv-label">
                            <LockIcon size={12} />
                            <span>PPV – ${((m.ppvPriceCents ?? 0) / 100).toFixed(2)}</span>
                          </div>
                        )}
                        {m.body && <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>}
                        {m.mediaUrl && (
                          <div className="mt-1.5">
                            {m.mediaType === "IMAGE" && (
                              <a href={m.mediaUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg">
                                <img src={m.mediaUrl} alt="" className="max-h-40 w-auto object-cover" />
                              </a>
                            )}
                            {m.mediaType === "VIDEO" && (
                              <video src={m.mediaUrl} controls className="max-h-40 rounded-lg" preload="metadata" />
                            )}
                          </div>
                        )}
                        <p className={`mt-1 text-xs ${isCreator ? "text-[#05060a]/60" : "text-white/40"}`}>
                          {new Date(m.createdAt).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Media Vault overlay */}
            {showVault && (
              <div className="border-t border-white/6 bg-[rgba(14,10,22,0.95)] p-4 max-h-[300px] overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[var(--accent-gold)]">✦ Media Vault — {selectedCreator?.displayName}</h3>
                  <button
                    type="button"
                    onClick={() => setShowVault(false)}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    Close ✕
                  </button>
                </div>
                {loadingVault ? (
                  <p className="text-xs text-white/40">Loading vault…</p>
                ) : vaultMedia.length === 0 ? (
                  <p className="text-xs text-white/40">No media in vault. Upload via Creator management.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {vaultMedia.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => sendVaultMedia(m)}
                        disabled={sending}
                        className="relative aspect-square overflow-hidden rounded-lg border border-white/10 transition hover:border-[var(--accent-gold)] hover:shadow-[0_0_12px_rgba(212,168,83,0.3)] disabled:opacity-50"
                      >
                        {m.type === "IMAGE" ? (
                          <img src={m.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40">
                            <span className="text-2xl">🎬</span>
                          </div>
                        )}
                        {isPPV && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-0.5 text-center text-[10px] font-bold text-[var(--accent-gold)]">
                            PPV ${ppvPrice}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Composer */}
            <div className="admin-msg-composer">
              {/* PPV toggle */}
              <div className="admin-msg-ppv-toggle">
                <label className="admin-msg-ppv-switch">
                  <input
                    type="checkbox"
                    checked={isPPV}
                    onChange={(e) => {
                      setIsPPV(e.target.checked);
                      if (e.target.checked) setPpvPrice("10.00");
                    }}
                  />
                  <span className="admin-msg-ppv-slider" />
                </label>
                <span className="text-xs text-white/50">🔒 PPV</span>
                {isPPV && (
                  <div className="admin-msg-ppv-price">
                    <span className="text-xs text-white/50">$</span>
                    <input
                      type="number"
                      value={ppvPrice}
                      onChange={(e) => setPpvPrice(e.target.value)}
                      className="admin-msg-ppv-input"
                      step="0.01"
                      min="0.50"
                    />
                  </div>
                )}
                <span className="text-[10px] text-white/30 ml-auto">Default: $10 photo / $25 video</span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="admin-msg-form"
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sending}
                  className="admin-msg-icon-btn"
                  title="Attach media"
                >
                  <AttachIcon />
                </button>
                {/* Media Vault button */}
                <button
                  type="button"
                  onClick={() => {
                    if (showVault) {
                      setShowVault(false);
                    } else if (selectedCreatorId) {
                      fetchVault(selectedCreatorId);
                      setShowVault(true);
                    }
                  }}
                  className={`admin-msg-icon-btn ${showVault ? "!text-[var(--accent-gold)]" : ""}`}
                  title="Media Vault"
                >
                  <VaultIcon />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message as ${selectedConv.creator.displayName}…`}
                  className="admin-msg-input"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="admin-msg-send-btn"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="admin-msg-empty h-full">
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">✦</span>
              <p>
                {selectedCreatorId
                  ? "Select a conversation to start messaging"
                  : "Select a creator from the left panel"}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
