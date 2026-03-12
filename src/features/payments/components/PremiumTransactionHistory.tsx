"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  itemType: string | null;
  itemId: string | null;
  createdAt: string;
};

export function PremiumTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments/transactions")
      .then((res) => res.json())
      .then((data: { transactions?: Transaction[] }) => {
        setTransactions(data.transactions ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (transactions.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-4 sm:p-6">
      <h2 className="section-heading mb-4">Transaction history</h2>
      <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 py-3 last:border-0"
          >
            <span>
              {(t.amountCents / 100).toFixed(2)} {t.currency}
            </span>
            <span className="text-white/50">
              {t.itemType ?? "—"} {t.itemId ?? ""}
            </span>
            <span
              className={
                t.status === "COMPLETED"
                  ? "text-emerald-400"
                  : t.status === "FAILED"
                    ? "text-red-400"
                    : "text-white/60"
              }
            >
              {t.status}
            </span>
            <span className="text-white/50">
              {new Date(t.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
