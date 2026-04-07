import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const emailStyles = `
  body {
    background-color: #050505;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .header {
    text-align: center;
    margin-bottom: 32px;
  }
  .logo {
    color: #f0c97a;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-decoration: none;
    text-transform: uppercase;
  }
  .card {
    background-color: #0a0a0f;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
    text-align: center;
  }
  .title {
    font-size: 20px;
    margin-top: 0;
    margin-bottom: 16px;
  }
  .text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 32px;
  }
  .btn {
    background: linear-gradient(135deg, #d4a853 0%, #f0c97a 100%);
    border-radius: 999px;
    color: #05060a;
    display: inline-block;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    padding: 14px 32px;
  }
  .footer {
    color: rgba(255, 255, 255, 0.4);
    font-size: 13px;
    margin-top: 32px;
    text-align: center;
  }
`;

export async function sendOtpEmail(to: string, code: string) {
  await resend.emails.send({
    from: "noreply@rsdate.com",
    to,
    subject: "Verify your RSDate account",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${APP_URL}" class="logo">RSDate</a>
          </div>
          <div class="card">
            <h1 class="title">Verification Code</h1>
            <p class="text">
              Your 6-digit code is below. It will expire in 10 minutes.
            </p>
            <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid rgba(212, 168, 83, 0.2);">
              <span style="font-size: 32px; font-weight: 700; letter-spacing: 0.2em; color: #f0c97a;">${code}</span>
            </div>
            <p class="text" style="font-size: 13px;">
              If you didn't request this code, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "noreply@rsdate.com",
    to,
    subject: "Reset your RSDate password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${emailStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${APP_URL}" class="logo">RSDate</a>
          </div>
          <div class="card">
            <h1 class="title">Password Reset</h1>
            <p class="text">
              We received a request to reset your password. Click the button below to choose a new password.<br>
              This link will expire in 1 hour.<br><br>
              <small>If you didn't request this, ignore this email.</small>
            </p>
            <a href="${resetLink}" class="btn">Reset Password</a>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
