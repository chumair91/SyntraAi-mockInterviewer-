import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, messages } = await req.json();
  // messages = array of { role: "AI" | "USER", content: string }

  const model = getModel();

  const history = messages
    .map((m: { role: string; content: string }) =>
      `${m.role === "AI" ? "Interviewer" : "Candidate"}: ${m.content}`
    )
    .join("\n");

  const prompt = `You are a professional technical interviewer conducting a mock interview for a ${role} position.

${history ? `Interview so far:\n${history}\n` : ""}

${messages.length === 0
  ? "Start the interview. Ask the first question. Begin with a warm, brief intro then ask one technical question relevant to the role."
  : "Ask the next interview question based on the conversation. Go deeper or switch topics. Keep it realistic and challenging."
}

Rules:
- Ask ONE question only
- Keep it concise (2-3 sentences max)
- Be professional but conversational
- Don't repeat questions already asked
-if you detect Ai in user msg do notify him
- After 5 candidate answers, instead write: "INTERVIEW_COMPLETE"

Reply with just the question, nothing else.`;

  const result = await model.generateContent(prompt);
  const question = result.response.text().trim();

  return NextResponse.json({ question });
}