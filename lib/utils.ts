// lib/utils.ts
// ─────────────────────────────────────────────────────────────────────────────
// cn() is a shadcn utility. It merges Tailwind classes intelligently.
//
// WHY: Tailwind classes can conflict. e.g. "p-4 p-8" — which padding wins?
// clsx combines conditional classes. tailwind-merge resolves Tailwind conflicts.
//
// Usage: cn("px-4 py-2", isActive && "bg-blue-500", className)
// ─────────────────────────────────────────────────────────────────────────────

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Interview helpers ────────────────────────────────────────────────────────

// Map score numbers to a label and color for the UI
export function getScoreLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 9) return { label: "Excellent", color: "text-green-600" };
  if (score >= 7) return { label: "Good", color: "text-blue-600" };
  if (score >= 5) return { label: "Average", color: "text-yellow-600" };
  return { label: "Needs work", color: "text-red-600" };
}

// List of supported interview roles
// Putting this in utils means one source of truth — used in UI dropdowns + DB
export const INTERVIEW_ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "React Developer",
  "Node.js Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Product Manager",
  "UI/UX Designer",
] as const; // "as const" makes this a readonly tuple — TypeScript infers exact string literals

// Derive the Role type from the array above
// This way you can never accidentally pass "frontend engineer" (wrong case)
export type InterviewRole = (typeof INTERVIEW_ROLES)[number];

// Format a date nicely: "May 9, 2026"
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
