import { getResend } from "./resend";

const FROM = process.env.RESEND_FROM_EMAIL || "wrkly.hr <onboarding@resend.dev>";
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:5000";

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${APP_URL}/auth/verify-email?token=${token}`;
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Verify your wrkly.hr account",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #18181B;">Welcome to wrkly.hr</h2>
        <p style="color: #52525B;">Click the link below to verify your email address. This link expires in 24 hours.</p>
        <p style="margin: 24px 0;">
          <a href="${link}" style="background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Verify Email</a>
        </p>
        <p style="color: #71717A; font-size: 12px;">If the button does not work, copy this link into your browser:<br>${link}</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${APP_URL}/auth/reset-password?token=${token}`;
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Reset your wrkly.hr password",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #18181B;">Reset your password</h2>
        <p style="color: #52525B;">Click the link below to set a new password. This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
        <p style="margin: 24px 0;">
          <a href="${link}" style="background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
        </p>
        <p style="color: #71717A; font-size: 12px;">If the button does not work, copy this link into your browser:<br>${link}</p>
      </div>
    `,
  });
}
