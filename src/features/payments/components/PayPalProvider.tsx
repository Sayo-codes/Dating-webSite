"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

type Props = { children: React.ReactNode };

export function PayPalProvider({ children }: Props) {
  if (!clientId) {
    return <>{children}</>;
  }
  return (
    <PayPalScriptProvider
      options={{
        clientId,
        intent: "capture",
        vault: false,
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
