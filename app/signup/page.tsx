"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap, Check, MapPin, DollarSign, Briefcase } from "lucide-react";

import { signupSchema } from "@/lib/validations";
import { toast } from "@/components/ui/use-toast";

type FormValues = z.infer<typeof signupSchema> & { agree: boolean };

export default function SignupPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      signupSchema.extend({
        agree: z.literal(true, { message: "Please accept the terms to continue" }),
      })
    ),
    defaultValues: { email: "", password: "", confirmPassword: "", agree: false },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });
      const data = await res.json();

      if (res.status === 409) {
        toast({
          variant: "destructive",
          title: "Account exists",
          description: "An account with this email already exists",
        });
        return;
      }

      if (!res.ok || !data.success) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: data.error || "Something went wrong",
        });
        return;
      }

      router.push(`/signup/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Please check your connection and try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full h-11 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition";

  return (
    <div className="w-full max-w-[1180px] bg-white rounded-2xl shadow-sm overflow-hidden grid lg:grid-cols-2 min-h-[680px]">
      {/* LEFT — form */}
      <div className="px-6 sm:px-10 md:px-14 py-8 md:py-10 flex flex-col">
        <Link href="/" className="flex items-center gap-2 self-start">
          <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-semibold text-lg text-zinc-900">
            wrkly<span className="text-violet-600">.hr</span>
          </span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto py-10">
          <h1 className="text-3xl md:text-[34px] font-bold text-zinc-900 tracking-tight">
            Get Started Now
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Create your account to apply for remote roles at US &amp; EU startups.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-800 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className={inputBase}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="min 8 chars, 1 uppercase, 1 number"
                  autoComplete="new-password"
                  className={`${inputBase} pr-10`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-800 mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="re-enter your password"
                  autoComplete="new-password"
                  className={`${inputBase} pr-10`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2.5 text-sm text-zinc-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                  {...register("agree")}
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-violet-600 underline underline-offset-2 hover:text-violet-700">
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/privacy" className="text-violet-600 underline underline-offset-2 hover:text-violet-700">
                    Privacy
                  </Link>
                </span>
              </label>
              {errors.agree && (
                <p className="mt-1 text-xs text-red-600">{errors.agree.message as string}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-500 text-center">
            Have an account?{" "}
            <Link
              href="/signup/login"
              className="text-violet-600 hover:text-violet-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-xs text-zinc-400 text-center pt-4">
          © {new Date().getFullYear()} wrkly.hr — built for Indian tech talent.
        </p>
      </div>

      {/* RIGHT — marketing panel */}
      <div className="hidden lg:flex relative bg-violet-600 text-white px-12 py-12 flex-col overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-500/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-[34px] font-bold leading-tight tracking-tight">
              The fastest way to land a remote tech job at US &amp; EU startups
            </h2>
            <p className="mt-3 text-violet-100 text-sm leading-relaxed">
              wrkly.hr connects verified Indian engineers, designers and PMs with vetted
              startups in San Francisco, New York, London and Berlin — full‑remote, paid in USD.
            </p>
          </div>

          {/* Feature card stack */}
          <div className="mt-8 space-y-3">
            <FeatureCard
              icon={<Briefcase className="w-4 h-4" />}
              title="1,200+ remote roles"
              subtitle="Engineering, design, product, data — all hiring from India."
            />
            <FeatureCard
              icon={<DollarSign className="w-4 h-4" />}
              title="$60K – $180K salaries"
              subtitle="Paid in USD/EUR via compliant contractor agreements."
            />
            <FeatureCard
              icon={<MapPin className="w-4 h-4" />}
              title="Work from anywhere in India"
              subtitle="No relocation. No office. Async-friendly teams only."
            />
            <FeatureCard
              icon={<Check className="w-4 h-4" />}
              title="Verified profiles"
              subtitle="We screen for skill, English fluency and remote readiness — no spam from recruiters."
            />
          </div>

          <div className="mt-auto pt-10">
            <p className="text-[11px] uppercase tracking-widest text-violet-200/80 font-semibold">
              Trusted by talent placed at
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-violet-100 font-semibold text-sm">
              <span>Y&nbsp;Combinator</span>
              <span className="text-violet-300">•</span>
              <span>Sequoia‑backed</span>
              <span className="text-violet-300">•</span>
              <span>Series&nbsp;A–C startups</span>
              <span className="text-violet-300">•</span>
              <span>SF · NYC · London · Berlin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3">
      <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-violet-100/90 leading-relaxed mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
