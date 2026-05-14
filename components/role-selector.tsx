"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INTERVIEW_ROLES, type InterviewRole } from "@/types";

// Icons mapped to roles — purely visual
const ROLE_ICONS: Record<string, string> = {
  "Frontend Engineer": "🎨",
  "Backend Engineer": "⚙️",
  "Full Stack Engineer": "🔥",
  "React Developer": "⚛️",
  "Node.js Developer": "🟢",
  "DevOps Engineer": "🚀",
  "Data Scientist": "📊",
  "Machine Learning Engineer": "🤖",
  "Product Manager": "📋",
  "UI/UX Designer": "✏️",
};

export default function RoleSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<InterviewRole | null>(null);
  const [loading, setLoading] = useState(false);

  async function startInterview() {
    if (!selected) return;
    setLoading(true);

    // POST to our API route → creates Interview row in DB → returns the ID
    const res = await fetch("/api/interview/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selected }),
    });

    const data = await res.json();

    if (data.success) {
      // Redirect to the interview room with the new interview's ID
      router.push(`/interview/${data.data.id}`);
    } else {
      alert("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
        Select a role
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {INTERVIEW_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setSelected(role)}
            className={`p-4 rounded-xl border-2 text-left transition-all
              ${selected === role
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
              }`}
          >
            <div className="text-2xl mb-2">{ROLE_ICONS[role]}</div>
            <div className="text-sm font-medium text-gray-800">{role}</div>
          </button>
        ))}
      </div>

      <button
        onClick={startInterview}
        disabled={!selected || loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
          disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {loading ? "Starting..." : "Start Interview →"}
      </button>
    </div>
  );
}