import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/emails";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      // Always return 200 — never reveal if email exists or is invalid
      return NextResponse.json(
        {
          success: true,
          data: { message: "If this email exists, a reset link was sent" },
        },
        { status: 200 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await prisma.resetToken.deleteMany({ where: { userId: user.id } });

      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await prisma.resetToken.create({
        data: { userId: user.id, token, expiresAt },
      });

      try {
        await sendPasswordResetEmail(email, token);
      } catch (emailErr) {
        console.error("[forgot-password] Failed to send email:", emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: { message: "If this email exists, a reset link was sent" },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[forgot-password] Internal error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
