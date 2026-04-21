"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Spinner } from "@/components/ui/spinner";
import { forgotPasswordSchema } from "@/lib/validations";

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setSent(true);
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
        {sent ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              If an account exists with that email, we&apos;ve sent a password reset link.
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle>Forgot password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent>
        {!sent && (
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

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        )}

        <p className="mt-5 text-sm text-zinc-400 text-center">
          <Link href="/auth/login" className="text-violet-400 hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
