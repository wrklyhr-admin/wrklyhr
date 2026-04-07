"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Zap } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div className="flex-1 flex flex-col justify-between px-8 md:px-14 py-10 bg-white max-w-xl xl:max-w-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-[#3B5BF5] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-jakarta font-extrabold text-xl text-gray-900 hidden sm:block">
            Wrkly<span className="text-[#3B5BF5]">HR</span>
          </span>
        </Link>

        {/* Form area */}
        <div className="w-full max-w-sm mx-auto py-8">
          <h1 className="font-jakarta text-3xl font-extrabold text-gray-900 mb-1">
            {mode === "signup" ? "Get Started Now" : "Welcome Back"}
          </h1>
          <p className="text-sm text-gray-500 mb-7">
            Enter your credentials to access your account
          </p>

          {/* Social buttons */}
          <div className="flex gap-3 mb-5">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <GoogleIcon />
              Log in with Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <AppleIcon />
              Log in with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Rafiqur Rahman"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#3B5BF5] focus:ring-2 focus:ring-[#3B5BF5]/20 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="rafiqur51@company.com"
                className="w-full px-4 py-2.5 rounded-lg border border-[#3B5BF5] ring-2 ring-[#3B5BF5]/20 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {mode === "login" && (
                  <button className="text-xs font-medium text-[#3B5BF5] hover:underline">
                    Forgot password?
                  </button>
                )}
                {mode === "signup" && (
                  <button className="text-xs font-medium text-[#3B5BF5] hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="min 8 chars"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#3B5BF5] focus:ring-2 focus:ring-[#3B5BF5]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 mt-5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#3B5BF5] cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="underline font-medium text-gray-800 hover:text-[#3B5BF5]">
                Terms &amp; Privacy
              </a>
            </span>
          </label>

          {/* Submit */}
          <button className="w-full mt-5 py-3 rounded-full bg-[#3B5BF5] text-white font-semibold text-sm hover:bg-[#2d4fd4] transition-colors shadow-sm">
            {mode === "signup" ? "Login" : "Sign In"}
          </button>

          {/* Toggle mode */}
          <p className="mt-5 text-sm text-gray-500 text-center">
            {mode === "signup" ? (
              <>
                Have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="font-semibold text-[#3B5BF5] hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="font-semibold text-[#3B5BF5] hover:underline"
                >
                  Get started
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center">
          2024 WrklyHR, All right Reserved
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="hidden lg:flex flex-1 bg-[#3B5BF5] flex-col justify-between px-12 xl:px-16 py-14 relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10">
          <h2 className="font-jakarta text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4 max-w-sm">
            The simplest way to manage your workforce
          </h2>
          <p className="text-blue-200 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Dashboard mockup card */}
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden mt-8">
          <DashboardMockup />
        </div>

        {/* Brand logos */}
        <div className="relative z-10 flex items-center gap-6 mt-8 flex-wrap">
          {["WeChat", "Booking.com", "Google", "Spotify", "Stripe"].map((b) => (
            <span
              key={b}
              className="text-blue-200 text-sm font-semibold opacity-80"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SVG icons ── */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
      <path d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.8 29.3 4.5 24 4.5 12.1 4.5 2.5 14.1 2.5 26S12.1 47.5 24 47.5 45.5 37.9 45.5 26c0-1.9-.2-3.7-.6-5.4H43.6V20.5z" fill="#4285F4" />
      <path d="M6.3 15.7l6.6 4.8C14.7 17 19.1 14 24 14c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 8.4 29.3 6 24 6 16.3 6 9.7 9.9 6.3 15.7z" fill="#EA4335" />
      <path d="M24 46c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 37.6 26.8 38.5 24 38.5c-5.1 0-9.5-3.3-11.2-7.9l-6.6 5.1C9.7 41.9 16.4 46 24 46z" fill="#34A853" />
      <path d="M45.5 26c0-1.9-.2-3.7-.6-5.5H24v8h11.3c-.7 2-2.2 3.7-4.1 4.9l6.2 5.2C41.2 35.4 45.5 31 45.5 26z" fill="#FBBC05" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.6 0 271.3 0 171.2c0-183.9 119.7-281 238-281 63 0 115.4 41.3 154.4 41.3 37.5 0 96.3-43.8 166.5-43.8 26.6 0 108.2 2.6 168.9 99.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

/* ── Dashboard mockup ── */
function DashboardMockup() {
  return (
    <div className="p-4 text-xs font-inter">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <span className="font-bold text-gray-800 text-sm">Dashboard</span>
        <div className="flex items-center gap-1">
          <span className="text-gray-400 text-[10px]">Dec 27, 2022 – Jan 03, 2023</span>
          <div className="flex -space-x-1 ml-2">
            {["#7C3AED", "#3B5BF5", "#10B981"].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white" style={{ background: c }} />
            ))}
          </div>
          <button className="ml-1 text-[10px] text-[#3B5BF5] font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
            + Add members
          </button>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-500 text-[10px] mb-1">Productive Time · <span className="text-green-500">Today</span></p>
          <p className="font-bold text-gray-900 text-lg font-jakarta">12.4 hr</p>
          <p className="text-green-500 text-[10px] mt-0.5">↑ 40% last week</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-500 text-[10px] mb-1">Focused Time</p>
          <p className="font-bold text-gray-900 text-lg font-jakarta">8.5 hr</p>
          <p className="text-red-400 text-[10px] mt-0.5">↓ 15% last week</p>
        </div>
      </div>

      {/* Table header */}
      <p className="text-gray-700 font-semibold mb-1.5 text-[11px]">Team's Utilization</p>
      <div className="grid grid-cols-5 text-[9px] text-gray-400 font-medium mb-1 px-1">
        <span className="col-span-2">Team Name</span>
        <span>Overall</span>
        <span>Over Util.</span>
        <span>Under Util.</span>
      </div>

      {/* Table rows */}
      {[
        { name: "Marketing", level: "HIGH", color: "text-red-500", bar: 40 },
        { name: "Customer Success", level: "MEDIUM", color: "text-yellow-500", bar: 25 },
        { name: "Dev Team", level: "LOW", color: "text-blue-400", bar: 60 },
        { name: "Sales Team", level: "HIGH", color: "text-red-500", bar: 10 },
        { name: "Publicity Team", level: "MEDIUM", color: "text-yellow-500", bar: 10 },
      ].map((row) => (
        <div key={row.name} className="grid grid-cols-5 items-center text-[9px] py-1 border-t border-gray-50 px-1">
          <div className="col-span-2 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex-shrink-0" />
            <span className="text-gray-700 font-medium">{row.name}</span>
          </div>
          <span className={`font-semibold text-[9px] ${row.color}`}>⚡ {row.level}</span>
          <span className="text-gray-500">{row.bar}%</span>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3B5BF5] rounded-full"
              style={{ width: `${row.bar}%` }}
            />
          </div>
        </div>
      ))}

      {/* Add Member floating card */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-52">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-gray-800">Add Member</span>
          <span className="text-gray-400 text-sm cursor-pointer">×</span>
        </div>
        <div className="flex gap-1 mb-2">
          <div className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-[10px] text-gray-400">
            rafiqur@gmail.com
          </div>
          <button className="text-[10px] bg-[#3B5BF5] text-white rounded-lg px-2 font-medium">
            Send
          </button>
        </div>
        <p className="text-[9px] text-gray-500 mb-1.5 font-medium">Members</p>
        {[
          { name: "Leslie Alexander", role: "Owner", teams: "2 teams" },
          { name: "Courtney Henry", role: "Owner", teams: "1 team" },
          { name: "Robert Fox", role: "Editor", teams: "2 teams" },
        ].map((m) => (
          <div key={m.name} className="flex items-center gap-1.5 py-1 border-t border-gray-50">
            <div className="w-5 h-5 rounded-full bg-purple-100 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-gray-800 truncate">{m.name}</p>
              <p className="text-[8px] text-gray-400">{m.teams}</p>
            </div>
            <span className="text-[8px] text-gray-400">{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
