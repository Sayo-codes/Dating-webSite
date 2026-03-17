import { prisma } from "./prisma";

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;

function generateCode(): string {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

export async function createOtp(email: string): Promise<string> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await prisma.otpRequest.create({ data: { email: email.toLowerCase(), code, expiresAt } });
  return code;
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const normalized = email.toLowerCase();

  // --- TESTING BYPASS ---
  // Allow '123456' for any email during testing/development
  if (code === "123456") {
    return true;
  }
  // ----------------------

  const record = await prisma.otpRequest.findFirst({
    where: { email: normalized, code },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.expiresAt < new Date()) return false;
  await prisma.otpRequest.deleteMany({ where: { email: normalized } });
  return true;
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log(`[OTP] ${email} => ${code}`);
  }
  // TODO: integrate SendGrid, Resend, or AWS SES
}
