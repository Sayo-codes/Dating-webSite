import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.S3_REGION ?? "us-east-1";
const BUCKET = process.env.S3_BUCKET ?? "";
const PUBLIC_BASE = process.env.S3_PUBLIC_URL ?? ""; // e.g. https://bucket.s3.region.amazonaws.com or custom CDN
const EXPIRE_SEC = 600; // 10 min

let client: S3Client | null = null;

function getClient(): S3Client | null {
  if (!BUCKET || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) return null;
  if (!client) {
    client = new S3Client({
      region: REGION,
      endpoint: process.env.S3_ENDPOINT ?? undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: !!process.env.S3_FORCE_PATH_STYLE,
    });
  }
  return client;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export type PresignContext = "message" | "avatar" | "banner" | "gallery";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;   // 15 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;  // 100 MB

export function isAllowedContentType(contentType: string): boolean {
  return ALLOWED_MEDIA_TYPES.includes(contentType as (typeof ALLOWED_MEDIA_TYPES)[number]);
}

export function isImageType(contentType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(contentType as (typeof ALLOWED_IMAGE_TYPES)[number]);
}

export function getMaxSizeBytes(contentType: string): number {
  return isImageType(contentType) ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
}

export async function getPresignedPutUrl(params: {
  key: string;
  contentType: string;
}): Promise<{ uploadUrl: string; publicUrl: string } | null> {
  const s3 = getClient();
  if (!s3 || !PUBLIC_BASE) return null;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: params.key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: EXPIRE_SEC });
  const publicUrl = PUBLIC_BASE.replace(/\/$/, "") + "/" + params.key.replace(/^\//, "");
  return { uploadUrl, publicUrl };
}

export function buildKey(params: {
  context: PresignContext;
  ownerId: string;
  filename: string;
  conversationId?: string;
}): string {
  const ext = params.filename.includes(".")
    ? params.filename.slice(params.filename.lastIndexOf("."))
    : "";
  const uuid = crypto.randomUUID();
  if (params.context === "message" && params.conversationId) {
    return `messages/${params.conversationId}/${params.ownerId}/${uuid}${ext}`;
  }
  return `${params.context}/${params.ownerId}/${uuid}${ext}`;
}
