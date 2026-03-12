"use client";

import { useEffect, useState } from "react";

type Counts = {
  users: number;
  creators: number;
  conversations: number;
  messages: number;
};

type DayPoint = { date: string; count: number };

type RecentUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

type RecentConv = {
  id: string;
  user: string;
  creator: string;
  updatedAt: string;
};

export function AdminAnalyticsClient() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [messagesByDay, setMessagesByDay] = useState<DayPoint[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentConvs, setRecentConvs] = useState<RecentConv[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data: {
        counts: Counts;
        messagesByDay: DayPoint[];
        recentUsers: RecentUser[];
        recentConversations: RecentConv[];
      }) => {
        setCounts(data.counts ?? null);
        setMessagesByDay(data.messagesByDay ?? []);
        setRecentUsers(data.recentUsers ?? []);
        setRecentConvs(data.recentConversations ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white/60">Loading…</p>;

  const maxCount = Math.max(1, ...messagesByDay.map((d) => d.count));

  return (
    <div className="space-y-8">
      {counts && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
            <p className="text-sm text-white/60">Users</p>
            <p className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-white">{counts.users}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
            <p className="text-sm text-white/60">Creators</p>
            <p className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-white">{counts.creators}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
            <p className="text-sm text-white/60">Conversations</p>
            <p className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-white">{counts.conversations}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
            <p className="text-sm text-white/60">Messages</p>
            <p className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-white">{counts.messages}</p>
          </div>
        </div>
      )}

      {messagesByDay.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
          <h2 className="section-heading mb-4">Messages (last 30 days)</h2>
          <div className="flex items-end gap-1 h-48">
            {messagesByDay.map((d) => (
              <div
                key={d.date}
                className="flex-1 min-w-0 rounded-t bg-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/60 transition-colors"
                style={{ height: `${(d.count / maxCount) * 100}%` }}
                title={`${d.date}: ${d.count}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/50">
            <span>{messagesByDay[0]?.date}</span>
            <span>{messagesByDay[messagesByDay.length - 1]?.date}</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
          <h2 className="section-heading mb-4">Recent users</h2>
          <ul className="space-y-2 text-sm">
            {recentUsers.map((u) => (
              <li key={u.id} className="flex justify-between text-white/80">
                <span>{u.username} ({u.email})</span>
                <span className="text-white/50">{u.role}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
          <h2 className="section-heading mb-4">Recent conversations</h2>
          <ul className="space-y-2 text-sm text-white/80">
            {recentConvs.map((c) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.user} ↔ {c.creator}</span>
                <span className="text-white/50">{new Date(c.updatedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
