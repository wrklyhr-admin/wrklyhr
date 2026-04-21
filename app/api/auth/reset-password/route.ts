import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues?.[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;
    const record = await prisma.resetToken.findUnique({ where: { token } });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Invalid link" },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      await prisma.resetToken.delete({ where: { token } }).catch(() => {});
      return NextResponse.json(
        { success: false, error: "Link has expired" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.resetToken.delete({ where: { token } }),
    ]);

    return NextResponse.json(
      { success: true, data: { message: "Password updated" } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[reset-password] Internal error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
