"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, XCircle, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Spinner } from "@/components/ui/spinner";
import { passwordSchema } from "@/lib/validations";
import { toast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof formSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => router.push("/signup/login"), 2000);
      return () => clearTimeout(t);
    }
  }, [done, router]);

  if (!token) {
    return (
      <Card className="w-full max-w-[420px]">
        <CardHeader className="items-center text-center">
          <XCircle className="w-12 h-12 text-red-500 mb-2" />
          <CardTitle>Invalid link</CardTitle>
          <CardDescription>This password reset link is missing or invalid.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/signup/forgot-password">Request a new link</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...values }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast({
          variant: "destructive",
          title: "Could not reset password",
          description: data.error || "Try requesting a new link",
        });
        return;
      }
      setDone(true);
    } catch {
      toast({ variant: "destructive", title: "Network error" });
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
        {done ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
            <CardTitle>Password updated</CardTitle>
            <CardDescription>Redirecting to sign in...</CardDescription>
          </>
        ) : (
          <>
            <CardTitle>Set a new password</CardTitle>
            <CardDescription>Choose a strong password for your account</CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent>
        {!done && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField label="New Password" htmlFor="newPassword" error={errors.newPassword?.message}>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPwd ? "text" : "password"}
                  placeholder="min 8 chars, 1 uppercase, 1 number"
                  className="pr-10"
                  {...register("newPassword")}
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

            <FormField
              label="Confirm Password"
              htmlFor="confirmPassword"
              error={errors.confirmPassword?.message}
            >
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="re-enter your password"
                  className="pr-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <Button type="submit" className="w-full mt-2" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Updating...
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-[420px]">
          <CardContent className="py-10 flex items-center justify-center">
            <Spinner className="w-8 h-8 text-violet-500" />
          </CardContent>
        </Card>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
