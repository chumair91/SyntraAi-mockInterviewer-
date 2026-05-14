"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { ChatMessage } from "@/types";

interface Props {
  interviewId: string;
  role: string;
  initialMessages: ChatMessage[];
  status: string;
}

export default function InterviewRoom({
  interviewId,
  role,
  initialMessages,
  status,
}: Props) {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [done, setDone] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, aiThinking]);

  async function fetchNextQuestion(currentMessages: ChatMessage[]) {
    setAiThinking(true);

    try {
      const { data } = await axios.post("/api/ai/question", {
        role,
        messages: currentMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      if (data.question === "INTERVIEW_COMPLETE") {
        await finishInterview(currentMessages);
        return;
      }

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "AI",
        content: data.question,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setAiThinking(false);
    }
  }

  // First question
  useEffect(() => {
    if (initialMessages.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNextQuestion([]);
    }
  }, []);

  async function submitAnswer() {
    if (!answer.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "USER",
      content: answer.trim(),
      createdAt: new Date(),
    };

    // Find last AI question
    const lastQuestion = [...messages].reverse().find((m) => m.role === "AI");

    if (!lastQuestion) return;

    setLoading(true);
    setAnswer("");

    // Optimistic update
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const { data } = await axios.post(
        `/api/interview/${interviewId}/feedback`,
        {
          question: lastQuestion.content,
          answer: userMessage.content,
          role,
        },
      );

      // Add score + feedback
      const scoredMessage: ChatMessage = {
        ...userMessage,
        score: data.feedback.score,
        feedback: data.feedback.feedback,
      };

      const messagesWithScore = [...messages, scoredMessage];

      setMessages(messagesWithScore);

      // Fetch next question
      await fetchNextQuestion(messagesWithScore);
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  }

  async function finishInterview(finalMessages: ChatMessage[]) {
    const scored = finalMessages.filter((m) => m.role === "USER" && m.score);

    const avg = scored.length
      ? scored.reduce((sum, m) => sum + (m.score ?? 0), 0) / scored.length
      : 0;

    try {
      await axios.post(`/api/interview/${interviewId}/finish`, {
        score: avg,
      });

      setDone(true);
    } catch (error) {
      console.error("Error finishing interview:", error);
    }
  }

  // Interview Finished Screen
  if (done) {
    const scored = messages.filter((m) => m.role === "USER" && m.score);

    const avg = scored.length
      ? scored.reduce((sum, m) => sum + (m.score ?? 0), 0) / scored.length
      : 0;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Interview Complete!
          </h2>

          <p className="text-gray-500 mb-6">Here's how you did</p>

          <div className="text-6xl font-bold text-blue-600 mb-2">
            {avg.toFixed(1)}
          </div>

          <div className="text-gray-400 mb-8">Overall Score / 10</div>

          <div className="space-y-3 text-left mb-8">
            {scored.map((m, i) => (
              <div
                key={m.id}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-xl"
              >
                <span className="text-sm text-gray-600">Q{i + 1}</span>

                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {m.score}/10
                  </div>

                  <div className="text-xs text-gray-400 max-w-xs">
                    {m.feedback}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-900">{role}</div>

          <div className="text-sm text-gray-400">Mock Interview</div>
        </div>

        <div className="text-sm text-gray-400">
          {messages.filter((m) => m.role === "USER").length}
          /5 answered
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "USER" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] ${
                m.role === "USER" ? "items-end" : "items-start"
              } flex flex-col gap-1`}
            >
              {/* Label */}
              <span className="text-xs text-gray-400 px-1">
                {m.role === "AI" ? "🤖 Interviewer" : "👤 You"}
              </span>

              {/* Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${
                  m.role === "AI"
                    ? "bg-white border border-gray-200 text-gray-800"
                    : "bg-blue-600 text-white"
                }`}
              >
                {m.content}
              </div>

              {/* Feedback */}
              {m.role === "USER" && m.score && (
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs max-w-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      Score: {m.score}/10
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full font-medium
                      ${
                        m.score >= 8
                          ? "bg-green-100 text-green-700"
                          : m.score >= 6
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {m.score >= 8
                        ? "Great"
                        : m.score >= 6
                          ? "Good"
                          : "Needs work"}
                    </span>
                  </div>

                  <p className="text-gray-500">{m.feedback}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* AI Thinking */}
        {aiThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex gap-1 items-center">
              <span className="text-xs text-gray-400 mr-2">🤖 Thinking</span>

              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}

      {/* Input — locked if already completed */}
      {status === "COMPLETED" ? (
        <div className="bg-gray-50 border-t px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 text-gray-400 text-sm py-2">
            <span>🔒</span>
            <span>
              This interview is closed. Start a new one from the dashboard.
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white border-t px-4 py-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitAnswer();
                }
              }}
              placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
              rows={2}
              disabled={loading || aiThinking}
              className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              onClick={submitAnswer}
              disabled={!answer.trim() || loading || aiThinking}
              className="bg-blue-600 text-white px-6 rounded-xl font-medium text-sm
          disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
