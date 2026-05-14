// app/api/webhooks/clerk/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// WHY WEBHOOKS:
// Clerk manages its own user database. Our PostgreSQL DB also needs a User row
// (to relate Interviews to users). The webhook keeps them in sync.
//
// Flow: User signs up on Clerk → Clerk sends POST to this endpoint → we create
// a User row in our DB. User deletes account → Clerk fires user.deleted → we
// clean up our DB.
//
// SECURITY: We verify the webhook signature using svix. Without this, anyone
// could POST to this URL and fake user creation. Svix signs every webhook
// with your CLERK_WEBHOOK_SECRET and we verify the signature here.
//
// INTERVIEW ANSWER: "How do you sync auth users to your DB?"
// → "Clerk fires webhooks on user.created/updated/deleted. I verify the
//   signature with svix, then upsert the user in PostgreSQL via Prisma.
//   This decouples auth from my DB — Clerk handles passwords/OAuth, my DB
//   handles app data."
// ─────────────────────────────────────────────────────────────────────────────

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  // Get the Svix headers Clerk sends with every webhook
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Verify the signature — throws if invalid
  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event type
  switch (evt.type) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name } = evt.data;
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: [first_name, last_name].filter(Boolean).join(" ") || null,
        },
      });
      break;
    }

    case "user.updated": {
      const { id, email_addresses, first_name, last_name } = evt.data;
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0].email_address,
          name: [first_name, last_name].filter(Boolean).join(" ") || null,
        },
      });
      break;
    }

    case "user.deleted": {
      const { id } = evt.data;
      if (id) {
        // onDelete: Cascade in schema means interviews + messages auto-delete too
        await prisma.user.delete({ where: { clerkId: id } });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
