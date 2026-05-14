// types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central TypeScript types for the whole app.
// Prisma types (Interview, Message, User) are imported AFTER you run:
//   npx prisma db push   ← generates the client from schema.prisma
// Until then, we define them manually here so TypeScript doesn't complain.
// Once Prisma generates, swap the manual types for Prisma imports.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ────────────────────────────────────────────────────────────────────
export type InterviewStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
export type MessageRole = "AI" | "USER";

// ─── DB model shapes (matches prisma/schema.prisma exactly) ───────────────────
export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interview {
  id: string;
  userId: string;
  role: string;
  status: InterviewStatus;
  score: number | null;
  resumeUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  interviewId: string;
  role: MessageRole;
  content: string;
  score: number | null;
  feedback: string | null;
  createdAt: Date;
}

// ─── Enriched types (with relations) ─────────────────────────────────────────
export type InterviewWithMessages = Interview & {
  messages: Message[];
};

export type InterviewWithUser = Interview & {
  user: User;
};

// ─── API types ────────────────────────────────────────────────────────────────
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── AI types ─────────────────────────────────────────────────────────────────
export interface AIQuestion {
  question: string;
  context: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface AIFeedback {
  score: number;
  clarity: number;
  depth: number;
  confidence: number;
  feedback: string;
  strongPoints: string[];
  improvementAreas: string[];
}

// ─── Component types ──────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  score?: number;
  feedback?: string;
  createdAt: Date;
}

export interface InterviewSession {
  interviewId: string;
  role: string;
  messages: ChatMessage[];
  status: InterviewStatus;
}

// ─── Role type ────────────────────────────────────────────────────────────────
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
] as const;

export type InterviewRole = (typeof INTERVIEW_ROLES)[number];
