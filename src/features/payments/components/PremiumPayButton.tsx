"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

type PremiumPayButtonProps = {
  amountCents: number;
  itemType: string;
  itemId: string;
  description?: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
};

export function PremiumPayButton({
  amountCents,
  itemType,
  itemId,
  description,
  onSuccess,
  onError,
}: PremiumPayButtonProps) {
  const [completed, setCompleted] = useState(false);

  const createOrder = async () => {
    const res = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountCents,
        currency: "USD",
        itemType,
        itemId,
        description,
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? "Failed to create order");
    }
    const data = (await res.json()) as { orderId: string };
    return data.orderId;
  };

  const onApprove = async (data: { orderID?: string }) => {
    if (!data.orderID) return;
    const res = await fetch("/api/payments/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: data.orderID }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      onError?.(err.error ?? "Payment failed");
      return;
    }
    setCompleted(true);
    onSuccess?.();
  };

  if (completed) {
    return (
      <p className="text-sm text-emerald-400">Payment completed. Content unlocked.</p>
    );
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={(err) => onError?.(err.message ?? "PayPal error")}
      style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
    />
  );
}
