import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/emails";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues?.[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const lowerEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: lowerEmail } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: lowerEmail,
          passwordHash,
          role: "TALENT",
          emailVerified: false,
        },
      });
      await tx.subscription.create({
        data: { userId: newUser.id, plan: "FREE", status: "active" },
      });
      await tx.verifyToken.create({
        data: { userId: newUser.id, token, expiresAt },
      });
      return newUser;
    });

    try {
      await sendVerificationEmail(lowerEmail, token);
    } catch (emailErr) {
      console.error("[signup] Failed to send verification email:", emailErr);
    }

    return NextResponse.json(
      { success: true, data: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[signup] Internal error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
