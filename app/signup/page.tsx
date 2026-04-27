"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Spinner } from "@/components/ui/spinner";
import { signupSchema } from "@/lib/validations";
import { toast } from "@/components/ui/use-toast";

type FormValues = z.infer<typeof signupSchema>;

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
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
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
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start your remote job search today</CardDescription>
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

          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="min 8 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
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
                autoComplete="new-password"
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-5 text-sm text-zinc-400 text-center">
          Already have an account?{" "}
          <Link href="/signup/login" className="text-violet-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
