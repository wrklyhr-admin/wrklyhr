import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Invalid link" },
        { status: 400 }
      );
    }

    const record = await prisma.verifyToken.findUnique({ where: { token } });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Invalid link" },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      await prisma.verifyToken.delete({ where: { token } }).catch(() => {});
      return NextResponse.json(
        { success: false, error: "Link has expired" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      }),
      prisma.verifyToken.delete({ where: { token } }),
    ]);

    return NextResponse.json(
      { success: true, data: { message: "Email verified" } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[verify-email] Internal error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
