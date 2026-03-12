"use client";

import { useEffect, useState } from "react";
import { PayPalProvider } from "./PayPalProvider";
import { PremiumPayButton } from "./PremiumPayButton";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

type PremiumContentProps = {
  itemType: string;
  itemId: string;
  amountCents: number;
  description?: string;
  children: React.ReactNode;
};

export function PremiumContent({
  itemType,
  itemId,
  amountCents,
  description,
  children,
}: PremiumContentProps) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(
      `/api/payments/check-unlock?itemType=${encodeURIComponent(itemType)}&itemId=${encodeURIComponent(itemId)}`
    )
      .then((res) => res.json())
      .then((data: { unlocked?: boolean }) => setUnlocked(data.unlocked ?? false))
      .catch(() => setUnlocked(false));
  }, [itemType, itemId]);

  if (unlocked === null) {
    return (
      <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-4 sm:p-6">
        <p className="text-[var(--text-secondary)]">Loading…</p>
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-4 sm:p-6">
      <h3 className="font-[var(--font-heading)] text-lg font-semibold text-white">
        Premium content
      </h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {description ?? "Unlock this content with a one-time payment."}
      </p>
      <p className="mt-1 text-caption">
        ${(amountCents / 100).toFixed(2)} USD
      </p>
      <div className="mt-4">
        {PAYPAL_CLIENT_ID ? (
          <PayPalProvider>
            <PremiumPayButton
              amountCents={amountCents}
              itemType={itemType}
              itemId={itemId}
              description={description}
              onSuccess={() => setUnlocked(true)}
            />
          </PayPalProvider>
        ) : (
          <p className="text-caption">
            PayPal is not configured. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to enable payments.
          </p>
        )}
      </div>
    </div>
  );
}
