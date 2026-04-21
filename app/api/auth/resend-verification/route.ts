import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { resendVerificationSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/emails";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resendVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues?.[0]?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return 200 - never leak whether email exists
    if (!user || user.emailVerified) {
      return NextResponse.json(
        { success: true, data: { message: "Verification email sent" } },
        { status: 200 }
      );
    }

    await prisma.verifyToken.deleteMany({ where: { userId: user.id } });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verifyToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    try {
      await sendVerificationEmail(email, token);
    } catch (emailErr) {
      console.error("[resend-verification] Failed to send email:", emailErr);
    }

    return NextResponse.json(
      { success: true, data: { message: "Verification email sent" } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[resend-verification] Internal error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
