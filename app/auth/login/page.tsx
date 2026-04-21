"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema } from "@/lib/validations";
import { toast } from "@/components/ui/use-toast";

type FormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";

  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleResend = async () => {
    const email = getValues("email");
    if (!email) return;
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    toast({ title: "Verification email sent", description: "Check your inbox." });
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error.includes("EMAIL_NOT_VERIFIED")) {
          toast({
            variant: "destructive",
            title: "Email not verified",
            description: "Please verify your email first.",
            action: (
              <button
                onClick={handleResend}
                className="text-xs font-semibold text-violet-300 hover:underline mt-1"
              >
                Resend verification
              </button>
            ),
          });
        } else {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: "Invalid email or password",
          });
        }
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader className="items-center text-center">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-semibold text-lg text-zinc-50">
            wrkly<span className="text-violet-400">.hr</span>
          </span>
        </Link>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
            hint={
              <Link
                href="/auth/forgot-password"
                className="text-xs text-violet-400 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            }
          >
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="enter your password"
                autoComplete="current-password"
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                tabIndex={-1}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <Button type="submit" className="w-full mt-2" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-5 text-sm text-zinc-400 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/auth" className="text-violet-400 hover:underline font-medium">
            Get started
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
