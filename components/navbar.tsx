"use client"; // needs client because UserButton uses browser APIs

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="border-b bg-white px-6 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="font-bold text-lg tracking-tight">
        Prep<span className="text-blue-600">AI</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/history" className="text-sm text-gray-500 hover:text-gray-900">
          History
        </Link>
        {/* Clerk's pre-built avatar dropdown — handles sign out automatically */}
        <UserButton />
      </div>
    </nav>
  );
}
