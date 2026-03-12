/**
 * PayPal REST API (sandbox) – create order, capture, webhook verification.
 * Env: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID (for webhook verification).
 */

const BASE_URL =
  process.env.PAYPAL_SANDBOX === "false"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal token failed: ${err}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

export type CreateOrderParams = {
  amountCents: number;
  currency?: string;
  itemType?: string;
  itemId?: string;
  description?: string;
};

export async function createPayPalOrder(params: CreateOrderParams): Promise<string> {
  const { amountCents, currency = "USD", description } = params;
  const value = (amountCents / 100).toFixed(2);
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value,
          },
          description: description ?? "Premium content",
        },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal create order failed: ${err}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

export async function capturePayPalOrder(orderId: string): Promise<{ captureId: string }> {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }
  const data = (await res.json()) as {
    status: string;
    purchase_units?: Array<{
      payments?: { captures?: Array<{ id: string }> };
    }>;
  };
  const captureId =
    data.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? "";
  return { captureId };
}

export async function verifyWebhookSignature(params: {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
  webhookId: string;
  webhookEvent: unknown;
}): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      auth_algo: params.authAlgo,
      cert_url: params.certUrl,
      transmission_id: params.transmissionId,
      transmission_sig: params.transmissionSig,
      transmission_time: params.transmissionTime,
      webhook_id: webhookId,
      webhook_event: params.webhookEvent,
    }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { verification_status: string };
  return data.verification_status === "SUCCESS";
}
