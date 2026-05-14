import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { INTERVIEW_ROLES } from "@/types";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // auth() reads the session — returns userId if logged in, null if not
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();

  // Validate the role — never trust client input
  if (!INTERVIEW_ROLES.includes(role)) {
    return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
  }

  // Find our DB user by their Clerk ID
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  // Create the interview record
  const interview = await prisma.interview.create({
    data: {
      userId: user.id,
      role,
      status: "IN_PROGRESS",
    },
  });

  return NextResponse.json({ success: true, data: interview });
}