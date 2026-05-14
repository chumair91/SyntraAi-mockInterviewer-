import { currentUser } from "@clerk/nextjs/server";

import Link from "next/link";
import RoleSelector from "@/components/role-selector";

import { formatDate } from "@/lib/utils";
import prisma from "@/lib/prisma";
type Interview = {
  id: string;
  role: string;
  status: string;
  score: number | null;
  createdAt: Date;
  userId: string;
};



export default async function DashboardPage() {
  const user = await currentUser();

  // Fetch recent interviews — server component so no useEffect needed
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user!.id },
    include: {
      interviews: {
        orderBy: { createdAt: "desc" },
        take: 5, // last 5 only
      },
    },
  });
 const interviews: Interview[] = dbUser?.interviews ?? [];

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Hey {user?.firstName ?? "there"} 👋
        </h1>
        <p className="text-gray-500 mt-1">Pick a role and start practicing.</p>
      </div>

      {/* Role selector */}
      <RoleSelector />

      {/* Recent interviews */}
      {interviews.length ? (
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
            Recent interviews
          </h2>
          <div className="space-y-2">
            {interviews.map((interview) => (
              <Link
                key={interview.id}
                href={`/interview/${interview.id}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {interview.role}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(interview.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {interview.score && (
                    <span className="text-blue-600 font-semibold">
                      {interview.score.toFixed(1)}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded-full
                    ${
                      interview.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : interview.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {interview.status.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
