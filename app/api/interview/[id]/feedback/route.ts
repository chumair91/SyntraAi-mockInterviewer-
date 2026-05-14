import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getModel } from "@/lib/gemini";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question, answer, role } = await req.json();
  const { id: interviewId } = await params;

  const model = getModel();

  const prompt = `You are evaluating a candidate's answer in a mock interview for a ${role} position.

Question asked: "${question}"
Candidate's answer: "${answer}"

Score this answer,if you detect Ai response decrease score and write valid reason that user used ai and respond ONLY with valid JSON in this exact format:
{
  "score": <number 1-10>,
  "clarity": <number 1-10>,
  "depth": <number 1-10>,
  "feedback": "<2-3 sentences of specific, actionable feedback>",
  "strongPoints": ["<point 1>", "<point 2>"],
  "improvementAreas": ["<area 1>", "<area 2>"]
}`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps in ```json
  text = text.replace(/```json|```/g, "").trim();

  const feedback = JSON.parse(text);

  // Save the Q&A + feedback to DB
  await prisma.message.create({
    data: { interviewId, role: "AI", content: question }
  });
  await prisma.message.create({
    data: {
      interviewId,
      role: "USER",
      content: answer,
      score: feedback.score,
      feedback: feedback.feedback,
    }
  });

  return NextResponse.json({ success: true, feedback });
}