import InterviewRoom from "@/components/InterviewRoom";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

 interface Message {
  id: string;
  interviewId: string;
  role: MessageRole;
  content: string;
  score: number | null;
  feedback: string | null;
  createdAt: Date;
}

type MessageRole = "AI" | "USER";

interface paramtype {
  id: string;
}
export default async function InterviewPage({
  params,
}: {
  params: Promise<paramtype>;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!interview) redirect("/dashboard");

  return (
    <InterviewRoom
      interviewId={interview.id}
      role={interview.role}
      status={interview.status}  
      initialMessages={interview.messages.map((m:Message) => ({
        id: m.id,
        role: m.role as "AI" | "USER",
        content: m.content,
        score: m.score ?? undefined,
        feedback: m.feedback ?? undefined,
       
        createdAt: m.createdAt,
      }))}
    />
  );
}
