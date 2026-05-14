"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Interviewer",
    desc: "Gemini asks real questions tailored to your role and adapts based on your answers in real time.",
  },
  {
    icon: "📊",
    title: "Instant Scoring",
    desc: "Every answer scored on clarity, depth, and confidence with specific actionable improvement tips.",
  },
  {
    icon: "📈",
    title: "Track Progress",
    desc: "Review all past interviews, spot weak areas, and watch your scores improve over time.",
  },
];

const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "React Developer",
  "Node.js Developer",
  "DevOps Engineer",
  "Data Scientist",
  "ML Engineer",
  "Product Manager",
  "UI/UX Designer",
];

const STEPS = [
  { num: "01", title: "Pick a role", desc: "Choose from 10+ tech roles." },
  { num: "02", title: "Start interview", desc: "AI asks tailored questions." },
  {
    num: "03",
    title: "Get feedback",
    desc: "Instant score + tips per answer.",
  },
];

export default function LandingClient() {
  return (
    <main
      style={{ background: "#0a0a0f", color: "#e8e8f0" }}
      className="min-h-screen overflow-x-hidden"
    >
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "rgba(10,10,15,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
        className="flex items-center justify-between px-8 py-4 sticky top-0 z-50 backdrop-blur-xl"
      >
        <span className="font-black text-xl tracking-tight text-white">
          Syntra<span style={{ color: "#6366f1" }}>AI</span>
        </span>
        <div className="flex gap-3 items-center">
          <Link
            href="/sign-in"
            style={{ color: "#9ca3af" }}
            className="text-sm px-4 py-2 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{ background: "#6366f1" }}
            className="text-sm text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Get started
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-8 pt-28 pb-20 text-center overflow-hidden">
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "20%",
            width: 300,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
          }}
          className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-8"
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: "#6366f1",
              borderRadius: "50%",
              display: "inline-block",
            }}
            className="animate-pulse"
          />
          AI-powered interview practice
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-6xl md:text-7xl font-black tracking-tight mb-6"
          style={{ lineHeight: 1.05, color: "#ffffff" }}
        >
          Ace your next
          <br />
          <span style={{ color: "#6366f1" }}>tech interview</span>
          <br />
          with AI coaching
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          style={{ color: "#9ca3af" }}
          className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Practice with SyntraAI — an intelligent interviewer tailored to your
          role. Get instant scores and improvement tips after every answer.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            href="/sign-up"
            style={{
              background: "#6366f1",
              boxShadow: "0 0 40px rgba(99,102,241,0.4)",
            }}
            className="text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
          >
            Start practicing free →
          </Link>
          <Link
            href="/sign-in"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#d1d5db",
            }}
            className="px-8 py-4 rounded-xl font-semibold text-lg hover:border-white/30 transition-colors"
          >
            Sign in
          </Link>
        </motion.div>
      </section>

      {/* Mock chat preview */}
      <section className="max-w-3xl mx-auto px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}
          className="rounded-2xl overflow-hidden"
        >
          <div
            style={{
              background: "#0d0d14",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
            className="px-4 py-3 flex items-center gap-2"
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#f59e0b",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span style={{ color: "#4b5563", fontSize: 12, marginLeft: 8 }}>
              syntraai.com/interview/frontend-engineer
            </span>
          </div>
          <div className="p-6 space-y-4">
            {/* AI message */}
            <div className="flex gap-3">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(99,102,241,0.2)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  flexShrink: 0,
                }}
                className="flex items-center justify-center text-sm"
              >
                🤖
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#d1d5db",
                }}
                className="rounded-2xl rounded-tl-none px-4 py-3 text-sm max-w-sm leading-relaxed"
              >
                Tell me about a challenging React performance issue you've
                solved and how you approached it.
              </div>
            </div>
            {/* User message */}
            <div className="flex gap-3 justify-end">
              <div
                style={{ background: "#6366f1", color: "white" }}
                className="rounded-2xl rounded-tr-none px-4 py-3 text-sm max-w-sm leading-relaxed"
              >
                I had excessive re-renders due to inline object props. Used
                useMemo to memoize the value and React.memo on the component to
                prevent unnecessary renders...
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  flexShrink: 0,
                }}
                className="flex items-center justify-center text-sm"
              >
                👤
              </div>
            </div>
            {/* Score */}
            <div className="flex gap-3">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(99,102,241,0.2)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  flexShrink: 0,
                }}
                className="flex items-center justify-center text-sm"
              >
                🤖
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                className="rounded-2xl rounded-tl-none px-4 py-3 text-sm max-w-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: "#ffffff", fontWeight: 600 }}>
                    Score: 8.5/10
                  </span>
                  <span
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      color: "#4ade80",
                      fontSize: 11,
                    }}
                    className="px-2 py-0.5 rounded-full font-medium"
                  >
                    Great
                  </span>
                </div>
                <p style={{ color: "#9ca3af" }}>
                  Good use of memoization. Next: explain the difference between
                  useCallback and useMemo...
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-24" style={{ background: "#0d0d14" }}>
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p
              style={{ color: "#6366f1", fontSize: 12, letterSpacing: 3 }}
              className="font-semibold uppercase mb-3"
            >
              How it works
            </p>
            <h2 className="text-4xl font-black text-white">
              Three steps to interview-ready
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: "rgba(99,102,241,0.15)",
                  }}
                  className="mb-4"
                >
                  {step.num}
                </div>
                <h3
                  style={{ color: "#ffffff" }}
                  className="text-lg font-bold mb-2"
                >
                  {step.title}
                </h3>
                <p style={{ color: "#6b7280" }} className="text-sm">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            style={{ color: "#6366f1", fontSize: 12, letterSpacing: 3 }}
            className="font-semibold uppercase mb-3"
          >
            Features
          </p>
          <h2 className="text-4xl font-black text-white">
            Everything you need to prepare
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              className="p-6 rounded-2xl cursor-default"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 style={{ color: "#ffffff" }} className="font-bold mb-2">
                {f.title}
              </h3>
              <p
                style={{ color: "#6b7280" }}
                className="text-sm leading-relaxed"
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="py-16" style={{ background: "#0d0d14" }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p
            style={{ color: "#4b5563", fontSize: 12, letterSpacing: 3 }}
            className="uppercase mb-8"
          >
            Practice for any role
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ROLES.map((role, i) => (
              <motion.span
                key={role}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#9ca3af",
                }}
                className="px-4 py-2 rounded-full text-sm hover:border-indigo-500/50 hover:text-indigo-400 transition-colors cursor-default"
              >
                {role}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f0f1a 0%, #1a1030 50%, #0f0f1a 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to start practicing?
          </h2>
          <p style={{ color: "#6b7280" }} className="mb-10 text-lg">
            Free to use. No credit card required.
          </p>
          <Link
            href="/sign-up"
            style={{
              background: "#6366f1",
              boxShadow: "0 0 60px rgba(99,102,241,0.5)",
            }}
            className="text-white px-10 py-4 rounded-xl font-bold text-lg inline-block hover:opacity-90 transition-all hover:scale-105"
          >
            Get started free →
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#0a0a0f",
        }}
        className="py-8 px-8 flex items-center justify-between text-sm"
      >
        <span className="font-black text-white">
          Syntra<span style={{ color: "#6366f1" }}>AI</span>
        </span>
        <span style={{ color: "#4b5563" }}>AI-powered mock interviews</span>
      </footer>
    </main>
  );
}
