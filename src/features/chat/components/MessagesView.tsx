"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useSocket } from "../useSocket";
import { SkeletonConversationList, SkeletonChatBubbles } from "@/shared/ui/Skeleton";

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

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center my-6 px-4">
      <div className="flex-1 h-[1px] bg-white/10" />
      <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-white/30 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-white/10" />
    </div>
  );
}

export function MessagesView({ user }: MessagesViewProps) {
  const searchParams = useSearchParams();
  const creatorIdFromQuery = searchParams.get("creator");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { connected, join, leave, onMessageNew } = useSocket();

  const isCreator = user.role === "creator";
  const baseUrl = isCreator ? "/api/creator/conversations" : "/api/conversations";

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  const otherParty = selectedConversation
    ? isCreator
      ? selectedConversation.user
      : selectedConversation.creator
    : null;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    leave(selectedId);
    join(selectedId);
    (async () => {
      setMessagesLoading(true);
      const res = await fetch(`${baseUrl}/${selectedId}/messages`);
      if (res.ok) {
        const data = (await res.json()) as { messages: Message[] };
        setMessages(data.messages ?? []);
        setTimeout(scrollToBottom, 100);
      }
      setMessagesLoading(false);
    })();
    return () => leave(selectedId);
  }, [selectedId, baseUrl, join, leave, scrollToBottom]);

  useEffect(() => {
    return onMessageNew((data: any) => {
      const msg = data as Message;
      if (msg.conversationId === selectedId) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        setTimeout(scrollToBottom, 50);
      }

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
        return [...next].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
    });
  }, [onMessageNew, selectedId, scrollToBottom]);

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

  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Message[] }[] = [];
    [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).forEach((m) => {
      const date = new Date(m.createdAt);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let label = date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
      if (date.toDateString() === today.toDateString()) label = "Today";
      else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
      else if (date.getFullYear() !== today.getFullYear()) {
        label = date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      }

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === label) {
        lastGroup.messages.push(m);
      } else {
        groups.push({ date: label, messages: [m] });
      }
    });
    return groups;
  }, [messages]);

  const showListOnMobile = !selectedId;
  const showThreadOnMobile = !!selectedId;

  return (
    <div className="flex h-[calc(100dvh-6rem)] min-h-[400px] flex-col overflow-hidden bg-[#05060b] sm:flex-row sm:rounded-2xl sm:border sm:border-white/10 sm:h-[calc(100vh-10rem)]">
      {/* Search/List Sidebar */}
      <aside
        className={`flex w-full flex-col bg-[#05060b] sm:w-[360px] sm:border-r sm:border-white/10 ${
          showThreadOnMobile ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="flex min-h-[64px] items-center justify-between border-b border-white/10 px-6 py-4">
          <h1 className="text-[17px] font-bold text-white">Messages</h1>
          {connected && <div className="h-2 w-2 rounded-full bg-[var(--status-online)] shadow-[0_0_8px_var(--status-online)]" />}
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="p-4"><SkeletonConversationList count={10} /></div>
          ) : conversations.length === 0 ? (
            <div className="p-12 text-center text-[15px] text-white/30">No conversations yet</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {conversations.map((c) => {
                const isSelected = c.id === selectedId;
                const name = isCreator ? (c.user?.username ?? "User") : (c.creator?.displayName ?? c.creator?.username ?? "Creator");
                const avatar = isCreator ? null : (c.creator?.avatarUrl ?? null);
                
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => {
                        setSelectedId(c.id);
                        setConversations(p => p.map(conv => conv.id === c.id ? { ...conv, unreadCount: 0 } : conv));
                      }}
                      className={`flex min-h-[64px] w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-white/5 ${
                        isSelected ? "bg-white/5 border-l-[3px] border-[#d4a853]" : "border-l-[3px] border-transparent"
                      }`}
                    >
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white/5">
                        <Image src={avatar ?? avatarPlaceholder} alt="" fill className="object-cover" unoptimized={!!avatar && !avatar.startsWith("/")} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center justify-between">
                          <span className="truncate text-[15px] font-bold text-white">{name}</span>
                          {c.unreadCount ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                              {c.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        <p className={`truncate text-[13px] ${c.unreadCount ? "font-bold text-white" : "text-white/40"}`}>
                          {c.lastMessage?.body ?? (c.lastMessage?.mediaType ? "Media Attachment" : "No messages")}
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

      {/* Chat View */}
      <section className={`relative flex flex-1 flex-col bg-[#05060b] min-w-0 ${showListOnMobile ? "hidden sm:flex" : "flex"}`}>
        {selectedConversation && otherParty ? (
          <>
            <header className="flex min-h-[64px] items-center gap-3 border-b border-white/10 bg-[#05060b]/90 px-4 py-2 backdrop-blur-md">
              <button
                onClick={() => setSelectedId(null)}
                className="flex h-[44px] w-[44px] items-center justify-center rounded-full text-white/70 hover:bg-white/5 sm:hidden"
                aria-label="Back"
              >
                <BackIcon />
              </button>
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white/5">
                {!isCreator && selectedConversation.creator?.avatarUrl ? (
                  <Image src={selectedConversation.creator.avatarUrl} alt="" fill className="object-cover" unoptimized={!selectedConversation.creator.avatarUrl.startsWith("/")} />
                ) : <div className="h-full w-full bg-white/5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-white">
                  {isCreator ? otherParty.username : selectedConversation.creator?.displayName ?? selectedConversation.creator?.username}
                </p>
                <p className="text-[11px] font-medium text-[var(--status-online)]">Online</p>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[100px] scrollbar-hide">
              {messagesLoading ? (
                <div className="pt-4"><SkeletonChatBubbles count={5} /></div>
              ) : (
                <>
                  {groupedMessages.map((group) => (
                    <div key={group.date}>
                      <DateDivider label={group.date} />
                      <div className="space-y-3">
                        {group.messages.map((m) => {
                          const isMe = (isCreator && m.senderType === "CREATOR") || (!isCreator && m.senderType === "USER");
                          return (
                            <div key={m.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[75%] px-[14px] py-[10px] text-[15px] leading-[1.4] shadow-sm ${
                                  isMe
                                    ? "bg-[#d4a853] text-black rounded-[18px_18px_4px_18px]"
                                    : "bg-[#1a1a2e] text-white rounded-[18px_18px_18px_4px]"
                                }`}
                              >
                                {m.body && <p className="whitespace-pre-wrap break-words">{m.body}</p>}
                                {m.mediaUrl && (
                                  <div className="mt-2 overflow-hidden rounded-lg">
                                    {m.mediaType === "IMAGE" ? (
                                      <img src={m.mediaUrl} alt="" className="max-h-[300px] w-auto rounded-lg object-contain" />
                                    ) : m.mediaType === "VIDEO" ? (
                                      <video src={m.mediaUrl} controls className="max-h-[300px] w-full rounded-lg" />
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="h-4" />
                </>
              )}
            </div>

            {/* Sticky Input Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0a0a0f] p-3 pb-[calc(12px+env(safe-area-inset-bottom))] sm:absolute">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="mx-auto flex max-w-4xl items-center gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="h-[44px] min-w-0 flex-1 rounded-full bg-[#1a1a2e] px-5 text-[16px] text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#d4a853]"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#d4a853] text-black transition-transform active:scale-90 disabled:opacity-50"
                  aria-label="Send"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="hidden flex-1 items-center justify-center px-6 text-center sm:flex">
            <div className="space-y-6">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
                <svg className="h-10 w-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="text-[17px] font-medium text-white/30">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
