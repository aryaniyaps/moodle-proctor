"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      });
      const data = (await res.json().catch(() => ({}))) as any;
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Login failed");
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid w-full max-w-4xl grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-8 px-6">
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm px-8 py-8 sm:px-10 sm:py-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                PV
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">ProctorVision</span>
                <span className="text-[11px] text-gray-600 uppercase tracking-wide font-medium">
                  Teacher Console
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-4">
              Sign in
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Access the live monitoring dashboard and AI proctoring tools.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Moodle Username or Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="proctor@university.edu"
                disabled={submitting}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={submitting}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-end text-sm text-gray-600 mt-1">
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </section>

        <section className="hidden lg:flex flex-col justify-between bg-blue-50 rounded-lg border border-blue-200 px-7 py-7">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-blue-900">
                Live Exam Snapshot
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                Active
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-video rounded-lg bg-gray-200 border border-blue-200"
                />
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p className="font-medium">Monitor in real-time</p>
            <p className="text-gray-600">Live webcam feeds, AI alerts, and student activity for secure, scalable examination proctoring.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

